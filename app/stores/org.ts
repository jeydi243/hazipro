import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { Organisation } from '~/types'

interface storeOrg {
  baseUrl: string
  orgs: Organisation[] | []
  supabase: SupabaseClient | null | any
}

export const useOrg = defineStore('organisation', {
  state: (): storeOrg => ({
    baseUrl: 'http://127.0.0.1:4000/v1',
    supabase: null,
    orgs: [] as Organisation[],
  }),
  getters: {
    getOrgs: (state: storeOrg) => state.orgs,
    getListCrg: (state: storeOrg) => (state.orgs ? state.orgs.filter(org => org.lookup_id == 1) : []),
    getListCr: (state: storeOrg) => (state.orgs ? state.orgs.filter(org => org.lookup_id == 2) : []),
  },
  actions: {
    async init() {
      this.supabase = useSupabaseClient()
      const { data, error } = await this.supabase.from('organisations').select(`
            organisation_id,
            name,
            code,
            organisation_parent_id`)
      if (!error) {
        console.log('Organisations retrieved ', data)
        this.orgs = data
      } else {
        console.log(error)
      }
      console.log('Store organisation initiated !')
    },
    async assign_to_org(payload: any) {
      const { data, error } = await this.supabase.from('users_access_rights').insert(payload)
      console.log({ data, error })
      return { data, error }
    },
  },
})
