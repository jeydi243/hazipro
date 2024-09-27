<template>
    <UDashboardPage>
        <UDashboardPanel id="inbox" :width="400" :resizable="{ min: 300, max: 500 }">
            <UDashboardNavbar title="Users" :badge="users.length">
                <template #right>
                    <UButton icon="i-heroicons-plus-16-solid" color="teal" variant="ghost"
                        @click="isNewUserModalOpen = true" />
                    <UButton icon="i-heroicons-arrow-path-rounded-square-solid" color="teal" variant="ghost"
                        @click="refresh" />
                </template>
            </UDashboardNavbar>
            <UsersList v-model="selectedUser" :users="users" />
        </UDashboardPanel>
        <!-- {{ users }} -->
        <UDashboardPanel v-model="isMailPanelOpen" collapsible grow side="right">
            <template v-if="selectedUser">
                <UDashboardNavbar>
                    <template #toggle>
                        <UDashboardNavbarToggle icon="i-heroicons-x-mark" />
                        <UDivider orientation="vertical" class="mx-1.5 lg:hidden" />
                    </template>

                    <template #left>
                        <UTooltip text="Move to junk">
                            <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost"
                                @click="fetchOrgs(selectedUser.id)" />
                        </UTooltip>
                    </template>
                </UDashboardNavbar>

                <UTabs v-model="selectedTab" :items="items" class="w-full" @change="onChange">
                    <template #default="{ item, index, selected }">
                        <div class="flex items-center gap-2 relative truncate">
                            <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

                            <span class="truncate">{{ index + 1 }}. {{ item.label }}</span>

                            <span v-if="selected"
                                class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                        </div>
                    </template>
                    <template #item="{ item }">
                        <!-- {{ item }} -->
                        <div class="flex flex-row p-1 w-full">
                            <template v-if="item.key === 'organisations'">
                                <UCard class="w-full">
                                    <div class="flex flex-row-reverse mb-2">
                                        <UButton label="Ajouter une organisation" icon="i-heroicons-plus-16-solid"
                                            color="gray" variant="solid" @click="isNewAffectationOrg = true" />
                                    </div>
                                    <UTable :rows="assigned_orgs" :columns="orgsColumns"
                                        class="flex justify-end  py-3.5 border rounded-lg border-gray-200 dark:border-gray-700">
                                        <template #actions-data="{ row }">
                                            <UDropdown :items="itemsRow(row)">
                                                <UButton color="gray" :label="row" variant="ghost"
                                                    icon="i-heroicons-ellipsis-horizontal-20-solid" />
                                            </UDropdown>
                                        </template>
                                    </UTable>
                                </UCard>
                            </template>
                            <template v-else-if="item.key == 'caisses_banques'">
                                <UCard class="w-full">
                                    <div class="flex flex-row-reverse mb-2">
                                        <UButton label="Affecter a un compte" icon="i-heroicons-plus-16-solid"
                                            color="gray" variant="solid" @click="true" />
                                    </div>
                                    <UTable :rows="assigned_accounts" :columns="caissesBanquesColumns"
                                        class="flex justify-end py-3.5 border rounded-lg border-gray-200 dark:border-gray-700">
                                        <template #actions-data="{ row }">
                                            <UDropdown :items="itemsRow(row)">
                                                <UButton color="gray" :label="row" variant="ghost"
                                                    icon="i-heroicons-ellipsis-horizontal-20-solid" />
                                            </UDropdown>
                                        </template>
                                    </UTable>
                                </UCard>
                            </template>
                            <template v-else-if="item.key == 'groupes_paiement'">
                                <UCard class="w-full">
                                    <div class="flex flex-row-reverse mb-2">
                                        <UButton label="Affecter a un groupe de paiement"
                                            icon="i-heroicons-plus-16-solid" color="gray" variant="solid"
                                            @click="true" />
                                    </div>
                                    <UTable :rows="assigned_payment_groups" :columns="groupPaymentColumns"
                                        class="flex justify-end py-3.5 border rounded-lg border-gray-200 dark:border-gray-700">
                                        <template #actions-data="{ row }">
                                            <UDropdown :items="itemsRow(row)">
                                                <UButton color="gray" :label="row" variant="ghost"
                                                    icon="i-heroicons-ellipsis-horizontal-20-solid" />
                                            </UDropdown>
                                        </template>
                                    </UTable>
                                </UCard>
                            </template>
                        </div>
                    </template>
                </UTabs>
            </template>
            <div v-else class="flex-1 hidden lg:flex items-center justify-center">
                <UIcon name="i-heroicons-inbox" class="w-32 h-32 text-gray-400 dark:text-gray-500" />
            </div>
            <UDashboardModal v-model="isNewUserModalOpen" title="Ajouter un utilisateur"
                description="Ajouter une classe" :ui="{ width: 'sm:max-w-md' }">
                <!-- ~/components/users/UsersForm.vue -->
                <UsersForm @close="modalUserClosed" />
            </UDashboardModal>
            <UDashboardModal v-model="isNewAffectationOrg" title="Affectation" description="Affecter a une organisation"
                :ui="{ width: 'sm:max-w-md' }">
                <UsersAffectationOrg :user="selectedUser" @close="modalOrgClosed" />
            </UDashboardModal>
        </UDashboardPanel>
    </UDashboardPage>
