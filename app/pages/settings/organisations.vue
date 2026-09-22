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
                    <OrganisationsAddModal @organisation-added="refreshOrganisations" />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <UTable ref="table" v-model:column-filters="columnFilters" v-model:column-visibility="columnVisibility"
                v-model:row-selection="rowSelection" v-model:pagination="pagination"
                :pagination-options="paginationOptions" class="shrink-0 m-2" :data="organisations ?? emptyRows"
                :columns="columns" :loading="pending" :ui="haziTableUi" />

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

    <PointFacturationDetails v-model:open="openSlideOver" :organisation="selectedOrganisation" />
    <!-- <PointFacturationEditModal v-model:open="openEditModal" :organisation="selectedOrganisationToEdit"  @point-facturation-updated="refreshOrganisations" /> -->
</template>

<script setup lang="ts">
    import type { Row } from '@tanstack/table-core'
    import type { TableColumn, DropdownMenuItem } from '@nuxt/ui'
    import type { Organisation } from '~/types'
    import { haziTableUi } from '~/utils/table'
    import { storeToRefs } from 'pinia'

    useHead({
        title: 'Organisations',
        meta: [
            { name: 'description', content: 'Gérer les organisations.' }
        ]
    })

    const supabase = useSupabaseClient()
    // Tableau vide STABLE : évite une nouvelle identité [] à chaque render
    // (boucle infinie du watch data de UTable pendant le chargement)
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
    const selectedOrganisation = ref<Organisation | null>(null)
    const openEditModal = ref(false)
    const selectedOrganisationToEdit = ref<Organisation | null>(null)

    const { copy } = useClipboard()
    const searchInput = ref('')

    const debouncedSearch = useDebounceFn((val: string) => {
        table.value?.tableApi?.getColumn('description')?.setFilterValue(val)
    }, 300)

    watch(searchInput, (val) => {
        debouncedSearch(val)
    })

    const columns: TableColumn<Organisation>[] = [
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
        {
            id: 'details',
            header: () => h('div', { class: 'flex items-center justify-center' }, 'Détails'),
            cell: ({ row }) => h('div', { class: 'flex items-center justify-center' }, h(UButton, {
                'color': 'neutral',
                'variant': 'ghost',
                'icon': 'i-lucide-maximize-2',
                'aria-label': 'Agrandir',
                'class': '-mx-2.5',
                'onClick': () => {
                    selectedOrganisation.value = row.original
                    openSlideOver.value = true
                }
            })),
        },
        {
            accessorKey: 'code',
            header: 'Code',
            cell: ({ row }) => h('p', { class: 'font-medium' }, row.original.code)
        },
        {
            accessorKey: 'nom',
            header: 'Nom',
            cell: ({ row }) => h('p', { class: 'font-medium' }, row.original.nom)
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
                        ? isSorted === 'asc'
                            ? 'i-lucide-arrow-up-narrow-wide'
                            : 'i-lucide-arrow-down-wide-narrow'
                        : 'i-lucide-arrow-up-down',
                    class: '-mx-2.5',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                })
            }
        },
        {
            accessorKey: 'type_organisation_id',
            header: "Type d'organisation",
            cell: ({ row }) => h('p', { class: 'font-medium' }, row.original.type?.nom || 'N/A')
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

    function getRowItems(row: Row<Organisation>): DropdownMenuItem[][] {
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
                    selectedOrganisation.value = row.original
                    openSlideOver.value = true
                }
            },
            {
                label: 'Modifier',
                icon: 'i-lucide-pencil',
                onSelect() {
                    selectedOrganisationToEdit.value = row.original
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
    
    const organisations = useParametresStore().organisations;

    // const { data: organisations, pending, refresh: refreshOrganisations } = useAsyncData('organisations', async () => {
    //     const { data, error } = await supabase.from('organisations').select('id, nom, code, description, status, owner_id, organisation_parent_id, type:type_organisation_id(id, nom, code)')
    //     if (error) {
    //         throw error
    //     }
    //     return data as Organisation[]
    // })
</script>
