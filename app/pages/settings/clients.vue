<template>
    <div>
        <UDashboardPanel id="inbox-900" :ui-pro="{ body: 'p-0' }">
            <template #header>
                <UDashboardNavbar title="Clients">
                    <template #leading>
                        <!-- <UDashboardSidebarCollapse /> -->
                    </template>

                    <template #right>
                        <div class="flex flex-wrap items-center justify-between gap-1.5">
                            <UInput v-model="searchInput" class="max-w-sm" icon="i-lucide-search"
                                placeholder="Rechercher un article…" />
                        </div>
                        <ClientsAddModal @client-added="refreshClients" />
                    </template>
                </UDashboardNavbar>
            </template>
            <template #body>
                <UTable ref="table" v-model:column-filters="columnFilters" v-model:column-visibility="columnVisibility"
                    v-model:row-selection="rowSelection" v-model:pagination="pagination"
                    :pagination-options="paginationOptions" class="shrink-0 m-2" :data="clients ?? EMPTY_ROWS"
                    :columns="columns" :loading="pending" :ui="haziTableUi" />

                <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
                    <div class="text-sm text-(--ui-text-muted)">
                        {{ selectedRowCount }} sur {{ totalFilteredRows }} ligne(s) sélectionnée(s).
                    </div>

                    <div class="flex items-center gap-1.5">
                        <UPagination :default-page="currentPage" :items-per-page="currentPageSize"
                            :total="totalFilteredRows" @update:page="setPage" />
                    </div>
                </div>
            </template>
        </UDashboardPanel>

        <ClientsUpdateModal v-model:open="openDetailsClient" :client="selectedClient"
            @client-updated="refreshClients" />

    </div>
</template>
<script setup lang="ts">
    import type { Row } from '@tanstack/table-core'
    import type { TableColumn } from '@nuxt/ui'
    import type { Client, Lookup } from '~/types'
    import { haziTableUi } from '~/utils/table'

    // Tableau vide STABLE pour UTable : évite la boucle de réactivité du watch data
    const EMPTY_ROWS: any[] = []

    useHead({
        title: 'Clients',
        meta: [
            { name: 'description', content: 'Gérer les Clients' }
        ]
    })

    const supabase = useSupabaseClient()
    const { getLookupsById } = useParametresStore()
    const clientsStore = useClientsStore()
    const toast = useToast()

    // ✅ Utilisation du composable centralisé
    const {
        table,
        UButton,
        UDropdownMenu,
        columnFilters,
        columnVisibility,
        rowSelection,
        pagination,
        paginationOptions,
        statusFilter,
        selectedRowCount,
        totalFilteredRows,
        currentPage,
        currentPageSize,
        setPage
    } = useDataTable({ filterColumnId: 'nom', pageSize: 10 })

    const openDetailsClient = ref(false)
    const selectedClient = ref<Client | null>(null)

    const { copy } = useClipboard()
    const searchInput = ref('')

    const debouncedSearch = useDebounceFn((val: string) => {
        table.value?.tableApi?.getColumn('nom')?.setFilterValue(val)
    }, 300)

    watch(searchInput, (val) => {
        debouncedSearch(val)
    })

    const columns: TableColumn<Client>[] = [
        {
            id: 'details',
            header: 'Détails',
            cell: ({ row }) => h(UButton, {
                "color": 'primary',
                "variant": 'ghost',
                "icon": 'i-lucide-pencil',
                "aria-label": 'Modifier',
                "onClick": () => {
                    selectedClient.value = row.original
                    openDetailsClient.value = !openDetailsClient.value
                }
            }),
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => {
                return h('div', { class: 'flex items-center gap-3' }, [
                    h('div', undefined, [
                        h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.code),
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
                        h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original?.nom),
                    ])
                ])
            }
        },
        {
            accessorKey: 'type_id',
            header: 'Type',
            cell: ({ row }) => {
                return h('div', { class: 'flex items-center gap-3' }, [
                    h('div', undefined, [
                        h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, (row.original?.type_id as Lookup)?.nom),
                    ])
                ])
            }
        },
        {
            accessorKey: 'nif',
            header: 'NIF',
            cell: ({ row }) => {
                return h('div', { class: 'flex items-center gap-3' }, [
                    h('div', undefined, [
                        h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original?.nif),
                    ])
                ])
            }
        },

        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => {
                return h('div', { class: 'flex items-center gap-3' }, [
                    h('div', undefined, [
                        h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.description),
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
                            content: { align: 'end' },
                            children: getRowItems(row)
                        },
                        () => h(UButton, {
                            "icon": 'i-lucide-ellipsis-vertical',
                            'aria-label': "Plus d'actions",
                            "color": 'neutral',
                            "variant": 'ghost',
                            "class": 'ml-auto'
                        })
                    )
                )
            }
        }
    ]

    function getRowItems(row: Row<Client>) {
        return [
            {
                type: 'label',
                label: 'Actions'
            },
            {
                label: 'Copier l\'ID',
                icon: 'i-lucide-copy',
                onSelect() {
                    copy(row.original.id.toString())
                    toast.add({
                        title: 'Copié',
                        description: `ID article #${row.original.id} copié dans le presse-papiers`
                    })
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Voir les détails',
                icon: 'i-lucide-maximize-2',
                onSelect() {
                    selectedClient.value = row.original
                    openDetailsClient.value = true
                }
            },
            {
                label: 'Voir les affectations',
                icon: 'i-lucide-link',
                onSelect() {
                    // openDetailsAffectation.value = !openDetailsAffectation.value
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Supprimer l\'article',
                icon: 'i-lucide-trash',
                color: 'error',
                async onSelect() {
                    try {
                        await clientsStore.remove(row.original.id)
                        toast.add({ title: 'Client supprimé', description: `Le client "${row.original.nom}" a été supprimé.`, color: 'success' })
                        await refreshClients()
                    } catch (err: any) {
                        toast.add({ title: 'Erreur', description: `Impossible de supprimer : ${err.message}`, color: 'error' })
                    }
                }
            }
        ]
    }

    const { data: clients, pending, refresh: refreshClients } = useAsyncData('clients', async () => {
        const { data, error } = await supabase.from('clients').select('id, nom, code, description, nif, owner_id, type_id, type:type_id(id, nom, code)')
        if (error) {
            throw error
        }
        return data
    })
</script>
