<template>
    <UDashboardPanel id="taux" :ui-pro="{ body: 'p-0' }">
        <template #header>
            <UDashboardNavbar title="Taux">
                <template #leading>
                    <!-- <UDashboardSidebarCollapse /> -->
                </template>

                <template #right>
                    <div class="flex flex-wrap items-center justify-between gap-1.5">
                        <UInput v-model="searchInput" class="max-w-sm" icon="i-lucide-search"
                            placeholder="Rechercher une organisation…" />

                        <div class="flex flex-wrap items-center gap-1.5">
                            <USelect v-model="statusFilter" :items="[
                                { label: 'Toutes', value: 'all' },
                                { label: 'Subscribed', value: 'subscribed' },
                                { label: 'Actif', value: 'actif' },
                                { label: 'Bounced', value: 'bounced' }
                            ]" :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
                                placeholder="Filtrer par statut" class="min-w-28"
                                @update:model-value="setStatusFilter('status', $event)" />

                            <UDropdownMenu :items="columnDisplayItems" :content="{ align: 'end' }">
                                <UButton label="Affichage" color="neutral" variant="outline"
                                    trailing-icon="i-lucide-settings-2" />
                            </UDropdownMenu>
                        </div>
                    </div>
                    <TauxAddModal />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <UTable ref="table" v-model:column-filters="columnFilters" v-model:column-visibility="columnVisibility"
                v-model:row-selection="rowSelection" v-model:pagination="pagination"
                :pagination-options="paginationOptions" class="shrink-0 m-2" :data="taux ?? emptyRows"
                :columns="columns" :ui="haziTableUi" />

            <div class="flex items-center justify-between gap-3 border-t border-default pt-4 mt-auto">
                <div class="text-sm text-muted">
                    {{ selectedRowCount }} sur {{ totalFilteredRows }} ligne(s) sélectionnée(s).
                </div>

                <div class="flex items-center gap-1.5">
                    <UPagination :default-page="currentPage" :items-per-page="currentPageSize"
                        :total="totalFilteredRows" @update:page="setPage" />
                </div>
            </div>
        </template>
    </UDashboardPanel>

</template>

<script setup lang="ts">
    import type { Row } from '@tanstack/table-core'
    import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
    import type { Taux } from '~/types'
    import { haziTableUi } from '~/utils/table'
    import { storeToRefs } from 'pinia'

    useHead({
        title: 'Taux',
        meta: [
            { name: 'description', content: 'Gérer les taux.' }
        ]
    })

    const supabase = useSupabaseClient()
    // Tableau vide STABLE : évite une nouvelle identité [] à chaque render
    const emptyRows: Taux[] = []
    const toast = useToast()
    const parametresStore = useParametresStore()
    const { lookups, getTaux : taux} = storeToRefs(parametresStore)

    // Utilisation du composable centralisé
    const {
        table,
        UButton,
        UBadge,
        UDropdownMenu,
        UCheckbox,
        columnFilters,
        columnVisibility,
        rowSelection,
        pagination,
        paginationOptions,
        statusFilter,
        buildColumnDisplayItems,
        selectedRowCount,
        totalFilteredRows,
        currentPage,
        currentPageSize,
        setPage,
        setStatusFilter
    } = useDataTable({ filterColumnId: 'description', pageSize: 10 })

    // IDs des colonnes cachables — liste STATIQUE, sans jamais toucher à tableApi
    const columnDisplayItems = buildColumnDisplayItems(['select', 'details', 'code', 'nom', 'description', 'type', 'status', 'actions'])
    const openSlideOver = ref(false)
    const selectedTaux = ref<Taux | null>(null)
    const openEditModal = ref(false)
    const selectedTauxToEdit = ref<Taux | null>(null)

    const { copy } = useClipboard()
    const searchInput = ref('')

    const debouncedSearch = useDebounceFn((val: string) => {
        table.value?.tableApi?.getColumn('description')?.setFilterValue(val)
    }, 300)

    watch(searchInput, (val) => {
        debouncedSearch(val)
    })

    const columns: TableColumn<Taux>[] = [
        {
            id: 'select',
            header: ({ table }) =>
                h(UCheckbox as any, {
                    "modelValue": table.getIsAllPageRowsSelected(),
                    "indeterminate": table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
                    'onUpdate:modelValue': (value: any) => table.toggleAllPageRowsSelected(!!value),
                    'aria-label': 'Tout sélectionner'
                }),
            cell: ({ row }) =>
                h('div', { class: 'flex items-center justify-left' }, h(UCheckbox as any, {
                    "modelValue": row.getIsSelected(),
                    'onUpdate:modelValue': (value: any) => row.toggleSelected(!!value),
                    'aria-label': 'Sélectionner ligne'
                }))
        },
        // {
        //     id: 'details',
        //     header: () => h('div', { class: 'flex items-center justify-center' }, 'Détails'),
        //     cell: ({ row }) => h('div', { class: 'flex items-center justify-center' }, h(UButton, {
        //         'color': 'neutral',
        //         'variant': 'ghost',
        //         'icon': 'i-lucide-maximize-2',
        //         'aria-label': 'Agrandir',
        //         'class': '-mx-2.5',
        //         'onClick': () => {
        //             selectedTaux.value = row.original
        //             openSlideOver.value = true
        //         }
        //     })),
        // },
        {
            accessorKey: 'from_currency',
            header: 'Devise Source',
            cell: ({ row }) => h('p', { class: 'font-medium' }, row.original.from_currency)
        },
        {
            accessorKey: 'to_currency',
            header: 'Devise Cible',
            cell: ({ row }) => h('p', { class: 'font-medium' }, row.original.to_currency)
        },
        {
            accessorKey: 'valeur',
            header: 'Valeur',
            cell: ({ row }) => h('p', { class: 'font-medium' }, row.original.valeur)
        },
        {
            accessorKey: 'date_taux',
            header: 'Date du taux',
            cell: ({ row }) => h('p', { class: 'font-medium' }, row.original.date_taux)
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
                            items: getRowItems(row)
                        },
                        () =>
                            h(UButton, {
                                'icon': 'i-lucide-ellipsis-vertical',
                                'aria-label': "Plus d'actions",
                                'color': 'neutral',
                                'variant': 'ghost',
                                'class': 'ml-auto'
                            })
                    )
                )
            }
        }
    ]

    function getRowItems(row: Row<Taux>): DropdownMenuItem[][] {
        return [[
            {
                type: 'label' as const,
                label: 'Actions'
            },
            {
                label: 'Copie ID Taux',
                icon: 'i-lucide-copy',
                onSelect() {
                    copy(row.original.id.toString())
                    toast.add({
                        title: 'Copié !',
                        description: 'ID de l\'organisation copié dans le presse-papiers'
                    })
                }
            },
            { type: 'separator' as const },
            {
                label: 'Détails',
                icon: 'i-lucide-maximize-2',
                onSelect() {
                    selectedTaux.value = row.original
                    openSlideOver.value = true
                }
            },
            {
                label: 'Modifier',
                icon: 'i-lucide-pencil',
                onSelect() {
                    selectedTauxToEdit.value = row.original
                    openEditModal.value = true
                }
            },
            { type: 'separator' as const },
            {
                label: 'Supprimer',
                icon: 'i-lucide-trash',
                color: 'error' as const,
                onSelect() {
                    toast.add({
                        title: 'Action non disponible',
                        description: 'La suppression sera implémentée prochainement.'
                    })
                }
            }
        ]]
    }

</script>
