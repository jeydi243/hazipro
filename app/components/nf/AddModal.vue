<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import { generateRandomCode } from '~/utils'
import type { Organisation } from '~/types/organisation'

    const schema = z.object({
        nom: z.string().min(3, 'Too short'),
        description: z.string(),
        code: z.string(),
        matrice_id: z.string(),
        approbateur_id: z.string(),
        organisation_id: z.string({ message: 'Organisation is required' }),
        taux: z.number().optional(),
        type_nf: z.string(),
        groupe_paiement_id: z.string().optional(),
        nature_nf: z.string(),
        beneficiaire_id: z.string(),
        date_document: z.string()
    })
    const open = ref(false)
    const isLoading = ref(false)
    const toast = useToast()
    const nfStore = useNFStore()
    type Schema = z.output<typeof schema>
    const supabase = useSupabaseClient<any>()
    const state = reactive<Partial<Schema>>({
        nom: undefined,
        description: undefined,
        code: undefined,
        matrice_id: undefined,
        approbateur_id: undefined,
        organisation_id: undefined,
        type_nf: undefined,
        nature_nf: undefined,
        groupe_paiement_id: undefined,
        taux: undefined,
        date_document: undefined
    })
    
    const Organisations = useParametresStore().organisations;

    const itemsOrganisations = computed<SelectMenuItem[]>(() => Organisations?.map((org: Organisation) => ({
        label: org.nom,
        id: org.id
    })) || [])
    const { data: beneficiaires, execute } = useLazyFetch('https://jsonplaceholder.typicode.com/users', {
        key: 'typicode-users-email',
        transform: (data: { id: number, name: string, email: string }[]) => {
            return data?.map(user => ({
                label: user.name,
                email: user.email,
                value: String(user.id),
                avatar: { src: `https://i.pravatar.cc/120?img=${user.id}`, loading: 'lazy' as const }
            }))
        },
        immediate: false
    })
    function onOpen() {
        if (!beneficiaires.value?.length) {
            execute()
        }
    }
    async function onSubmit(event: FormSubmitEvent<Schema>) {
        isLoading.value = true
        try {
            await nfStore.create(event.data)
            toast.add({ title: 'Succès', description: `Nouvelle note de frais ajoutée`, color: 'success' })
            open.value = false
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        }
    }
</script>

<template>
    <USlideover v-model:open="open" :ui="{ content: 'min-w-5xl' }" title="Note de frais"
        description="Add a new note de frais to the database">
        <UButton label="Nouvelle Note de frais" icon="i-lucide-plus" />

        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <div class="grid grid-cols-4 gap-4">
                    <UFormField label="Direction" name="code">
                        <USelectMenu v-model="state.organisation_id" value-key="id" :items="itemsOrganisations"
                            class="w-full" />
                    </UFormField>
                    <UFormField label="Type NF" placeholder="Employé" name="type_nf">
                        <UInput v-model="state.type_nf" class="w-full" />
                    </UFormField>
                    <UFormField label="Nature de la note" placeholder="" name="nature_nf">
                        <UInput v-model="state.nature_nf" class="w-full" />
                    </UFormField>

                    <UFormField label="Code" name="code">
                        <UInput v-model="state.code" class="w-full" placeholder="Code de l'article">
                            <template #trailing>
                                <UButton icon="i-lucide-refresh-cw" color="neutral" variant="ghost" size="xs"
                                    aria-label="Régénérer le code" @click="state.code = generateRandomCode()" />
                            </template>
                        </UInput>
                    </UFormField>
                    <UFormField label="Type budget" placeholder="John Doe" name="nom">
                        <UInput v-model="state.nom" class="w-full" />
                    </UFormField>
                    <UFormField label="Matrice" placeholder="" name="description">
                        <UInput v-model="state.matrice_id" class="w-full" />
                    </UFormField>
                    <UFormField label="1er Approbateur" placeholder="_" name="aprobateur">
                        <UInput v-model="state.approbateur_id" class="w-full" />
                    </UFormField>
                    <UFormField label="Approbateur" placeholder="_" name="aprobateur">
                        <UInput v-model="state.approbateur_id" class="w-full" />
                    </UFormField>
                    <UFormField label="Date de la note" placeholder="_" name="aprobateur">
                        <UInput v-model="state.date_document" class="w-full" />
                    </UFormField>
                    <UFormField label="Devise" placeholder="_" name="aprobateur">
                        <UInput v-model="state.approbateur_id" class="w-full" />
                    </UFormField>
                    <UFormField label="Taux" placeholder="_" name="aprobateur">
                        <UInput v-model="state.taux" class="w-full" />
                    </UFormField>
                    <UFormField label="Groupe de paiement" placeholder="_" name="aprobateur">
                        <UInput v-model="state.groupe_paiement_id" class="w-full" />
                    </UFormField>
                </div>
                <div class="mt-auto">
                    <UFormField label="Bénéficiaire" placeholder="_" name="beneficiaire_id">
                        <USelectMenu v-model="state.beneficiaire_id" :value-key="value" :items="beneficiaires"
                            icon="i-lucide-user" placeholder="Select user" :ui="{ content: 'min-w-fit' }" class="w-full"
                            @update:open="onOpen">
                            <template #item-label="{ item }">
                                {{ item.label }}

                                <span class="text-muted">
                                    {{ item.email }}
                                </span>
                            </template>
                        </USelectMenu>
                    </UFormField>
                    <UFormField label="Description" placeholder="_" name="aprobateur">
                        <UTextarea v-model="state.description" class="w-full" />
                    </UFormField>
                </div>
                <!-- <div class="flex justify-end gap-2">
                    <UButton label="Annuler" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Créer" form="" color="primary" variant="solid" type="submit" />
                </div> -->
            </UForm>
        </template>
        <template #footer="{ close }">
            <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
            <UButton label="Documents" color="info" variant="outline" />
            <UButton label="Créer la note de frais" class="ml-auto" color="primary" variant="solid" type="submit"
                :loading="isLoading" />
        </template>
    </USlideover>
</template>
