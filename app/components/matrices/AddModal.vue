<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { Lookup } from '~/types'

    const schema = z.object({
        nom: z.string().min(3, 'Too short'),
        description: z.string(),
        code: z.string(),
        type_document_id: z.string(),
    })
    const open = ref(false)
    const isLoading = ref(false)
    const toast = useToast()
    type Schema = z.output<typeof schema>
    const supabase = useSupabaseClient()
    const state = reactive<Partial<Schema>>({
        nom: undefined,
        description: undefined,
        code: undefined,
        type_document_id: undefined,
    })
    const { data: lookups } = useAsyncData('org-lookups', async () => {
        const { data, error } = await supabase.from('lookups').select('id, nom')
        if (error) throw error
        return data
    })
    const typeDocument: Lookup[] = useLookupsStore().getTypeDocumentMatrice
    const itemsTypeDocument = computed<SelectMenuItem[]>(() => typeDocument?.map((lookup: Lookup) => ({
        label: lookup.nom,
        id: lookup.id
    })) || [])

    const emit = defineEmits(['matrice-added'])
    const parametresStore = useParametresStore()

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        try {
            isLoading.value = true;
            await parametresStore.createMatrice({
                nom: event.data.nom,
                description: event.data.description,
                code: event.data.code,
                type_document_id: event.data.type_document_id
            } as any)
            toast.add({ title: 'Succès', description: `Nouvelle matrice ${event.data.nom} ajoutée`, color: 'success' })
            emit('matrice-added')
            open.value = false
            isLoading.value = false;
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
            isLoading.value = false;
        }
    }
</script>


<template>
    <UModal v-model:open="open" title="Matrice" description="Add a new matrice to the database">
        <UButton label="New matrice" icon="i-lucide-plus" />

        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Type document" placeholder="Type document" name="type_document_id">
                    <USelectMenu v-model="state.type_document_id" value-key="id" :items="itemsTypeDocument" class="w-full" />
                </UFormField>
                <UFormField label="Code" placeholder="Code d'matrice" name="code">
                    <UInput v-model="state.code" class="w-full" />
                </UFormField>
                <UFormField label="Name" placeholder="John Doe" name="nom">
                    <UInput v-model="state.nom" class="w-full" />
                </UFormField>
                <UFormField label="Description" placeholder="" name="description">
                    <UTextarea v-model="state.description" class="w-full" />
                </UFormField>
                <div class="flex justify-end gap-2">
                    <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Ajouter" color="primary" variant="solid" type="submit" :loading="isLoading" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
