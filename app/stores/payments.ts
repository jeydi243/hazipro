import { defineStore } from 'pinia'

export interface FilterPayments {
  comptes: string[] | null
}
export interface StorePayments {
  payment_plan_headers: Array<any>
  payment_plan_lines: Array<any>
  payment_headers: Array<any>
  payment_lines: Array<any>
}
export const useStorePayments = defineStore('payments', {
  state: () => ({
    payment_plan_headers: [] as any[],
    payment_plan_lines: [] as any[],
    payment_headers: [] as any[],
    payment_lines: [] as any[],
  }),
  getters: {
    getPaymentsPlanHeader:
      state =>
      ({ comptes }: FilterPayments) => {
        if (comptes?.length > 0) {
          return state.payment_plan_headers.filter(bud => comptes.includes(bud.COMPTE_BUDGETAIRE))
        }
        return state.payment_plan_headers
      },
  },
  actions: {
    async init() {
      const supabase = useSupabaseClient()
      const { data, error } = await supabase.from('payment_plan_headers').select('*, groupe_paiment:lookups!payment_group_id(lookup_id, name, code)')
      if (!error) {
        this.payment_plan_headers = data
        console.log({ data })
      } else {
        console.log('Un erreur est survenue ', { error })
      }
      console.log('Payments store initiated !')
    },
    async updateBudgetLine(filter, updatedValue) {
      return 0
    },
    async addPaymentPlanHeader(payload) {
      const { data, error } = await useSupabaseClient().from('lookups').insert(payload)
      if (!error) this.payment_plan_headers.push(data)

      return { statut: 'success' }
    },
  },
})
