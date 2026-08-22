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
                    <BeneficiairesAddModal />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <UTable ref="table" v-model:column-filters="columnFilters" v-model:column-visibility="columnVisibility"
                v-model:row-selection="rowSelection" v-model:pagination="pagination"
                :pagination-options="paginationOptions" class="shrink-0 m-2" :data="nfs ?? EMPTY_ROWS"
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

    <UDrawer v-model:open="openDetailsClasse" title="Détails" description="Détails de la classe sélectionnée">
        <template #body>
            <div class="p-4 text-center">
                <p v-if="selectedBenef" class="font-medium">{{ selectedBenef.categorie_id }}</p>
                <p v-else>Sélectionnez un bénéficiaire pour voir les détails.</p>
            </div>
        </template>
    </UDrawer>

    <ClassesUpdateModal v-model:open="openClasseUpdateModal" :classe="selectedBenef ?? undefined"
        @classe_updated="refreshClasses" />

    <ClassesListeLookups v-model:open="openSlideOver" :item="selectedBenef" />
</template>

<script setup lang="ts">

    // Tableau vide STABLE pour UTable : évite la boucle de réactivité du watch data
    import type { TableColumn } from '@nuxt/ui'
    import type { Row } from '@tanstack/table-core'
    import type { Beneficiaire } from '~/types'

    const EMPTY_ROWS: any[] = []

    useHead({
        title: 'Bénéficiaires',
        meta: [
            { name: 'description', content: 'Manage Bénéficiaires' }
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
    const selectedBenef = ref<Beneficiaire | null>(null)
    const searchInput = ref('')



    const debouncedSearch = useDebounceFn((val: string) => {
        tableNfs.value?.tableApi?.getColumn('nom')?.setFilterValue(val)
    }, 300)

    watch(searchInput, (val) => {
        debouncedSearch(val)
    })

    // Data loading
    const { data: nfs, refresh: refreshNfData } = useLazyAsyncData<Beneficiaire[]>('beneficiaires', async () => {
        const { data, error } = await supabase.from('nf').select('id, code, nom, description, organisation_id')
        if (error) throw error
        return data as Beneficiaire[]
    })

    async function refreshClasses() {
        await refreshNfData()
    }

    // Columns definition
    const columns: TableColumn<Beneficiaire>[] = [
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
                        selectedBenef.value = row.original;
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
            accessorKey: 'postnom',
            header: 'Postnom',
            cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.nom)
            ])
        },
        {
            id: 'details',
            header: () => h('div', { class: 'text-center' }, 'Categorie Bénéficiaire'),
            cell: ({ row }) => h('div', { class: 'text-center' }, [
                h(UButton, {
                    "color": 'neutral',
                    "variant": 'solid',
                    "icon": 'i-lucide-eye',
                    'aria-label': 'Voir les détails',
                    "onClick": () => {
                        selectedBenef.value = row.original;
                        openSlideOver.value = true;
                    }
                })
            ]),
        },
        {
            header: () => h('div', { class: 'text-center' }, 'Actions'),
            id: 'actions',
            cell: ({ row }) => h('div', { class: 'text-center' },
                h(UDropdownMenu, { content: { align: 'end' }, children: getRowItemsClasse(row) },
                    () => h(UButton, { "icon": 'i-lucide-ellipsis-vertical', 'aria-label': "Plus d'actions", "color": 'neutral', "variant": 'ghost', "class": 'ml-auto' })
                )
            )
        }
    ]

    function getRowItemsClasse(row: Row<Beneficiaire>) {
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
                    selectedBenef.value = row.original
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
