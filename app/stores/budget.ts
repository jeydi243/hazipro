import { defineStore } from 'pinia'

export interface FilterBudget {
  comptes: string[] | null
}

export const useStoreBudget = defineStore('budget', {
  state: () => ({
    total: 0,
    budgets: [] as any[],
    budgets_correlation: [] as any[],
  }),
  getters: {
    getListBudgets:
      state =>
      ({ comptes }: FilterBudget) => {
        if (comptes?.length > 0) {
          return state.budgets.filter(bud => comptes.includes(bud.COMPTE_BUDGETAIRE))
        }
        return state.budgets
      },
  },
  actions: {
    async init() {
      const changes = useSupabaseClient()
        .channel('table-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'budgets',
          },
          payload => {
            console.log('Inserted value in table budgets ', payload)

            this.budgets.push(payload as object)
          }
        )
        .subscribe()
      const { data, error } = await useSupabaseClient().from('budgets').select('*, org:organisations!CRG_GERANT(organisation_id, name)')
      if (!error) {
        this.budgets = data
        console.log({ data })
        await this.getBudgetCorrelation()
      } else {
        console.log('Un erreur est survenue ', error)
      }
      console.log('Budgets store initiated !')
    },
    async updateBudgetLine(filter, updatedValue) {
      return 0
    },
    async getBudgetCorrelation() {
      const { data, error } = await useSupabaseClient().from('budgets_correlation').select('*')
      if (!error) this.budgets_correlation = data
    },
  },
})
