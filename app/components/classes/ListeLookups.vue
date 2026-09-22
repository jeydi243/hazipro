<template>
    <USlideover v-model:open="isOpen" description="Liste des lookups de la classe" title="Lookups"
                :ui="{ content: 'max-w-4xl' }">
        <template #body>
            <div class="flex items-center justify-between gap-2 p-2">
                <UInput v-model="searchInputLookups" class="max-w-xs" icon="i-lucide-search"
                        placeholder="Filtrer par nom ou code…" />
                <div class="flex items-center gap-2">
                    <LookupsAddModal :classe_id="item?.id ?? ''" @lookup_added="refreshLookups" />
                    <LookupsUpdateModal v-model:open="openUpdateModal" :lookup="selectedLookup"
                                        @lookup_updated="refreshLookups" />
                </div>
            </div>

            <div class="max-w-4xl">
                <UTable ref="table" v-model:column-filters="columnFiltersLookups"
                        v-model:column-visibility="columnVisibilityLookups" v-model:row-selection="rowSelectionLookups"
                        v-model:pagination="paginationLookups" :pagination-options="paginationOptionsLookups" class="shrink-0 m-2"
                        :data="lookups" :columns="columnsLookups" :loading="loadingLookups" :ui="haziTableUi" />
            </div>

            <div class="flex items-center justify-between gap-3 border-t border-(--ui-border) p-4 mt-auto">
                <div class="text-xs text-(--ui-text-muted)">
                    {{ totalFilteredRowsLookups }} résultat(s).
                </div>

                <div class="flex items-center gap-1.5">
                    <UPagination :default-page="currentPageLookups" :items-per-page="currentPageSizeLookups"
                                 :total="totalFilteredRowsLookups" size="sm" @update:page="setPageLookups" />
                </div>
            </div>
        </template>
    </USlideover>
</template>

<script setup lang="ts">
import { haziTableUi } from '~/utils/table'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/table-core'
import type { Classe, Lookup } from '~/types'

const props = defineProps({
    open: { type: Boolean, required: true },
    item: { type: Object as PropType<Classe | null>, required: true }
})
const emit = defineEmits(['update:open'])

// 1. Services et composables
const supabase = useSupabaseClient()
const toast = useToast()
const lookupsStore = useLookupsStore()
const { copy } = useClipboard()

const isOpen = computed({
    get: () => props.open,
    set: (value) => emit('update:open', value)
})

// 2. resolveComponent()
const UButton = resolveComponent('UButton')
const UCheckbox = resolveComponent('UCheckbox')
const UDropdownMenu = resolveComponent('UDropdownMenu')

// 3. Refs d'état UI
const selectedLookup = ref<Lookup | null>(null)
const openUpdateModal = ref(false)
const searchInputLookups = ref('')
const lookups = ref<Lookup[]>([])
const loadingLookups = ref(false)
const lookupsError = ref<any>(null)

// 4. useDataTable
const {
    table: tableLookups,
    columnFilters: columnFiltersLookups,
    columnVisibility: columnVisibilityLookups,
    rowSelection: rowSelectionLookups,
    pagination: paginationLookups,
    paginationOptions: paginationOptionsLookups,
    totalFilteredRows: totalFilteredRowsLookups,
    currentPage: currentPageLookups,
    currentPageSize: currentPageSizeLookups,
    setPage: setPageLookups
} = useDataTable({ filterColumnId: 'nom', pageSize: 10 })

// 5. Définition des colonnes
const columnsLookups: TableColumn<Lookup>[] = [
//   {
//     id: 'select',
//     header: ({ table }) => h('div', { class: 'text-center align-middle justify-center w-[10px]' }, h(UCheckbox as any, {
//       modelValue: table.getIsSomePageRowsSelected()
//         ? 'indeterminate'
//         : table.getIsAllPageRowsSelected(),
//       'onUpdate:modelValue': (value: any) =>
//         table.toggleAllPageRowsSelected(!!value),
//       ariaLabel: 'Select all'
//     }))
//     ,
//     cell: ({ row }) => h('div', { class: 'text-center align-middle' }, h(UCheckbox as any, {
//       modelValue: row.getIsSelected(),
//       'onUpdate:modelValue': (value: any) => row.toggleSelected(!!value),
//       ariaLabel: 'Select row'
//     }))
//   },
    {
        id: 'details',
        header: () => h('div', { class: 'text-center' }, 'Details'),
        cell: ({ row }) => h('div', { class: 'text-center align-middle' }, [
            h(UButton, {
                color: 'neutral',
                variant: 'ghost',
                icon: 'i-lucide-pencil',
                'aria-label': 'Modifier',
                onClick: () => {
                    selectedLookup.value = row.original
                    openUpdateModal.value = true
                }
            })
        ]),
    },
    { accessorKey: 'code', header: () => h('div', { class: 'flex flex-col items-start' }, 'Code') },
    {
        accessorKey: 'nom',
        header: 'Nom',
        cell: ({ row }) => h('p', {class:"whitespace-nowrap"}, row.original.nom)
    },
    // {
    //     accessorKey: 'description',
    //     header: ({ column }) => {
    //         const isSorted = column.getIsSorted()
    //         return h(UButton, {
    //             color: 'neutral',
    //             variant: 'ghost',
    //             label: 'Description',
    //             icon: isSorted
    //                 ? isSorted === 'asc'
    //                     ? 'i-lucide-arrow-up-narrow-wide'
    //                     : 'i-lucide-arrow-down-wide-narrow'
    //                 : 'i-lucide-arrow-up-down',
    //             class: '-mx-2.5',
    //             onClick: () => column.toggleSorting(column.getIsSorted() === 'asc')
    //         })
    //     }
    // },
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
                        items: getRowItemsLookups(row)
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

// 6. Fonctions utilitaires
function getRowItemsLookups(row: Row<Lookup>) {
    return [[
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
                    title: 'Copié !',
                    description: 'ID copié dans le presse-papiers'
                })
            }
        },
        { type: 'separator' },
        {
            label: 'Supprimer',
            icon: 'i-lucide-trash',
            color: 'error' as const,
            async onSelect() {
                try {
                    await lookupsStore.removeLookup(row.original.id)
                    toast.add({ title: 'Succès', description: 'Lookup supprimé', color: 'success' })
                    await refreshLookups()
                } catch (err: any) {
                    toast.add({ title: 'Erreur', description: err.message, color: 'error' })
                }
            }
        }
    ]]
}

async function refreshLookups() {
    if (!props.item?.id) return
    loadingLookups.value = true
    lookupsError.value = null
    try {
        const { data, error } = await supabase
            .from('lookups')
            .select('id, nom, code, description, classe_id')
            .eq('classe_id', props.item.id)
        if (error) throw error
        lookups.value = data || []
    } catch (error) {
        lookupsError.value = error
    } finally {
        loadingLookups.value = false
    }
}

// 7. Recherche
const debouncedSearchLookups = useDebounceFn((val: string) => {
    tableLookups.value?.tableApi?.setGlobalFilter(val)
}, 300)

watch(searchInputLookups, (val) => {
    debouncedSearchLookups(val)
})

// 8. Chargement initial et réaction au changement d'item
watch(() => props.item?.id, (newId) => {
    if (newId) {
        refreshLookups()
    } else {
        lookups.value = []
    }
}, { immediate: true })

defineExpose({
    refresh: refreshLookups
})
</script>