<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { Lookup } from '~/types'

    const schema = z.object({
        nom: z.string().min(3, 'Too short'),
        frais_id: z.string(),
        montant_total: z.number().positive('Montant total doit être un nombre positif'),
        nf_id: z.string(),
        numero_piece: z.string().optional(),
        date_piece: z.string().optional(),
        devise_id: z.string(),
    })
    const open = ref(false)
    const isLoading = ref(false)
    const toast = useToast()
    type Schema = z.output<typeof schema>
    const supabase = useSupabaseClient()
    const state = reactive<Partial<Schema>>({
        nom: undefined,
        frais_id: undefined,
        montant_total: undefined,
        nf_id: undefined,
        numero_piece: undefined,
        date_piece: undefined,
        devise_id: undefined,
    })

    const typeDocument: Lookup[] = useLookupsStore().getTypeDocumentMatrice
    const itemsTypeDocument = computed<SelectMenuItem[]>(() => typeDocument?.map((lookup: Lookup) => ({
        label: lookup.nom,
        id: lookup.id
    })) || [])

    const emit = defineEmits(['ligne-added'])
    const nfsStore = useNFStore()

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        try {
            isLoading.value = true;
            await nfsStore.createLigne(event.data)
            toast.add({ title: 'Succès', description: `Nouvelle ligne ${event.data.nom} ajoutée`, color: 'success' })
            emit('ligne-added')
            open.value = false
            isLoading.value = false;
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
            isLoading.value = false;
        }
    }
</script>


<template>
    <UModal v-model:open="open" title="Ligne" description="Add a new ligne to the database">
        <UButton label="Nouvelle ligne" icon="i-lucide-plus" />

        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Frais" placeholder="Type document" name="frais_id">
                    <USelectMenu v-model="state.frais_id" value-key="id" :items="itemsTypeDocument" class="w-full" />
                </UFormField>
                <UFormField label="Montant" placeholder="Montant" name="montant_total">
                    <UInput v-model="state.montant_total" class="w-full" />
                </UFormField>
                <UFormField label="Devise" placeholder="Code de la ligne" name="devise_id">
                    <UInput v-model="state.devise_id" class="w-full" />
                </UFormField>
                <UFormField label="Numéro de pièce" placeholder="Numéro de pièce" name="numero_piece">
                    <UInput v-model="state.numero_piece" class="w-full" />
                </UFormField>
                <UFormField label="Date de pièce" placeholder="Date de pièce" name="date_piece">
                    <UInput v-model="state.date_piece" class="w-full" />
                </UFormField>
                <div class="flex justify-end gap-2">
                    <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Ajouter" color="primary" variant="solid" type="submit" :loading="isLoading" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
