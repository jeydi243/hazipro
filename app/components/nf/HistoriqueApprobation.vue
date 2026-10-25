<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, TableColumn } from '@nuxt/ui'
    import type { Row } from '@tanstack/table-core'
    import type { HistoriqueApprobation, NF } from '~/types/organisation'
import type { Approbateur, Profil } from '~/types'

    // Tableau vide STABLE pour UTable : évite la boucle de réactivité du watch data
    const EMPTY_ROWS: any[] = []

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
    const approbateurs = useNFStore().items;

    // Columns definition
    const columns: TableColumn<HistoriqueApprobation>[] = [
        {
            accessorKey: 'id',
            header: 'ID',
            cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.id)
            ])
        },
        {
            accessorKey: 'approbateur_id',
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
            },
            cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, ((row.original?.approbateur_id as Approbateur)?.user_id as Profil)?.nom || 'N/A')
            ])
        },
        {
            accessorKey: 'date_approbation',
            header: 'Date d\'approbation',
            cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original?.date_approbation)
            ])
        },
        {
            accessorKey: 'date_soumission',
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
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.devise_id?.date_soumission || 'N/A')
            ])
        },
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

    function getRowItemsClasse(row: Row<HistoriqueApprobation>) {
        return [[
            { type: 'label', label: 'Actions' },
            {
                label: "Historique d'approbation",
                icon: 'i-lucide-copy',
                onSelect() {
                    copy(row.original.id.toString())
                    toast.add({ title: 'Copied', description: 'Classe ID copied to clipboard' })
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
                    selectedNf.value = row.original
                    openDetailsClasse.value = true
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
    const schema = z.object({
        nom: z.string().min(3, 'Too short'),
        description: z.string(),
        code: z.string(),
        table_name: z.string(),
    })
    const open = ref(false)
    const lookupsStore = useLookupsStore()
    type Schema = z.output<typeof schema>
    const state = reactive<Partial<Schema>>({
        nom: undefined,
        description: undefined,
        table_name: undefined,
        code: undefined,
    })


    async function onSubmit(event: FormSubmitEvent<Schema>) {
        try {
            await lookupsStore.createClasse(event.data)
            toast.add({ title: 'Succès', description: `Nouvelle classe ${event.data.nom} ajoutée`, color: 'success' })
            open.value = false
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        }
    }
</script>

<template>
    <UModal v-model:open="open" title="Historique d'approbation" description="Add a new classe to the database"
        :ui="{ content: 'min-w-4xl' }">
        <template #body>
            <UTable ref="table" v-model:column-filters="columnFilters" v-model:column-visibility="columnVisibility"
                v-model:row-selection="rowSelection" v-model:pagination="pagination"
                :pagination-options="paginationOptions" class="shrink-0 m-2" :data="approbateurs ?? EMPTY_ROWS"
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
    </UModal>
</template>
