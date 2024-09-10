<template>
    <UDashboardPage>
        <UDashboardPanel id="inbox" :width="400" :resizable="{ min: 300, max: 500 }">
            <UDashboardNavbar title="Users" :badge="filteredUsers.length">
                <template #right>
                    <UButton icon="i-heroicons-plus-16-solid" color="teal" variant="ghost"
                        @click="isNewUserModalOpen = true" />
                    <UButton icon="i-heroicons-arrow-path-rounded-square-solid" color="teal" variant="ghost"
                        @click="getAllUsers" />
                </template>
            </UDashboardNavbar>
            <UsersList v-model="selectedUser" :users="filteredUsers" />
        </UDashboardPanel>

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

                    <template #right>
                        <UButton icon="i-heroicons-plus-16-solid" label="Ajouter" color="teal" variant="solid"
                            @click="isNewLookupsModalOpen = true" />
                    </template>
                </UDashboardNavbar>

                <!-- <ClassesMail :classe="selectedUser" /> -->
                <UCard :ui="{
                    base: 'm-2',
                    divide: 'divide-y divide-gray-200 dark:divide-gray-700',
                    header: {
                        base: '',
                        background: '',
                        padding: 'py-3 px-3'
                    }
                }">
                    <template #header>
                        Informations de la classe
                    </template>
                </UCard>
                <UCard :ui="{
                    base: 'm-2',
                    divide: 'divide-y divide-gray-200 dark:divide-gray-700',
                    header: {
                        base: '',
                        background: '',
                        padding: 'px-1'
                    },
                    body: {
                        base: '',
                        background: '',
                        padding: 'px-1'
                    }
                }">
                    <template #header>
                        <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                            Lookups
                        </h2>
                    </template>

                    <UTable :rows="lookupsResults" :columns="lookupsColumns"
                        class="m-2 border border-separate rounded-md">
                        <template #actions-data="{ row }">
                            <UDropdown :items="items(row)">
                                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                            </UDropdown>
                        </template>
                    </UTable>
                    <!-- <template #footer>
                        classe id {{ selectedUser.id }}
                    </template> -->
                </UCard>
            </template>
            <div v-else class="flex-1 hidden lg:flex items-center justify-center">
                <UIcon name="i-heroicons-inbox" class="w-32 h-32 text-gray-400 dark:text-gray-500" />
            </div>
        </UDashboardPanel>
    </UDashboardPage>
</template>

<script setup lang="ts">
import type { User } from '@supabase/supabase-js';

const isNewUserModalOpen = ref(false)
const selectedUser = ref<User | null>(null)
const filteredUsers = computed(() => {
    return _users
})
const { users: _users, getAllUsers } = useAuth()

function fetchOrgs(id: string) {

}
</script>

<style scoped></style>