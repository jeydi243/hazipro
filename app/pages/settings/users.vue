<template>
    <div class="bg-(--ui-bg-elevated)/50">
        <UDashboardPanel id="inbox-70" :ui-pro="{ body: 'p-0' }">
            <template #header>
                <UDashboardNavbar title="Users">
                    <template #leading>
                        <!-- <UDashboardSidebarCollapse /> -->
                    </template>

                    <template #right>
                        <div class="flex flex-wrap items-center justify-between gap-1.5">
                            <UInput v-model="searchInput" class="max-w-sm" icon="i-lucide-search"
                                placeholder="Rechercher un utilisateur (email)…" />

                            <div class="flex flex-wrap items-center gap-1.5">
                                <!-- <CustomersDeleteModal
                                    :count="table?.tableApi?.getFilteredSelectedRowModel().rows.length">
                                    <UButton v-if="table?.tableApi?.getFilteredSelectedRowModel().rows.length"
                                        label="Delete" color="error" variant="subtle" icon="i-lucide-trash">
                                        <template #trailing>
                                            <UKbd>
                                                {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length }}
                                            </UKbd>
                                        </template>
</UButton>
</CustomersDeleteModal> -->

                                <USelect v-model="statusFilter" :items="[
                                    { label: 'All', value: 'all' },
                                    { label: 'Subscribed', value: 'subscribed' },
                                    { label: 'Actif', value: 'actif' },
                                    { label: 'Bounced', value: 'bounced' }
                                ]" :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
                                    placeholder="Filter status" class="min-w-28" />
                                <UDropdownMenu :items="table?.tableApi
                                    ?.getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => ({
                                        label: upperFirst(column.id),
                                        type: 'checkbox' as const,
                                        checked: column.getIsVisible(),
                                        onUpdateChecked(checked: boolean) {
                                            table?.tableApi?.getColumn(column.id)?.toggleVisibility(!!checked)
                                        },
                                        onSelect(e?: Event) {
                                            e?.preventDefault()
                                        }
                                    }))
                                    " :content="{ align: 'end' }">
                                    <UButton label="Display" color="neutral" variant="outline"
                                        trailing-icon="i-lucide-settings-2" />
                                </UDropdownMenu>
                            </div>
                        </div>
                        <UsersAddModal />
                    </template>
                </UDashboardNavbar>
            </template>
            <template #body>
                <UTable ref="table" v-model:column-filters="columnFilters" v-model:column-visibility="columnVisibility"
                    v-model:row-selection="rowSelection" v-model:pagination="pagination" :pagination-options="{
                        getPaginationRowModel: getPaginationRowModel()
                    }" class="shrink-0 m-2 bg-(--ui-bg)" :data="Users ?? EMPTY_ROWS" :columns="columns" :loading="pending" :ui="haziTableUi" />

                <div class="flex items-center justify-between gap-3 border-t border-(--ui-border) pt-4 mt-auto">
                    <div class="text-sm text-(--ui-text-muted)">
                        {{ table?.tableApi?.getFilteredSelectedRowModel().rows.length || 0 }} of
                        {{ table?.tableApi?.getFilteredRowModel().rows.length || 0 }} row(s) selected.
                    </div>

                    <div class="flex items-center gap-1.5">
                        <UPagination :default-page="(table?.tableApi?.getState().pagination.pageIndex || 0) + 1"
                            :items-per-page="table?.tableApi?.getState().pagination.pageSize"
                            :total="table?.tableApi?.getFilteredRowModel().rows.length"
                            @update:page="(p) => table?.tableApi?.setPageIndex(p - 1)" />
                    </div>
                </div>
            </template>
        </UDashboardPanel>

        <UsersDetails v-model:open="openDetailsUser" :user="selectedUser" />
    </div>
</template>
<script setup lang="ts">
import { haziTableUi } from '~/utils/table'

