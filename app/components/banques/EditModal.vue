<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { Banque } from '~/types'

    const schema = z.object({
        nom: z.string().min(3, 'Too short'),
        description: z.string(),
        code: z.string()
    })

    const open = defineModel<boolean>('open', { default: false })
    const props = defineProps<{
        matrice: Banque | null
    }>()

    const emit = defineEmits(['update:open', 'point-facturation-updated'])

    const isOpen = computed({
        get: () => open.value,
        set: (value) => emit('update:open', value)
    })

    type Schema = z.output<typeof schema>
    const toast = useToast()
    const parametresStore = useParametresStore()
    const state = reactive<Partial<Schema>>({
        nom: undefined,
        description: undefined,
        code: undefined
    })

    watch(() => props.matrice, (newOrg) => {
        if (newOrg) {
            state.nom = newOrg.nom
            state.code = newOrg.code
        } else {
            state.nom = undefined
            state.code = undefined
        }
    }, { immediate: true })

    const loading = ref(false)

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        if (!props.matrice?.id) return
        loading.value = true
        try {
            await parametresStore.updateBanque(props.matrice.id, {
                nom: event.data.nom,
                description: event.data.description,
                code: event.data.code
            })
            loading.value = false
            toast.add({ title: 'Succès', description: `La banque a été modifiée`, color: 'success' })
            emit('point-facturation-updated')
            isOpen.value = false
        } catch (err: any) {
            loading.value = false
            toast.add({ title: 'Erreur', description: `Impossible de modifier : ${err.message}`, color: 'error' })
        }
    }
</script>

<template>
    <UModal v-model:open="isOpen" title="Modifier" description="Modifier les informations de la banque">
        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Code" name="code">
                    <UInput v-model="state.code" class="w-full" />
                </UFormField>
                <UFormField label="Nom" name="nom">
                    <UInput v-model="state.nom" class="w-full" />
                </UFormField>
                <UFormField label="Description" name="description">
                    <UTextarea v-model="state.description" class="w-full" />
                </UFormField>
                <div class="flex justify-end gap-2">
                    <UButton label="Annuler" color="neutral" variant="subtle" @click="isOpen = false" />
                    <UButton label="Enregistrer" color="primary" variant="solid" type="submit" :loading="loading" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
