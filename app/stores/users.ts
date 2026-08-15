import { defineStore } from 'pinia'
import type { Owner, UserRole } from '~/types'

export const useUsersStore = defineStore('users', () => {
    const owners = ref<Owner[] | null>([])
    const usersRoles = ref<UserRole[]>([])

    async function init() {
        const supabase = useSupabaseClient()
        const user = useSupabaseUser()

        if (!user.value) {
            return {
                data: null,
                error: 'User not logged in',
                loading: false,
            }
        }

        const { data: usersRolesData, error: usersRolesError } = await supabase
            .from('user_roles')
            .select('user_id, role_id, roles(code, nom)')
            .eq('user_id', user.value.id)

        if (usersRolesError) {
            return {
                data: null,
                error: usersRolesError.message,
                loading: false,
            }
        }

        if (usersRolesData) usersRoles.value = usersRolesData as unknown as UserRole[]

        return {
            data: usersRolesData,
            error: null,
            loading: false,
        }
    }

    return {
        owners,
        usersRoles,
        init,
    }
})
