<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'

    // const props = defineProps({
    //     classe_id: {
    //         type: String,
    //         required: true
    //     }
    // })
    type Schema = z.output<typeof schema>
    const emit = defineEmits(['frais_added'])
    const schema = z.object({
        nom: z.string().min(3, 'Too short'),
        code: z.string().min(1, 'Too short'),
        type_frais_id: z.string().min(3, 'Too short'),
        description: z.string()
    })
    const state = reactive<Partial<Schema>>({
        nom: undefined,
        code: undefined,
        type_frais_id: undefined,
        description: undefined,
    })
    const open = ref(false)
    const toast = useToast()
    const lookupsStore = useLookupsStore()
    const paramStore = useParametresStore()
    const Natures = lookupsStore.getTypeFrais;
    const itemsTypeFrais = computed<SelectMenuItem[]>(() => Natures?.map((org: Lookup) => ({
        label: org.nom,
        id: org.id
    })) || [])

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        try {
            await paramStore.createFrais(event?.data as any)
            toast.add({ title: 'Succès', description: `Nouveau frais ${event.data.nom} ajouté`, color: 'success' })
            open.value = false
            emit('frais_added')
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        }
    }

</script>

<template>
    <UModal v-model:open="open" title="Frais" description="Ajouter un nouveau frais">
        <UButton label="Ajouter un frais" icon="i-lucide-plus" />

        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Type de frais" placeholder="_" name="type_frais_id">
                    <USelectMenu v-model="state.type_frais_id" value-key="id" :items="itemsTypeFrais" class="w-full" />
                </UFormField>
                <UFormField label="Nom" placeholder="John Doe" name="nom">
                    <UInput v-model="state.nom" class="w-full" />
                </UFormField>
                <UFormField label="Code" placeholder="_" name="code">
                    <UInput v-model="state.code" class="w-full" />
                </UFormField>
                <UFormField label="Description" placeholder="" name="description">
                    <UInput v-model="state.description" class="w-full" />
                </UFormField>
                <div class="flex justify-end gap-2">
                    <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Créer" color="primary" variant="solid" type="submit" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
