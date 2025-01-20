import { defineStore } from 'pinia'
import type { Lookups, Classe, Matrice, Beneficiaire } from '~/types'

export interface StoreGeneral {
  devises: any[]
  lookups: Lookups[]
  classes: Classe[]
  codes_tresorerie: any[]
  matrices: Matrice[]
  beneficiaires: Beneficiaire[]
}
export const useStoreGeneral = defineStore('general', {
  state: (): StoreGeneral => ({
    devises: [] as string[],
    lookups: [] as Lookups[],
    classes: [] as Classe[],
    codes_tresorerie: [] as any[],
    matrices: [] as Matrice[],
    beneficiaires: [] as Beneficiaire[],
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
    getEmployes: state => state.beneficiaires.filter(benef => benef.category == 'Employé'),
    getTiers: state => state.beneficiaires.filter(benef => benef.category == 'Tiers'),
  },
  actions: {
    async init() {
      const supabase = useSupabaseClient()
      const { data: lookups, error: errorlookups } = await supabase.from('lookups').select('*, classe:classes!classe_id(classe_id, description)')
      const { data: matrices, error: errormatrices } = await supabase.from('matrices').select('*')
      const { data: classes, error: errorclasses } = await supabase.from('classes').select('*')
      const { data: codes_tresorerie, error: errorcodes_tresorerie } = await supabase.from('codes_tresorerie').select('*')
      const { data: beneficiaires, error: errorbeneficiaires } = await supabase.from('beneficiaires').select('*')

      if (!errorlookups && !errormatrices && !errorclasses && !errorcodes_tresorerie && !errorbeneficiaires) {
        this.lookups = lookups
        this.matrices = matrices
        this.classes = classes
        this.beneficiaires = beneficiaires
        this.codes_tresorerie = codes_tresorerie
        console.log({ lookups })
      } else {
        console.log('Un erreur est survenue ', { errorclasses }, { errorlookups }, { errorcodes_tresorerie }, { errormatrices })
      }
      console.log('General store initiated !')
    },
  },
})
