<template>
    <UDashboardPanel id="inbox-70" :ui-pro="{ body: 'p-0' }">
        <template #header>
            <UDashboardNavbar title="Note de frais" description="Liste des notes de frais"
                :ui-pro="{ body: 'px-4 py-2' }">
                <template #right>
                    <div class="flex flex-wrap items-center justify-between gap-1.5">
                        <UInput v-model="searchInput" class="max-w-sm" icon="i-lucide-search"
                            placeholder="Filter nf…" />
                    </div>
                    <NfAddModal />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <UTable ref="table" v-model:column-filters="columnFilters" v-model:column-visibility="columnVisibility"
                v-model:row-selection="rowSelection" v-model:pagination="pagination"
                :pagination-options="paginationOptions" class="shrink-0 m-2" :data="nfs ?? EMPTY_ROWS" :columns="columns" :ui="haziTableUi" />

            <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
                <div class="text-sm text-muted">
                    {{ selectedRowCount }} of {{ totalFilteredRows }} row(s) selected.
                </div>

                <div class="flex items-center gap-1.5">
                    <UPagination :default-page="currentPage" :items-per-page="currentPageSize"
                        :total="totalFilteredRows" @update:page="setPage" />
                </div>
            </div>
        </template>
    </UDashboardPanel>

    <UDrawer v-model:open="openDetailsClasse" title="Détails" description="Détails de la classe sélectionnée">
        <template #body>
            <div class="p-4 text-center">
                <p v-if="selectedNf" class="font-medium">{{ selectedNf.organisation_id }}</p>
                <p v-if="selectedNf" class="text-sm text-muted">{{ selectedNf.description }}</p>
                <p v-else>Sélectionnez une note de frais pour voir les détails.</p>
            </div>
        </template>
    </UDrawer>

    <ClassesUpdateModal v-model:open="openClasseUpdateModal" :classe="selectedNf ?? undefined"
        @classe_updated="refreshClasses" />

    <ClassesListeLookups v-model:open="openSlideOver" :item="selectedNf" />
</template>

<script setup lang="ts">
import { haziTableUi } from '~/utils/table'

// Tableau vide STABLE pour UTable : évite la boucle de réactivité du watch data
const EMPTY_ROWS: any[] = []
    import type { TableColumn } from '@nuxt/ui'
    import type { Row } from '@tanstack/table-core'
    import type { NF } from '~/types/organisation'

    useHead({
        title: 'Note de frais',
        meta: [
            { name: 'description', content: 'Manage note de frais' }
        ]
    })

    const supabase = useSupabaseClient()
    const toast = useToast()
    const { copy } = useClipboard()

    const {
        table: tableNfs,
        UButton,
        UDropdownMenu,
        columnFilters,
        columnVisibility,
        rowSelection,
        pagination,
        paginationOptions,
        selectedRowCount,
        totalFilteredRows,
        currentPage,
        currentPageSize,
        setPage
    } = useDataTable({ filterColumnId: 'nom', pageSize: 10 })

    // UI State
    const openClasseUpdateModal = ref(false)
    const openDetailsClasse = ref(false)
    const openSlideOver = ref(false)
    const selectedNf = ref<NF | null>(null)
    const searchInput = ref('')

    const debouncedSearch = useDebounceFn((val: string) => {
        tableNfs.value?.tableApi?.getColumn('nom')?.setFilterValue(val)
    }, 300)

    watch(searchInput, (val) => {
        debouncedSearch(val)
    })

    // Data loading
    const { data: nfs, refresh: refreshNfData } = useLazyAsyncData<NF[]>('nfs', async () => {
        const { data, error } = await supabase.from('nf').select('id, code, nom, description, organisation_id')
        if (error) throw error
        return data as NF[]
    })

    async function refreshClasses() {
        await refreshNfData()
    }

    // Columns definition
    const columns: TableColumn<NF>[] = [
        {
            id: 'edit',
            header: () => h('div', { class: 'text-center' }, 'Edit'),
            cell: ({ row }) => h('div', { class: 'text-center' }, [
                h(UButton, {
                    color: 'neutral',
                    variant: 'ghost',
                    icon: 'i-lucide-edit',
                    'aria-label': 'Modifier',
                    onClick: () => {
                        selectedNf.value = row.original;
                        openClasseUpdateModal.value = true;
                    }
                })
            ]),
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.code)
            ])
        },
        {
            accessorKey: 'nom',
            header: 'Nom',
            cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.nom)
            ])
        },
        {
            accessorKey: 'description',
            header: ({ column }) => {
                const isSorted = column.getIsSorted()
                return h(UButton, {
                    color: 'neutral',
                    variant: 'ghost',
                    label: 'Description',
                    icon: isSorted
                        ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow')
                        : 'i-lucide-arrow-up-down',
                    class: '-mx-2.5',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                })
            }
        },

        {
            id: 'details',
            header: () => h('div', { class: 'text-center' }, 'Lookups'),
            cell: ({ row }) => h('div', { class: 'text-center' }, [
                h(UButton, {
                    color: 'neutral',
                    variant: 'solid',
                    icon: 'i-lucide-eye',
                    'aria-label': 'Voir les détails',
                    onClick: () => {
                        selectedNf.value = row.original;
                        openSlideOver.value = true;
                    }
                })
            ]),
        },
        {
            header: () => h('div', { class: 'text-center' }, 'Actions'),
            id: 'actions',
            cell: ({ row }) => h('div', { class: 'text-center' },
                h(UDropdownMenu, { content: { align: 'end' }, items: getRowItemsClasse(row) },
                    () => h(UButton, { icon: 'i-lucide-ellipsis-vertical', 'aria-label': "Plus d'actions", color: 'neutral', variant: 'ghost', class: 'ml-auto' })
                )
            )
        }
    ]

    function getRowItemsClasse(row: Row<NF>) {
        return [[
            { type: 'label', label: 'Actions' },
            {
                label: 'Copy classe ID',
                icon: 'i-lucide-copy',
                onSelect() {
                    copy(row.original.id.toString())
                    toast.add({ title: 'Copied', description: 'Classe ID copied to clipboard' })
                }
            },
            { type: 'separator' },
            {
                label: 'Details',
                icon: 'material-symbols:open-in-full-rounded',
                onSelect() {
                    selectedNf.value = row.original
                    openDetailsClasse.value = true
                }
            },
            { type: 'separator' },
            {
                label: 'Delete classe',
                icon: 'i-lucide-trash',
                color: 'error' as const,
                onSelect() {
                    toast.add({ title: 'Delete', description: 'Action non implémentée.' })
                }
            }
        ]]
    }
</script>
