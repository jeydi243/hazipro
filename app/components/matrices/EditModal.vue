<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { Matrice } from '~/types/organisation'

    const schema = z.object({
        nom: z.string().min(3, 'Too short'),
        description: z.string(),
        code: z.string(),
        type_matrice_id: z.string()
    })

    const open = defineModel<boolean>('open', { default: false })
    const props = defineProps<{
        matrice: Matrice | null
    }>()

    const emit = defineEmits(['update:open', 'point-facturation-updated'])

    const isOpen = computed({
        get: () => open.value,
        set: (value) => emit('update:open', value)
    })

    const toast = useToast()
    type Schema = z.output<typeof schema>
    const parametresStore = useParametresStore()
    const lookupsStore = useLookupsStore()
    const state = reactive<Partial<Schema>>({
        nom: undefined,
        description: undefined,
        code: undefined,
        type_matrice_id: undefined
    })

    watch(() => props.matrice, (newOrg) => {
        if (newOrg) {
            state.nom = newOrg.nom
            state.description = newOrg.description
            state.code = newOrg.code
        } else {
            state.nom = undefined
            state.description = undefined
            state.code = undefined
        }
    }, { immediate: true })

    const getTypeMatrices = computed(() => lookupsStore.getTypeMatrices)
    const itemsMatrice = computed<SelectMenuItem[]>(() => getTypeMatrices.value?.map((org: any) => ({
        label: org.nom,
        id: org.id
    })) || [])

    const loading = ref(false)

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        if (!props.matrice?.id) return
        loading.value = true
        try {
            await matricesStore.update(props.matrice.id, {
                nom: event.data.nom,
                description: event.data.description,
                code: event.data.code,
                type_matrice_id: event.data.type_matrice_id
            })
            loading.value = false
            toast.add({ title: 'Succès', description: `L'matrice a été modifiée`, color: 'success' })
            emit('point-facturation-updated')
            isOpen.value = false
        } catch (err: any) {
            loading.value = false
            toast.add({ title: 'Erreur', description: `Impossible de modifier : ${err.message}`, color: 'error' })
        }
    }
</script>

<template>
    <UModal v-model:open="isOpen" title="Modifier" description="Modifier les informations de l'matrice">
        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Type d'matrice" name="type_id">
                    <USelectMenu v-model="state.type_matrice_id" value-key="id" :items="itemsMatrice" class="w-full" />
                </UFormField>
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
