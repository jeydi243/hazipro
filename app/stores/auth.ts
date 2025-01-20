import type { User } from '@supabase/supabase-js'

interface storeAuth {
  user: User
  description: string
  baseUrl: string
  users: User[]
  users_access_rights: any[]
}

export const useStoreAuth = defineStore('auth', {
  state: (): storeAuth => ({
    user: null,
    users: [],
    baseUrl: 'http://127.0.0.1:4000/v1',
    description: '',
    users_access_rights: [],
  }),
  actions: {
    async init() {
      try {
        await this.getAccessRights()
      } catch (error) {
        console.log(error)
      }
    },
    async onSignedOut() {
      this.users_access_rights = []
    },
    async signIn(email: string, password: string) {
      const { data, error } = await useSupabaseClient().auth.signInWithPassword({
        email: email,
        password: password,
      })

      this.user = data.user
      console.log({ data, error })
    },
    async getAccessRights() {
      const { data, error } = await useSupabaseClient().from('users_access_rights').select('*').eq('user_id', useSupabaseUser().value.id)
      if (!error) this.users_access_rights = data
      else console.log('Error', error)
    },
    async createUser(user) {
      const data = await $fetch<User[] | any>(this.baseUrl + '/users', {
        // default: () => [],
        method: 'POST',
        body: user,
      })
      console.log({ data })
      return data
    },
    async getAllUsers() {
      const { data: users, error } = await useFetch<User[]>(this.baseUrl + '/users', {
        default: () => [],
      })
      if (!error) {
        this.users = users.value
        console.log('La fonction est appelé correctement %o ', users)
      } else {
        console.log('La fonction ne marche pas %o ', error)
      }
    },
  },
})
