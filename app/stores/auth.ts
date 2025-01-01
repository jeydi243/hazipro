import type { User } from '@supabase/supabase-js'

interface storeAuth {
  user: User
  description: string
  baseUrl: string
  users: User[]
}

export const useAuth = defineStore('auth', {
  state: (): storeAuth => ({
    user: null,
    users: [],
    baseUrl: 'http://127.0.0.1:4000/v1',
    description: '',
  }),
  actions: {
    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      this.user = data.user
      console.log({ data, error })
    },
    async getAssignedOrg() {
      const { data, error } = await supabase.from('assignments').select(`
            name,
            organisations (
                code,
                nom
            )
        `)
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
