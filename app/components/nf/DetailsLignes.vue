<template>
    <div>
        <div class="flex justify-end mb-2">
            <NfAddLigne :current-nf="currentNf" />
        </div>

        <UTable ref="table" v-model:column-filters="columnFilters" v-model:column-visibility="columnVisibility"
            v-model:row-selection="rowSelection" v-model:pagination="pagination" :pagination-options="paginationOptions"
            class="shrink-0 " :data="lignes_note_frais ?? EMPTY_ROWS" :columns="columns" :ui="{
                base: 'table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-lg',
                thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
                tbody: '[&>tr]:last:[&>td]:border-b-0',
                th: 'py-1 first:rounded-tl-[calc(var(--ui-radius)*2)] last:rounded-tr-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r pl-2',
                td: 'border-b border-(--ui-border) p-2'
            }" />
    </div>
</template>

<script setup lang="ts">
    import type { TableColumn } from '@nuxt/ui'
    import type { Row } from '@tanstack/table-core'
    import type { LigneNF, NF } from '~/types/organisation'

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
    const lignes_note_frais: LigneNF[] = []
    const props = defineProps<{ currentNf: Partial<NF> | null }>();
    const toast = useToast()
    const { copy } = useClipboard()

    const columns: TableColumn<LigneNF>[] = [
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
                        // selectedNf.value = row.original;
                        // openDetailsNF.value = true;
                    }
                })
            ]),
        },
        {
            accessorKey: 'frais_id',
            header: 'Frais',
            cell: ({ row }) => h('div', { class: 'flex items-center gap-3' }, [
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.frais_id)
            ])
        },
        {
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
                h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.devise_id as string || 'N/A')
            ])
        },
        {
            header: () => h('div', { class: 'text-center' }, 'Actions'),
            id: 'actions',
            cell: ({ row }) => h('div', { class: 'text-center' },
                h(UDropdownMenu, {
                    content: { align: 'end' },
                    items: getRowItemsClasse(row)
                },
                    () => h(UButton, { "icon": 'i-lucide-ellipsis-vertical', 'aria-label': "Plus d'actions", "color": 'neutral', "variant": 'ghost', "class": 'ml-auto' })
                )
            )
        }
    ]

    function getRowItemsClasse(row: Row<LigneNF>) {
        return [[
            { type: 'label', label: 'Actions' },
            {
                label: "Historique d'approbation",
                icon: 'i-lucide-copy',
                onSelect() {
                    // openHistoriqueApprobation.value = true
                    // selectedNf.value = row.original
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

<style lang="scss" scoped></style>