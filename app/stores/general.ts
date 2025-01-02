import { defineStore } from 'pinia'
import type { Lookups, Classe, Matrice } from '~/types'

export interface FilterBudget {
  comptes: string[] | null
}

export interface StoreGeneral {
  devises: any[]
  lookups: Lookups[]
  classes: Classe[]
  codes_tresorerie: any[]
  matrices: Matrice[]
}
export const useStoreGeneral = defineStore('general', {
  state: (): StoreGeneral => ({
    devises: [] as string[],
    lookups: [] as Lookups[],
    classes: [] as Classe[],
    codes_tresorerie: [] as any[],
    matrices: [] as Matrice[],
  }),
  getters: {
    getDevises: state => state.lookups.filter(el => el.classe_id.table_name == 'DEVISES'),
    PaymentsGroups: state => state.lookups.filter(el => el.classe_id.table_name == 'GROUPES_PAIEMENT'),
    getFullLookups: state =>
      state.lookups.reduce((acc, lookup) => {
        let classe = state.classes.find(el => el.id == lookup.classe_id.id)
        acc.push({ ...lookup, ...classe })

        return acc
      }, [] as object[]),
    getMatrices: state => state.matrices,
  },
  actions: {
    async init() {
      const supabase = useSupabaseClient()
      const changes = supabase
        .channel('table-db-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'lookups',
          },
          payload => {
            console.log('Inserted value in table lookups ', payload)

            this.lookups.push(payload.new as Lookups)
          }
        )
        .subscribe()
      const { data: lookups, error: errorlookups } = await supabase.from('lookups').select('*, classe:classes!classe_id(classe_id, name)')
      const { data: matrices, error: errormatrices } = await supabase.from('matrices').select('*')
      const { data: classes, error: errorclasses } = await supabase.from('classes').select('*')
      const { data: codes_tresorerie, error: errorcodes_tresorerie } = await supabase.from('codes_tresorerie').select('*')

      if (!errorlookups && !errormatrices && !errorclasses && !errorcodes_tresorerie) {
        this.lookups = lookups
        this.matrices = matrices
        this.classes = classes
        this.codes_tresorerie = codes_tresorerie
        console.log({ lookups })
      } else {
        console.log('Un erreur est survenue ', { errorclasses }, { errorlookups }, { errorcodes_tresorerie }, { errormatrices })
      }
      console.log('General store initiated !')
    },
  },
})
