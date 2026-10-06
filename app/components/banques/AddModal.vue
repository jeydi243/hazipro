<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { Lookup } from '~/types'

    const schema = z.object({
        nom: z.string().min(3, 'Too short'),
        description: z.string(),
        code: z.string(),
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
    })

    const emit = defineEmits(['banque-added'])
    const parametresStore = useParametresStore()

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        try {
            isLoading.value = true;
            await parametresStore.createBanque({
                nom: event.data.nom,
                description: event.data.description,
                code: event.data.code,
            } as any)
            toast.add({ title: 'Succès', description: `Nouvelle banque ${event.data.nom} ajoutée`, color: 'success', })
            emit('banque-added')
            open.value = false
            isLoading.value = false;
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
            isLoading.value = false;
        }
    }
</script>


<template>
    <UModal v-model:open="open" title="Banque" description="Add a new banque to the database">
        <UButton label="Ajouter une banque" icon="i-lucide-plus" />

        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Code" placeholder="Code d'banque" name="code">
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
