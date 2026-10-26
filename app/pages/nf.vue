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
                :pagination-options="paginationOptions" class="shrink-0 m-2" :data="note_frais ?? EMPTY_ROWS"
                :columns="columns" :ui="{
                    base: 'table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-lg',
                    thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
                    tbody: '[&>tr]:last:[&>td]:border-b-0',
                    th: 'py-1 first:rounded-tl-[calc(var(--ui-radius)*2)] last:rounded-tr-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r pl-2',
                    td: 'border-b border-(--ui-border) p-2'
                }" />

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



    <NfHistoriqueApprobation v-model:open="openHistoriqueApprobation" :item="selectedNf" />
    <NfDetails v-model:open="openDetailsNF" :current-nf="selectedNf" />
</template>

<script setup lang="ts">
    import type { TableColumn } from '@nuxt/ui'
    import type { Row } from '@tanstack/table-core'
    import type { Beneficiaire } from '~/types'
    import type { NF } from '~/types/organisation'


    useHead({
        title: 'Note de frais',
        meta: [
            { name: 'description', content: 'Manage note de frais' }
        ]
    })

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
    const EMPTY_ROWS: any[] = []
    const supabase = useSupabaseClient()
    const toast = useToast()
    const openDetailsNF = ref(false)
    const openHistoriqueApprobation = ref(false)
    const selectedNf = shallowRef<NF | null>(null)
    const searchInput = ref('')
    const { copy } = useClipboard()

    const debouncedSearch = useDebounceFn((val: string) => {
        tableNfs.value?.tableApi?.getColumn('nom')?.setFilterValue(val)
    }, 300)

    watch(searchInput, (val) => {
        debouncedSearch(val)
    })
    const note_frais = useNFStore().getNF;

    // Columns definition
    const columns: TableColumn<NF>[] = [
        {
            id: 'edit',
            header: () => h('div', { class: 'text-center' }, 'Edit'),
            cell: ({ row }) => h('div', { class: 'text-center' }, [
                h(UButton, {
                    "color": 'neutral',
                    "variant": 'ghost',
                    "icon": 'i-lucide-edit',
                    'aria-label': 'Modifier',
                    "onClick": () => {
                        selectedNf.value = row.original as unknown as NF;
                        openDetailsNF.value = true;
                    }
                })
            ]),
        },
        {
            accessorKey: 'numero_document',
            header: 'Numero document',
            cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.numero_document)
            ])
        },
        {
            accessorKey: 'nom',
            header: 'Bénéficiaire',
            cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, (row.original.beneficiaire_id as Beneficiaire)?.nom || 'N/A')
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
        }, {
            accessorKey: 'montant_total',
            header: 'Montant',
            cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.montant_total)
            ])
        },
        {
            accessorKey: 'devise',
            header: ({ column }) => {
                const isSorted = column.getIsSorted()
                return h(UButton, {
                    color: 'neutral',
                    variant: 'ghost',
                    label: 'Devise',
                    icon: isSorted
                        ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow')
                        : 'i-lucide-arrow-up-down',
                    class: '-mx-2.5',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                })
            },
            cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.devise_id?.nom || 'N/A')
            ])
        },
        {
            accessorKey: 'statut_document',
            header: ({ column }) => {
                const isSorted = column.getIsSorted()
                return h(UButton, {
                    color: 'neutral',
                    variant: 'ghost',
                    label: 'Statut du document',
                    icon: isSorted
                        ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow')
                        : 'i-lucide-arrow-up-down',
                    class: '-mx-2.5',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                })
            },
            cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.statut_document)
            ])
        },
        {
            accessorKey: 'statut_paiement',
            header: ({ column }) => {
                const isSorted = column.getIsSorted()
                return h(UButton, {
                    color: 'neutral',
                    variant: 'ghost',
                    label: 'Statut de paiement',
                    icon: isSorted
                        ? (isSorted === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow')
                        : 'i-lucide-arrow-up-down',
                    class: '-mx-2.5',
                    onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
                })
            },
            cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.statut_paiement)
            ])
        },

        // {
        //     id: 'details',
        //     header: () => h('div', { class: 'text-center' }, 'Lookups'),
        //     cell: ({ row }) => h('div', { class: 'text-center' }, [
        //         h(UButton, {
        //             "color": 'neutral',
        //             "variant": 'solid',
        //             "icon": 'i-lucide-eye',
        //             'aria-label': 'Voir les détails',
        //             "onClick": () => {
        //                 selectedNf.value = row.original;
        //                 openSlideOver.value = true;
        //             }
        //         })
        //     ]),
        // },
        {
            header: () => h('div', { class: 'text-center' }, 'Actions'),
            id: 'actions',
            cell: ({ row }) => h('div', { class: 'text-center' },
                h(UDropdownMenu, { content: { align: 'end' }, items: getRowItemsClasse(row) },
                    () => h(UButton, { "icon": 'i-lucide-ellipsis-vertical', 'aria-label': "Plus d'actions", "color": 'neutral', "variant": 'ghost', "class": 'ml-auto' })
                )
            )
        }
    ]

    function getRowItemsClasse(row: Row<NF>) {
        return [[
            { type: 'label', label: 'Actions' },
            {
                label: "Historique d'approbation",
                icon: 'i-lucide-copy',
                onSelect() {
                    openHistoriqueApprobation.value = true
                    selectedNf.value = row.original as unknown as NF
                }
            },
            {
                label: "Pieces jointes",
                icon: 'i-lucide-file-text',
                onSelect() {
                    copy(row.original.id.toString())
                    toast.add({ title: 'Copied', description: 'Classe ID copied to clipboard' })
                }
            },
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
                    selectedNf.value = row.original as unknown as NF
                    // openDetailsClasse.value = true
                }
            },
            { type: 'separator' },
            {
                label: 'Annuler la note de frais',
                icon: 'i-lucide-trash',
                color: 'error' as const,
                onSelect() {
                    toast.add({ title: 'Delete', description: 'Action non implémentée.' })
                }
            }
        ]]
    }
</script>
