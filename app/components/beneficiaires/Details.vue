<script setup lang="ts">
    import type { TableColumn } from '@nuxt/ui'
    import type { Adresse, Approbateur, Banque, Beneficiaire, CompteBancaire, Profil } from '~/types';

    // Tableau vide STABLE pour UTable : évite la boucle de réactivité du watch data
    const EMPTY_ROWS: any[] = []
    const open = defineModel<boolean>('open', { default: false })

    const props = defineProps<{
        benef: Beneficiaire | null
    }>()

    const emit = defineEmits(['update:open', 'select-matrice'])

    const isOpen = computed({
        get: () => open.value,
        set: (value) => emit('update:open', value)
    })

    const items = [
        {
            label: 'Comptes bancaires',
            icon: 'i-lucide-user',
            slot: 'comptes'
        },
        {
            label: 'Adresses',
            icon: 'i-lucide-user',
            slot: 'adresses'
        },
    ]
    const beneficiairesStore = useBeneficiairesStore()
    const { getComptesBancaires, getAdresses } = storeToRefs(beneficiairesStore)

    const comptesBancaires = computed<CompteBancaire[]>(() => (getComptesBancaires.value(props.benef?.id || null) ?? []) as CompteBancaire[])
    const adresses = computed<Adresse[]>(() => (getAdresses.value(props.benef?.id || null) ?? []) as Adresse[])
    const UBadge = resolveComponent('UBadge')
    const UButton = resolveComponent('UButton')

    function formatNumeroCompte(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 23)
        return [
            digits.slice(0, 5),
            digits.slice(5, 10),
            digits.slice(10, 21),
            digits.slice(21, 23)
        ].filter(Boolean).join('-')
    }

    const columnsCompte: TableColumn<CompteBancaire>[] = [
        {
            accessorKey: 'intitule',
            header: 'Intitule',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.intitule_compte)
        },
        {
            accessorKey: 'numero_compte',
            header: 'Numéro de compte',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.numero_compte ? formatNumeroCompte(row.original.numero_compte) : 'N/A')
        },
        {
            accessorKey: 'devise',
            header: 'Devise',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.devise || 'N/A')
        },
        {
            accessorKey: 'date_debut',
            header: 'Date début',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, (row.original.beneficiaire_id as Beneficiaire).nom || 'N/A')
        },
        {
            accessorKey: 'banque_id',
            header: 'Banque',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, (row.original?.banque_id as Banque).nom || ' - ')
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
    const columnsAdresse: TableColumn<Adresse>[] = [
        {
            accessorKey: 'nom',
            header: 'Nom',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, (row.original.adresse || 'N/A'))
        },
        {
            accessorKey: 'niveau',
            header: 'Niveau',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.ville || 'N/A')
        },
        {
            accessorKey: 'date_debut',
            header: 'Date début',
            cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.pays as string || 'N/A')
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

</script>

<template>
    <USlideover v-model:open="isOpen" title="Détails du bénéficiaire" :ui="{ content: 'max-w-5xl' }">
        <template #content>
            <div class="p-4 flex flex-col h-full gap-4">
                <div>
                    <p v-if="props.benef" class="text-xl font-semibold text-highlighted">
                        {{
                            props.benef.nom }}
                    </p>
                    <p class="text-sm text-muted flex items-center gap-2 mt-1">
                        <span class="font-mono bg-elevated px-1.5 py-0.5 rounded">{{ props.benef?.code
                            || 'N/A' }}</span>
                        <UBadge v-if="props.benef?.status" :label="props.benef.status" variant="subtle"
                            class="capitalize" />
                    </p>
                </div>

                <div v-if="props.benef" class="flex-1 overflow-hidden">
                    <UTabs :items="items" class="h-full flex flex-col" variant="link">
                        <template #infos>
                            <div class="space-y-4 pt-4">
                                <div>
                                    <p class="text-sm font-medium text-muted mb-1">Description</p>
                                    <p class="text-sm text-highlighted">
                                        {{ props.benef.nom ||
                                            'Aucune description.' }}
                                    </p>
                                </div>
                            </div>
                        </template>

                        <template #comptes>
                            <div class="pt-4 h-full space-y-4 flex flex-col">
                                <div class="flex justify-end">
                                    <BeneficiairesAddCompteBancaire :parent="props.benef" />
                                </div>
                                <UTable :data="comptesBancaires ?? EMPTY_ROWS" :columns="columnsCompte"
                                    class="border border-default rounded-md overflow-hidden flex-1" :ui="{
                                        base: 'table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-t-lg',
                                        thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
                                        tbody: '[&>tr]:last:[&>td]:border-b-0',
                                        th: 'py-1 first:rounded-tl-[calc(var(--ui-radius)*2)] last:rounded-tr-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r',
                                        td: 'border-b border-(--ui-border) p-2'
                                    }">
                                    <template #empty-state>
                                        <div class="flex flex-col items-center justify-center py-6 text-muted text-sm">
                                            <p>Aucun service trouvé pour cette matrice.</p>
                                        </div>
                                    </template>
                                </UTable>
                            </div>
                        </template>
                        <template #adresses>
                            <div class="pt-4 h-full space-y-4 flex flex-col">
                                <div class="flex justify-end">
                                    <BeneficiairesAddAdresse :parent="props.benef" />
                                </div>
                                <UTable :data="adresses ?? EMPTY_ROWS" :columns="columnsAdresse"
                                    class="border border-default rounded-md overflow-hidden flex-1" :ui="{
                                        base: 'table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-t-lg',
                                        thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
                                        tbody: '[&>tr]:last:[&>td]:border-b-0',
                                        th: 'py-1 first:rounded-tl-[calc(var(--ui-radius)*2)] last:rounded-tr-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r',
                                        td: 'border-b border-(--ui-border) p-2'
                                    }">
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
