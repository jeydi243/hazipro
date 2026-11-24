<template>
    <UDashboardPanel id="organisations" :ui-pro="{ body: 'p-0' }">
        <template #header>
            <UDashboardNavbar title="Organisations">
                <template #leading>
                    <!-- <UDashboardSidebarCollapse /> -->
                </template>

                <template #right>
                    <div class="flex flex-wrap items-center justify-between gap-1.5">
                        <UInput v-model="searchInput" class="max-w-sm" icon="i-lucide-search"
                            placeholder="Rechercher une organisation…" />

                        <USelectMenu v-model="currentYear" :items="items" />

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
                    <BudgetAddModal />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <UTable ref="table" v-model:column-filters="columnFilters" v-model:column-visibility="columnVisibility"
                v-model:row-selection="rowSelection" v-model:pagination="pagination"
                :pagination-options="paginationOptions" class="shrink-0 m-2" :data="data ?? emptyRows"
                :columns="columns" :ui="{
                    base: 'table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-lg',
                    thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
                    tbody: '[&>tr]:last:[&>td]:border-b-0',
                    th: 'py-1 first:rounded-tl-[calc(var(--ui-radius)*2)] last:rounded-tr-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r pl-2',
                    td: 'border-b border-(--ui-border) p-2'
                }" />

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

    <BudgetDetails v-model:open="openSlideOver" :budget="selectedBudgetHeader" />
    <!-- <PointFacturationEditModal v-model:open="openEditModal" :organisation="selectedBudgetHeaderToEdit"  @point-facturation-updated="refreshOrganisations" /> -->
</template>

<script setup lang="ts">
    import type { Row } from '@tanstack/table-core'
    import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
    import type { Organisation } from '~/types'
    import { storeToRefs } from 'pinia'

    useHead({
        title: 'Budgets',
        meta: [
            { name: 'description', content: 'Gérer les budgets' }
        ]
    })

    const supabase = useSupabaseClient()
    const items = ref([2026, 2027, 2028].map((year) => ({ label: year.toString(), id: year })))
    const currentYear = ref(items.value.find((item) => item.id === new Date().getFullYear()) ?? items.value[0])
    const emptyRows: Organisation[] = []
    const toast = useToast()
    const parametresStore = useParametresStore()
    const { lookups } = storeToRefs(parametresStore)

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
    const selectedBudgetHeader = ref<BudgetHeader | null>(null)
    const openEditModal = ref(false)
    const selectedBudgetHeaderToEdit = ref<BudgetHeader | null>(null)

    const { copy } = useClipboard()
    const searchInput = ref('')

    const debouncedSearch = useDebounceFn((val: string) => {
        table.value?.tableApi?.getColumn('description')?.setFilterValue(val)
    }, 300)

    watch(searchInput, (val) => {
        debouncedSearch(val)
    })

    const columns: TableColumn<BudgetHeader>[] = [
        {
            id: 'details',
            header: () => h('div', { class: 'flex items-center justify-center' }, 'Détails'),
            cell: ({ row }) => h('div', { class: 'flex items-center justify-center' }, h(UButton, {
                'color': 'primary',
                'variant': 'ghost',

                'aria-label': 'Agrandir',
                'label': 'Détails du budget',
                'class': '-mx-2.5',
                'onClick': () => {
                    selectedBudgetHeader.value = row.original
                    openSlideOver.value = true
                }
            })),
        },
        {
            accessorKey: 'annee',
            header: 'Année',
            cell: ({ row }) => h('p', { class: 'font-medium' }, row.original.annee)
        },
        {
            accessorKey: 'version',
            header: 'Version',
            cell: ({ row }) => h('p', { class: 'font-medium' }, row.original.version)
        },

        {
            accessorKey: 'scenario',
            header: ({ column }) => {
                const isSorted = column.getIsSorted()
                return h(UButton, {
                    color: 'neutral',
                    variant: 'ghost',
                    label: 'Scenario',
                    icon: isSorted
                        ? isSorted === 'asc'
                            ? 'i-lucide-arrow-up-narrow-wide'
                            : 'i-lucide-arrow-down-wide-narrow'
                        : 'i-lucide-arrow-up-down',
                    class: '-mx-2.5',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                })
            },
            cell: ({ row }) => h('p', { class: 'font-medium' }, (row.original.scenario as Lookup)?.nom || 'N/A')
        },
        {
            accessorKey: 'type_budget_id',
            header: "Type de budget",
            cell: ({ row }) => h('p', { class: 'font-medium' }, (row.original.type_budget_id as Lookup)?.nom || 'N/A')
        },
        {
            accessorKey: 'status',
            header: 'Statut',
            filterFn: 'equals',
            cell: ({ row }) => {
                const statusStr = row.original.status || 'actif'
                const color = {
                    subscribed: 'success' as const,
                    actif: 'success' as const,
                    unsubscribed: 'error' as const,
                    bounced: 'warning' as const
                }[statusStr] || 'neutral'

                return h(UBadge, { class: 'capitalize', variant: 'subtle', color }, () => statusStr)
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

    function getRowItems(row: Row<BudgetHeader>): DropdownMenuItem[][] {
        return [[
            {
                type: 'label' as const,
                label: 'Actions'
            },
            {
                label: 'Copie ID Organisation',
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
                    selectedBudgetHeader.value = row.original
                    openSlideOver.value = true
                }
            },
            {
                label: 'Modifier',
                icon: 'i-lucide-pencil',
                onSelect() {
                    selectedBudgetHeaderToEdit.value = row.original
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

    const data = computed(() => useBudgetsStore().getBudgetHeaders);

</script>
