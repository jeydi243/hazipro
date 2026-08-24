<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Organisation } from '~/types'

// Tableau vide STABLE pour UTable : évite la boucle de réactivité du watch data
const EMPTY_ROWS: any[] = []
const open = defineModel<boolean>('open', { default: false })

const props = defineProps<{
    organisation: Organisation | null
}>()

const emit = defineEmits(['update:open', 'select-organisation'])

const isOpen = computed({
    get: () => open.value,
    set: (value) => emit('update:open', value)
})

const items = [
    {
        label: 'Utilisateurs affectés',
        icon: 'i-lucide-user',
        slot: 'users'
    },
    {
        label: 'Tokens',
        icon: 'i-lucide-user',
        slot: 'tokens'
    }
]

const supabase = useSupabaseClient()
const toast = useToast()

const { data: services, pending, refresh } = useAsyncData<Organisation[]>(
    () => `services-${props.organisation?.id}`,
    async () => {
        if (!props.organisation?.id) return []
        const { data, error } = await supabase
            .from('organisations')
            .select('id, nom, code, description, status, owner_id, organisation_parent_id')
            .eq('organisation_parent_id', props.organisation.id)
        if (error) {
            toast.add({ title: 'Erreur', description: error.message, color: 'error' })
            return []
        }
        return data as Organisation[]
    },
    { watch: [() => props.organisation?.id, () => isOpen.value], immediate: true }
)
const { data: emplacements, pending: pendingEmplacements, refresh: refreshEmplacements } = useAsyncData<Organisation[]>(
    () => `emplacements-${props.organisation?.id}`,
    async () => {
        if (!props.organisation?.id) return []
        const { data, error } = await supabase
            .from('organisations')
            .select('id, nom, code, description, status, owner_id, organisation_parent_id, lookup:type_id!inner(id, nom, code, description)')
            .eq('organisation_parent_id', props.organisation.id)
            .eq('lookup.description', 'Emplacement')
        if (error) {
            toast.add({ title: 'Erreur', description: error.message, color: 'error' })
            return []
        }
        return data as Organisation[]
    },
    { watch: [() => props.organisation?.id, () => isOpen.value], immediate: true }
)

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const columns: TableColumn<Organisation>[] = [
    {
        accessorKey: 'code',
        header: 'Code',
        cell: ({ row }) => h('p', { class: 'font-mono text-(--ui-text-muted)' }, row.original.code || 'N/A')
    },
    {
        accessorKey: 'nom',
        header: 'Nom',
        cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.nom)
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
                emit('select-organisation', row.original)
            }
        }))
    }
]

const { data: tokens, pending: pendingTokens, refresh: refreshTokens } = useAsyncData<any[]>(
    () => `tokens-${props.organisation?.id}`,
    async () => {
        if (!props.organisation?.id) return []
        const { data, error } = await supabase
            .from('organisation_tokens')
            .select('id, nom, valeur, date_debut, date_expiration')
            .eq('organisation_id', props.organisation.id)
        if (error) {
            toast.add({ title: 'Erreur', description: error.message, color: 'error' })
            return []
        }
        return data || []
    },
    { watch: [() => props.organisation?.id, () => isOpen.value], immediate: true }
)

const tokenColumns: TableColumn<any>[] = [
    { accessorKey: 'nom', header: 'Nom' },
    { accessorKey: 'valeur', header: 'Valeur', cell: () => h('span', '••••••••') },
    { accessorKey: 'date_debut', header: 'Date début', cell: ({ row }) => h('span', row.original.date_debut || '-') },
    { accessorKey: 'date_expiration', header: 'Date expiration', cell: ({ row }) => h('span', row.original.date_expiration || '-') }
]
</script>

