import type { SupabaseClient, User } from '@supabase/supabase-js'

interface storeAuth {
  user: User
  description: string
  baseUrl: string
  orgs: Org[]
  supabase: SupabaseClient | null | any
}

export const useOrg = defineStore('org', {
  state: (): storeAuth => ({
    baseUrl: 'http://127.0.0.1:4000/v1',
    description: '',
    supabase: null,
  }),
  getters: {
    getOrgs(state: storeAuth) {
      return state.getters.getCrgs
    },
    getListCrg(state: storeAuth) {
      return state.orgs.filter(org => (org.tag_budget = 'Y'))
    },
    getListCr(state: storeAuth) {
      return state.orgs.filter(org => (org.tag_cr = 'Y'))
    },
  },
  actions: {
    async init() {
      this.supabase = useSupabaseClient()
    },
    async assign_to_org(payload: any) {
      const { data, error } = await this.supabase.from('users_access_rights').insert(payload)
      console.log({ data, error })
      return { data, error }
    },
  },
})
