<script setup lang="ts">
    import { haziTableUiEmbedded } from '~/utils/table'
    import type { TableColumn } from '@nuxt/ui'
    import type { Approbateur } from '~/types';
    import type { Matrice } from '~/types/organisation';

    // Tableau vide STABLE pour UTable : évite la boucle de réactivité du watch data
    const EMPTY_ROWS: any[] = []
    const open = defineModel<boolean>('open', { default: false })

    const props = defineProps<{
        matrice: Matrice | null
    }>()

    const emit = defineEmits(['update:open', 'select-matrice'])
    const parametresStore = useParametresStore()
    const { itemsApprobateurs: approbateurs } = storeToRefs(parametresStore)
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

    const toast = useToast()
    const UBadge = resolveComponent('UBadge')
    const UButton = resolveComponent('UButton')

    const columns: TableColumn<Approbateur>[] = [
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => h('p', { class: 'font-mono text-(--ui-text-muted)' }, row.original?.email || 'N/A')
        },
        {
            accessorKey: 'nom',
            header: 'Nom',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original?.nom)
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
            header: '',
            cell: ({ row }) => h('div', { class: 'flex justify-end' }, h(UButton, {
                'color': 'neutral',
                'variant': 'ghost',
                'icon': 'i-lucide-arrow-right',
                'aria-label': 'Aller à',
                'size': 'xs',
                'onClick': () => {
                    // If the user wants to navigate to this organization's details
                    // This would require more logic, but for now we could emit something or update props
                    emit('select-matrice', row.original)
                }
            }))
        }
    ]

    const tokenColumns: TableColumn<any>[] = [
        { accessorKey: 'nom', header: 'Nom' },
        { accessorKey: 'valeur', header: 'Valeur', cell: () => h('span', '••••••••') },
        { accessorKey: 'date_debut', header: 'Date début', cell: ({ row }) => h('span', row.original.date_debut || '-') },
        { accessorKey: 'date_expiration', header: 'Date expiration', cell: ({ row }) => h('span', row.original.date_expiration || '-') }
    ]
</script>

<template>
    <USlideover v-model:open="isOpen" title="Détails de la matrice" :ui="{ content: 'max-w-4xl' }">
        <template #content>
            <div class="p-4 flex flex-col h-full gap-4">
                <div>
                    <p v-if="props.matrice" class="text-xl font-semibold text-highlighted">
                        {{
                            props.matrice.nom }}
                    </p>
                    <p class="text-sm text-muted flex items-center gap-2 mt-1">
                        <span class="font-mono bg-elevated px-1.5 py-0.5 rounded">{{ props.matrice?.code
                            || 'N/A' }}</span>
                        <UBadge v-if="props.matrice?.status" :label="props.matrice.status" variant="subtle"
                            class="capitalize" />
                    </p>
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
                                    class="border border-default rounded-md overflow-hidden flex-1" :ui="haziTableUiEmbedded">
                                    <template #empty-state>
                                        <div class="flex flex-col items-center justify-center py-6 text-muted text-sm">
                                            <p>Aucun service trouvé pour cette matrice.</p>
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
</template>