// Tableau vide STABLE pour UTable : évite la boucle de réactivité du watch data
const EMPTY_ROWS: any[] = []
import type { TableColumn } from '@nuxt/ui'
import { upperFirst } from 'scule'
import * as z from 'zod'
import { getPaginationRowModel, type Row } from '@tanstack/table-core'
import type { Profil } from '~/types'

useHead({
    title: 'Users - Settings',
    meta: [
        { name: 'description', content: 'Manage users.' }
    ]
})

const supabase = useSupabaseClient()
const table = useTemplateRef('table')
const statusFilter = ref('all')
const columnFilters = ref([{
    id: 'email',
    value: ''
}])

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const columnVisibility = ref()
const openDetailsUser = ref(false)
const selectedUser = ref<Profil | null>(null)
const rowSelection = ref({ 2: true })
const toast = useToast()
const pagination = ref({
    pageIndex: 0,
    pageSize: 10
})

const { copy } = useClipboard()
const searchInput = ref('')

const debouncedSearch = useDebounceFn((val: string) => {
    table.value?.tableApi?.getColumn('nom')?.setFilterValue(val)
}, 300)

watch(searchInput, (val) => {
    debouncedSearch(val)
})
const columns: TableColumn<Profil>[] = [
    {
        id: 'details',
        header: 'Details',
        cell: ({ row }) => h(UButton, {
            color: 'primary',
            variant: 'ghost',
            icon: 'i-lucide-eye',
            'aria-label': 'Voir les détails',
            onClick: () => {
                selectedUser.value = row.original;
                openDetailsUser.value = !openDetailsUser.value;
            }
        }),
    },
    {
        accessorKey: 'email',
        header: 'Email',
        cell: ({ row }) => {
            return h('div', { class: 'flex items-center gap-3' }, [

                h('div', undefined, [
                    h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.email),
                ])
            ])
        }
    },
    {
        accessorKey: 'prenom',
        header: 'Prenom',
        cell: ({ row }) => {
            return h('div', { class: 'flex items-center gap-3' }, [

                h('div', undefined, [
                    h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.prenom),
                ])
            ])
        }
    },
    {
        accessorKey: 'nom',
        header: 'Nom',
        cell: ({ row }) => {
            return h('div', { class: 'flex items-center gap-3' }, [

                h('div', undefined, [
                    h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.nom),
                ])
            ])
        }
    },
    {
        header: () => h('div', { class: 'text-center' }, 'Actions'),
        id: 'actions',
        cell: ({ row }) => {
            return h(
                'div',
                { class: 'text-center' },
                h(
                    UDropdownMenu,
                    {
                        content: {
                            align: 'end'
                        },
                        items: getRowItems(row)
                    },
                    () =>
                        h(UButton, {
                            icon: 'i-lucide-ellipsis-vertical',
                            'aria-label': "Plus d'actions",
                            color: 'neutral',
                            variant: 'ghost',
                            class: 'ml-auto'
                        })
                )
            )
        }
    }
]

function getRowItems(row: Row<Profil>) {
    return [
        {
            type: 'label',
            label: 'Actions'
        },
        {
            label: 'Copie ID User',
            icon: 'i-lucide-copy',
            onSelect() {
                copy(row.original.id.toString())
                toast.add({
                    title: 'Copié !',
                    description: 'ID de l\'utilisateur copié dans le presse-papiers'
                })
            }
        },
        {
            type: 'separator'
        },
        {
            label: 'Details',
            icon: 'material-symbols:open-in-full-rounded',
            onSelect() {
                openDetailsUser.value = !openDetailsUser.value
            }
        },
        {
            label: 'View customer payments',
            icon: 'i-lucide-wallet'
        },
        {
            type: 'separator'
        },
        {
            label: 'Delete classe',
            icon: 'i-lucide-trash',
            color: 'error',
            onSelect() {
                toast.add({
                    title: 'Customer deleted',
                    description: 'The customer has been deleted.'
                })
            }
        }
    ];
}


const { data: Users, pending } = useAsyncData('users', async () => {
    const { data, error } = await supabase.from('profils').select('id, email, nom, prenom, postnom, avatar, user_id')
    if (error) throw error
    return data
})

</script>