<template>
    <USlideover v-model:open="isOpen" title="Détails de l'organisation" :ui="{ content: 'max-w-4xl' }">
        <template #content>
            <div class="p-4 flex flex-col h-full gap-4">
                <div>
                    <p v-if="props.organisation" class="text-xl font-semibold text-highlighted">
                        {{
                            props.organisation.nom }}
                    </p>
                    <p class="text-sm text-muted flex items-center gap-2 mt-1">
                        <span class="font-mono bg-elevated px-1.5 py-0.5 rounded">{{ props.organisation?.code
                            || 'N/A' }}</span>
                        <UBadge v-if="props.organisation?.status" :label="props.organisation.status" variant="subtle"
                                class="capitalize" />
                    </p>
                </div>

                <div v-if="props.organisation" class="flex-1 overflow-hidden">
                    <UTabs :items="items" class="h-full flex flex-col" variant="link">
                        <template #infos>
                            <div class="space-y-4 pt-4">
                                <div>
                                    <p class="text-sm font-medium text-muted mb-1">Description</p>
                                    <p class="text-sm text-highlighted">
                                        {{ props.organisation.description ||
                                            'Aucune description.' }}
                                    </p>
                                </div>
                            </div>
                        </template>

                        <template #users>
                            <div class="pt-4 h-full space-y-4 flex flex-col">
                                <div class="flex justify-end">
                                    <PointFacturationAttachUserModal :parent="props.organisation" @user-added="refresh" />
                                </div>
                                <UTable :data="services ?? EMPTY_ROWS" :columns="columns" :loading="pending"
                                        class="border border-default rounded-md overflow-hidden flex-1" :ui="{
                                            base: 'table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-t-lg',
                                            thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
                                            tbody: '[&>tr]:last:[&>td]:border-b-0',
                                            th: 'py-1 first:rounded-tl-[calc(var(--ui-radius)*2)] last:rounded-tr-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r',
                                            td: 'border-b border-(--ui-border) p-2'
                                        }">
                                    <template #empty-state>
                                        <div
                                            class="flex flex-col items-center justify-center py-6 text-muted text-sm">
                                            <p>Aucun service trouvé pour cette organisation.</p>
                                        </div>
                                    </template>
                                </UTable>
                            </div>
                        </template>
                        <template #emplacements>
                            <div class="pt-4 h-full space-y-4 flex flex-col">
                                <div class="flex justify-end">
                                    <OrganisationsAddEmplacementModal :parent="props.organisation" @emplacement-added="refresh" />
                                </div>
                                <UTable :data="emplacements ?? EMPTY_ROWS" :columns="columns" :loading="pending"
                                        class="border border-default rounded-md overflow-hidden flex-1" :ui="{
                                            base: 'table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-t-lg',
                                            thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
                                            tbody: '[&>tr]:last:[&>td]:border-b-0',
                                            th: 'py-1 first:rounded-tl-[calc(var(--ui-radius)*2)] last:rounded-tr-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r',
                                            td: 'border-b border-(--ui-border) p-2'
                                        }">
                                    <template #empty-state>
                                        <div
                                            class="flex flex-col items-center justify-center py-6 text-muted text-sm">
                                            <p>Aucun emplacement trouvé pour cette organisation.</p>
                                        </div>
                                    </template>
                                </UTable>
                            </div>
                        </template>

                        <template #tokens>
                            <div class="pt-4 h-full space-y-4 flex flex-col">
                                <div class="flex justify-end">
                                    <PointFacturationAddTokenModal v-if="props.organisation" :organisation="props.organisation" @token-added="refreshTokens" />
                                </div>
                                <UTable :data="tokens ?? EMPTY_ROWS" :columns="tokenColumns" :loading="pendingTokens"
                                        class="border border-default rounded-md overflow-hidden flex-1" :ui="{
                                            base: 'table-fixed border-separate border-spacing-0 border border-(--ui-border) rounded-t-lg',
                                            thead: '[&>tr]:bg-(--ui-bg-elevated)/50 [&>tr]:after:content-none',
                                            tbody: '[&>tr]:last:[&>td]:border-b-0',
                                            th: 'py-1 first:rounded-tl-[calc(var(--ui-radius)*2)] last:rounded-tr-[calc(var(--ui-radius)*2)] border-y border-(--ui-border) first:border-l last:border-r',
                                            td: 'border-b border-(--ui-border) p-2'
                                        }">
                                    <template #empty-state>
                                        <div
                                            class="flex flex-col items-center justify-center py-6 text-muted text-sm">
                                            <p>Aucun token trouvé pour cette organisation.</p>
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
