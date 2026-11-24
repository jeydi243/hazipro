<script setup lang="ts">
    import type { TableColumn } from '@nuxt/ui'
    import type { BudgetHeader, BudgetLine } from '~/types'

    // Tableau vide STABLE pour UTable : évite la boucle de réactivité du watch data
    const EMPTY_ROWS: any[] = []
    const open = defineModel<boolean>('open', { default: false })

    const props = defineProps<{
        budget: BudgetHeader | null
    }>()

    const budgetStore = useBudgetsStore()
    const data = ref<BudgetLine[]>([])
    const pending = computed(() => budgetStore.loading)

    watch(
        [() => props.budget, () => budgetStore.getAllLignesBudgetaire],
        ([budget, lignes]) => {
            data.value = budget ? lignes : []
        },
        { immediate: true }
    )

    const emit = defineEmits(['update:open', 'select-budget'])

    const isOpen = computed({
        get: () => open.value,
        set: (value) => emit('update:open', value)
    })

    const toast = useToast()
    const UBadge = resolveComponent('UBadge')
    const UButton = resolveComponent('UButton')

    const columns: TableColumn<BudgetLine>[] = [
        {
            accessorKey: 'entite_id',
            header: 'Entité',
            cell: ({ row }) => h('p', { class: 'font-mono text-(--ui-text-muted)' }, (row.original.entite_id as Organisation).nom || 'N/A')
        },
        {
            accessorKey: 'budget_code_id',
            header: 'Code Budget',
            cell: ({ row }) => h('p', { class: 'font-mono text-(--ui-text-muted)' }, (row.original.budget_code_id as BudgetCorrespondanceLine).code || 'N/A')
        },
        {
            accessorKey: 'montant',
            header: 'Montant',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.montant || 'N/A')
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
            cell: ({ row }) => h('div', { class: 'flex justify-end' }, h(UButton, {
                'color': 'neutral',
                'variant': 'ghost',
                'icon': 'i-lucide-arrow-right',
                'aria-label': 'Aller à',
                'size': 'xs',
                'onClick': () => {
                    // If the user wants to navigate to this organization's details
                    // This would require more logic, but for now we could emit something or update props
                    emit('select-budget', row.original)
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
    <USlideover v-model:open="isOpen" title="Détails du budget" :ui="{ content: 'max-w-5xl' }" :dismissible="false"
        :close="{
            color: 'primary',
            variant: 'ghost',
            class: 'rounded-full'
        }">
        <template #content>
            <div class="p-4 flex flex-col h-full gap-4">
                <div class="flex items-center justify-between">
                    <h2 class="text-lg font-semibold text-highlighted">Détails du budget</h2>
                    <UButton
                        icon="i-lucide-x"
                        color="neutral"
                        variant="ghost"
                        class="rounded-full"
                        aria-label="Fermer"
                        @click="isOpen = false"
                    />
                </div>

                <div v-if="props.budget" class="rounded-lg border border-default bg-elevated/30 p-4">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p class="text-sm text-muted">Budget annuel</p>
                            <h2 class="text-xl font-semibold text-highlighted">
                                {{ props.budget.annee }}
                            </h2>
                        </div>

                        <div class="flex items-center gap-2">
                            <UBadge variant="subtle" color="neutral">
                                Version {{ props.budget.version }}
                            </UBadge>
                            <UBadge v-if="props.budget.status" :label="props.budget.status" variant="subtle"
                                class="capitalize" />
                        </div>
                    </div>

                    <dl class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <div>
                            <dt class="text-sm text-muted">Type de budget</dt>
                            <dd class="font-medium">{{ (props.budget.type_budget_id as Lookup)?.nom }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm text-muted">Scénario</dt>
                            <dd class="font-medium">{{ (props.budget.scenario as Lookup)?.nom }}</dd>
                        </div>
                        <div>
                            <dt class="text-sm text-muted">Version</dt>
                            <dd class="font-medium">{{ props.budget.version }}</dd>
                        </div>
                    </dl>
                </div>

                <div v-if="props.budget" class="flex-1 overflow-hidden">
                    <div class="flex justify-end mb-2">
                        <BudgetAddLigne :budget="props.budget" />
                    </div>

                    <UTable ref="ligne_budgetaire" :data="data ?? EMPTY_ROWS" :columns="columns" :loading="pending"
                        class="border border-default rounded-md overflow-hidden flex-1" :ui="{
                            base: 'table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-t-lg',
                            thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
                            tbody: '[&>tr]:last:[&>td]:border-b-0',
                            th: 'py-1 first:rounded-tl-[calc(var(--ui-radius)*2)] last:rounded-tr-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r',
                            td: 'border-b border-(--ui-border) p-2'
                        }">
                        <template #empty-state>
                            <div class="flex flex-col items-center justify-center py-6 text-muted text-sm">
                                <p>Aucune ligne de budget trouvée pour cette budget.</p>
                            </div>
                        </template>
                    </UTable>
                </div>
            </div>
        </template>
    </USlideover>
</template>
