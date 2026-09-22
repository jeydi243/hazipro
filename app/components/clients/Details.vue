<script setup lang="ts">
import { haziTableUiEmbedded } from '~/utils/table'
import type { SelectMenuItem, TableColumn } from '@nuxt/ui'
import type { Client, Organisation, ArticleAffectation } from '~/types'

// Tableau vide STABLE pour UTable : évite la boucle de réactivité du watch data
const EMPTY_ROWS: any[] = []
const props = defineProps<{ client: Client | null }>()
const open = defineModel<boolean>('open', { default: false })
const supabase = useSupabaseClient()
const toast = useToast()
const clientsStore = useClientsStore()
const selectedOrgId = ref<string | undefined>(undefined)
const isAddingRecord = ref(false)

// Fetch affectations (organisations) for the current article
const { data: affectations, refresh: refreshAffectations, pending: loadingAffectations } = useAsyncData(
    () => `article-affectations-${props.client?.id}`,
    async () => {
        if (!props.client?.id) return []
        const { data, error } = await supabase
            .from('article_organisations')
            .select('id, created_at, organisation:organisations(id, nom)')
            .eq('article_id', props.client.id)

        if (error) {
            console.error('Error fetching affectations:', error)
            return []
        }
        return data || []
    },
    { watch: [() => props.client?.id, () => open.value], immediate: true }
)

// Fetch organisations for selection (excluding already assigned)
const { data: organisations, refresh: refreshOrganisations } = useAsyncData<Organisation[]>(
    () => `organisations-available-${props.client?.id}`,
    async () => {
        if (!props.client?.id) return []

        const { data: assigned } = await supabase
            .from('client_organisations')
            .select('organisation_id')
            .eq('client_id', props.client.id)

        let query = supabase.from('organisations').select('id, nom')

        const assignedIds = assigned?.map(a => a.organisation_id) || []
        if (assignedIds.length > 0) {
            query = query.not('id', 'in', `(${assignedIds.join(',')})`)
        }

        const { data } = await query
        return (data || []) as unknown as Organisation[]
    },
    { watch: [() => props.client?.id, () => open.value], immediate: true }
)

const orgItems = computed<SelectMenuItem[]>(() => organisations.value?.map(org => ({
    label: org.nom,
    id: String(org.id)
})) || [])

const columns: TableColumn<any>[] = [
    {
        id: 'organisation',
        header: 'Organisation',
        cell: ({ row }) => h('p', { class: 'font-medium text-(--ui-text-highlighted)' }, row.original.organisation?.nom || 'N/A')
    },
    {
        accessorKey: 'created_at',
        header: 'Date d\'affectation',
        cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString()
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => h('div', { class: 'flex justify-end' }, h(resolveComponent('UButton'), {
            "color": 'error',
            "variant": 'ghost',
            "icon": 'i-lucide-trash',
            'aria-label': 'Supprimer',
            "size": 'xs',
            "onClick": () => deleteAffectation(row.original.id)
        }))
    }
]

async function addAffectation() {
    if (!selectedOrgId.value || !props.client?.id) return

    isAddingRecord.value = true
    try {
        await clientsStore.attachOrg(props.client.id, selectedOrgId.value)
        toast.add({ title: 'Succès', description: 'Organisation affectée avec succès', color: 'success' })
        selectedOrgId.value = undefined
        refreshAffectations()
        refreshOrganisations()
    } catch (err: any) {
        toast.add({ title: 'Erreur', description: err.message, color: 'error' })
    } finally {
        isAddingRecord.value = false
    }
}

async function deleteAffectation(id: number) {
    try {
        await clientsStore.detachOrg(String(id))
        toast.add({ title: 'Succès', description: 'Affectation supprimée', color: 'success' })
        refreshAffectations()
        refreshOrganisations()
    } catch (err: any) {
        toast.add({ title: 'Erreur', description: err.message, color: 'error' })
    }
}
</script>

<template>
    <UModal v-model:open="open" title="Détails & Affectations" :description="props.client?.nom || 'Client'" :ui="{
        wrapper: 'w-[600px]'
    }">
        <template #body>
            <div v-if="props.client" class="space-y-6">
                <!-- Détails de l'article -->
                <div
                    class="grid grid-cols-2 gap-4 text-sm p-4 bg-elevated rounded-lg border border-default">
                    <div>
                        <p class="text-muted mb-1">Nom</p>
                        <p class="font-medium text-highlighted">{{ props.client.nom }}</p>
                    </div>
                    <div>
                        <p class="text-muted mb-1">Code</p>
                        <p class="font-mono text-highlighted">{{ props.client.code }}</p>
                    </div>
                    <div class="col-span-2">
                        <p class="text-muted mb-1">Description</p>
                        <p>{{ props.client.description }}</p>
                    </div>
                    <div v-if="props.client.type_id" class="col-span-2">
                        <p class="text-muted mb-1">Type de client</p>
                        <p class="font-medium text-highlighted">
                            {{ (props.client.type_id as any)?.nom }}
                        </p>
                    </div>
                </div>

                <!-- Affectations -->
                <div class="space-y-4">
                    <div class="flex items-center justify-between">
                        <h3 class="text-sm font-semibold uppercase tracking-wider text-muted">
                            Organisations Affectées
                        </h3>
                    </div>

                    <!-- Formulaire d'ajout d'affectation -->
                    <div class="flex items-end gap-2">
                        <div class="flex-1">
                            <UFormField label="Affecter à une organisation" name="organisation">
                                <USelectMenu v-model="selectedOrgId" value-key="id" :items="orgItems"
                                             placeholder="Choisir une organisation…" class="w-full" />
                            </UFormField>
                        </div>
                        <UButton label="Ajouter" icon="i-lucide-link" :loading="isAddingRecord"
                                 :disabled="!selectedOrgId" @click="addAffectation" />
                    </div>

                    <!-- Liste des affectations -->
                    <UTable :data="affectations ?? EMPTY_ROWS" :columns="columns" :loading="loadingAffectations"
                            class="border border-default rounded-md overflow-hidden" :ui="haziTableUiEmbedded">
                        <template #empty-state>
                            <div class="flex flex-col items-center justify-center py-6 text-muted text-sm">
                                <p>Aucune affectation trouvée pour cet article.</p>
                            </div>
                        </template>
                    </UTable>
                </div>
            </div>
            <div v-else class="py-12 flex justify-center">
                <UIcon name="i-lucide-loader-2" class="animate-spin h-8 w-8 text-primary" />
            </div>
        </template>
    </UModal>
</template>