</template>

<script setup lang="ts">
import type { User } from '@supabase/supabase-js';

const selectedUser = ref<User | null>(null)
const isNewUserModalOpen = ref(false)
const isNewAffectationOrg = ref(false)
const baseUrl = ref('http://127.0.0.1:4000/v1')
const assigned_orgs = ref([])
const assigned_accounts = ref([])
const assigned_payment_groups = ref([])
const selectedTab = ref(0);
const { users: _users, getAllUsers, createUser } = useAuth()
const orgsColumns = [
    {
        key: 'code',
        label: 'Code',
        sortable: true
    },
    {
        key: 'description',
        label: 'Description'
    },
    {
        key: 'application_id',
        label: 'Application'
    },
    {
        key: 'date_debut',
        label: 'Date debut'
    },
    {
        key: 'actions',
        label: 'Actions'
    }]
const caissesBanquesColumns = [
    {
        key: 'bank_account_id',
        label: 'Compte',
        sortable: true
    },
    {
        key: 'application_id',
        label: 'Application'
    },
    {
        key: 'date_debut',
        label: 'Date de debut'
    },
    {
        key: 'date_fin',
        label: 'Date de fin'
    },
    {
        key: 'actions',
        label: 'Actions'
    }]
const groupPaymentColumns = [
    {
        key: 'code',
        label: 'Code',
        sortable: true
    }, {
        key: 'description',
        label: 'Description'
    }, {
        key: 'actions',
        label: 'Actions'
    }]
const itemsRow = (row: any) => [
    [{
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => editAssignedAccount(row)
    }], [{
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        click: () => removeAssignedAccount(row)
    }]
]
const items = [{
    key: 'organisations',
    label: 'Organisations',
    icon: 'i-heroicons-information-circle',
    description: 'Make changes to your account here. Click save when you\'re done.'
}, {
    key: 'caisses_banques',
    label: 'Caisses | Banques',
    icon: 'i-heroicons-information-circle',
    description: 'Change your password here. After saving, you\'ll be logged out.'
}, {
    key: 'groupes_paiement',
    label: 'Groupe de paiement',
    icon: 'i-heroicons-information-circle',
    description: 'Change your password here. After saving, you\'ll be logged out.'
}]
const isMailPanelOpen = computed({
    get() {
        return !!selectedUser.value
    },
    set(value: boolean) {
        if (!value) {
            selectedUser.value = null
        }
    }
})

const { data: users, refresh } = await useFetch<User[]>(baseUrl.value + '/users', { default: () => [], method: 'GET' })

function fetchOrgs(id: string) {

}
async function editAssignedOrg(row: any) {

}
async function editAssignedAccount(row: any) {

}
async function editAssignedPaymentGroup(row: any) {

}
const filteredUsers = computed(() => {
    return _users
})
watch(selectedUser, () => {
    if (selectedUser.value) {
        fetchAssignedOrgs(selectedUser.value.id)
        fetchAssignedAccounts(selectedUser.value.id)
        fetchAssignedPaymentGroup(selectedUser.value.id)
    }
})

async function removeAssignedAccount(account: any) {
    const toast = useToast()
    try {
        const response = await $fetch<object>(baseUrl.value + '/users/orgs' + account.id, { method: 'DELETE' })
        console.log({ response });
        toast.add({ title: 'Delete lookups ' + account.name, description: `${response}`, timeout: 5000 })
        setTimeout(() => {
            // isLoadingBtn.value = false
        }, 1000);
    } catch (error) {
        console.log('Error', error);
        // isLoadingBtn.value = false
    }
}
async function onChange(index) {
    selectedTab.value = index
    // alert(`${items[index].label} was clicked!`)
}
async function modalUserClosed() {
    isNewUserModalOpen.value = false;
    refresh();
    // fetchLookups(selectedClasse.value.id)
}

function modalOrgClosed() {

}
async function fetchAssignedOrgs(userID: string) {
    const { data, error } = await supabase.from('users_access_rights')
        .select('*').eq('USER_ID', userID)
    // console.log({ data });
    console.log({ data }, { error });
}
async function fetchAssignedAccounts(userID: string) {
    const { data, error } = await supabase.from('assignments')
        .select('*').eq('user_id', userID)
    console.log({ data }, { error });
}
async function fetchAssignedPaymentGroup(userID: string) {
    const { data, error } = await supabase.from('assignments')
        .select('*').eq('user_id', userID)

    console.log({ data }, { error });
    // console.log({ data });
}
</script>

<style scoped></style>