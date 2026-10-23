<script setup lang="ts">
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'
    import type { Approbateur, Profil } from '~/types';
    import type { Matrice, Organisation } from '~/types/organisation';
    import type { Row } from '@tanstack/table-core'

    const { copy } = useClipboard()
    // Tableau vide STABLE pour UTable : évite la boucle de réactivité du watch data
    const EMPTY_ROWS: any[] = []
    const open = defineModel<boolean>('open', { default: false })

    const props = defineProps<{
        matrice: Matrice | null
    }>()
    const selectedApprobateur = ref<Approbateur | null>(null)
    const openDetailsApprobateur = ref(false)
    const emit = defineEmits(['update:open', 'select-matrice'])

    const isOpen = computed({
        get: () => open.value,
        set: (value) => emit('update:open', value)
    })

    const items = [
        {
            label: 'Approbateurs',
            icon: 'i-lucide-user',
            slot: 'users'
        }
    ]
    const parametresStore = useParametresStore()
    const { getApprobateurs } = storeToRefs(parametresStore)

    const approbateurs = computed(() => getApprobateurs.value(props.matrice?.id || null))
    const toast = useToast()
    const UBadge = resolveComponent('UBadge')
    const UButton = resolveComponent('UButton')
    const UDropdownMenu = resolveComponent('UDropdownMenu')

    const columns: TableColumn<Approbateur>[] = [
        {
            accessorKey: 'nom',
            header: 'Nom',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, (row.original.user_id as Profil).nom + ' ' + (row.original.user_id as Profil).postnom || 'N/A')
        },
        {
            accessorKey: 'niveau',
            header: 'Niveau',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.niveau || 'N/A')
        },
        {
            accessorKey: 'Organisation',
            header: 'Organisation',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, (row.original.organisation_id as Organisation)?.nom || 'N/A')
        },
        {
            accessorKey: 'date_debut',
            header: 'Date début',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.date_debut as string || 'N/A')
        },
        {
            accessorKey: 'date_fin',
            header: 'Date fin',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original?.date_fin as string || ' - ')
        },
        {
            accessorKey: 'status',
            header: 'Statut',
            cell: ({ row }) => {
                const statusStr = row.original.status || 'actif'
                const statusColors: Record<string, 'success' | 'error' | 'warning' | 'neutral'> = {
                    actif: 'success',
                    unsubscribed: 'error',
                    bounced: 'warning'
                }
                const color = statusColors[statusStr] || 'neutral'
                return h(UBadge, { variant: 'subtle', color, class: 'capitalize' }, () => statusStr)
            }
        },
        {
            id: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                return h(
                    'div',
                    { class: 'text-center' },
                    h(
                        UDropdownMenu,
                        {
                            content: { align: 'end' },
                            items: getRowItemsApprobateur(row)
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
    function getRowItemsApprobateur(row: Row<Approbateur>): DropdownMenuItem[][] {
        return [[
            { type: 'label', label: 'Actions' },
            {
                label: 'Copy ID',
                icon: 'i-lucide-copy',
                onSelect() {
                    copy(row.original.id.toString())
                    toast.add({ title: 'Copied', description: 'Approbateur ID copied to clipboard' })
                }
            },
            { type: 'separator' },
            {
                label: 'Details',
                icon: 'material-symbols:open-in-full-rounded',
                onSelect() {
                    selectedApprobateur.value = row.original
                    openDetailsApprobateur.value = true
                }
            },
            { type: 'separator' },
            {
                label: 'Désactiver le compte',
                icon: 'i-lucide-trash',
                color: 'error' as const,
                onSelect() {
                    toast.add({ title: 'Delete', description: 'Action non implémentée.' })
                }
            }
        ]]
    }
    const tokenColumns: TableColumn<any>[] = [
        { accessorKey: 'nom', header: 'Nom' },
        { accessorKey: 'valeur', header: 'Valeur', cell: () => h('span', '••••••••') },
        { accessorKey: 'date_debut', header: 'Date début', cell: ({ row }) => h('span', row.original.date_debut || '-') },
        { accessorKey: 'date_expiration', header: 'Date expiration', cell: ({ row }) => h('span', row.original.date_expiration || '-') }
    ]
</script>

<template>
    <USlideover v-model:open="isOpen" title="Détails de la matrice" :ui="{ content: 'max-w-4xl' }" :dismissible="false"
        :close="{
            color: 'primary',
            variant: 'outline',
            class: 'rounded-full'
        }">
        <template #content>
            <div class="p-4 flex flex-col h-full gap-4">
                <div class="flex items-start justify-between gap-4">
                    <div>
                        <p v-if="props.matrice" class="text-xl font-semibold text-highlighted">
                            {{ props.matrice.nom }}
                        </p>
                        <p class="text-sm text-muted flex items-center gap-2 mt-1">
                            <span class="font-mono bg-elevated px-1.5 py-0.5 rounded">{{ props.matrice?.code || 'N/A'
                            }}</span>
                            <UBadge v-if="props.matrice?.status" :label="props.matrice.status" variant="subtle"
                                class="capitalize" />
                        </p>
                    </div>
                    <UButton icon="i-lucide-x" color="primary" variant="outline" class="rounded-full"
                        aria-label="Fermer" @click="isOpen = false" />
                </div>

                <div v-if="props.matrice" class="flex-1 overflow-hidden">
                    <UTabs :items="items" class="h-full flex flex-col" variant="link">
                        <template #infos>
                            <div class="space-y-4 pt-4">
                                <div>
                                    <p class="text-sm font-medium text-muted mb-1">Description</p>
                                    <p class="text-sm text-highlighted">
                                        {{ props.matrice.description ||
                                            'Aucune description.' }}
                                    </p>
                                </div>
                            </div>
                        </template>

                        <template #users>
                            <div class="pt-4 h-full space-y-4 flex flex-col">
                                <div class="flex justify-end">
                                    <MatricesAddApprobateurModal :parent="props.matrice" />
                                </div>
                                <UTable :data="approbateurs ?? EMPTY_ROWS" :columns="columns"
                                    class="border border-default rounded-md overflow-hidden flex-1" :ui="{
                                        base: 'table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-t-lg',
                                        thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
                                        tbody: '[&>tr]:last:[&>td]:border-b-0',
                                        th: 'py-1 first:rounded-tl-[calc(var(--ui-radius)*2)] last:rounded-tr-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r',
                                        td: 'border-b border-(--ui-border) p-2'
                                    }">
                                    <template #empty-state>
                                        <div class="flex flex-col items-center justify-center py-6 text-muted text-sm">
                                            <p>Aucun approbateur trouvé pour cette matrice.</p>
                                        </div>
                                    </template>
                                </UTable>
                            </div>
                        </template>
                    </UTabs>
                </div>
            </div>
        </template>
    </USlideover>
    <MatricesUpdateApprobateur v-model:open="openDetailsApprobateur" :matrice="props.matrice"
        :approbateur="selectedApprobateur" />
</template>
