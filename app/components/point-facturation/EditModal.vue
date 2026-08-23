<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { Organisation } from '~/types'

    const schema = z.object({
        nom: z.string().min(3, 'Too short'),
        description: z.string(),
        code: z.string(),
        type_organisation_id: z.string()
    })

    const open = defineModel<boolean>('open', { default: false })
    const props = defineProps<{
        organisation: Organisation | null
    }>()

    const emit = defineEmits(['update:open', 'point-facturation-updated'])

    const isOpen = computed({
        get: () => props.open,
        set: (value) => emit('update:open', value)
    })

    const toast = useToast()
    type Schema = z.output<typeof schema>
    const supabase = useSupabaseClient()
    const organisationsStore = useOrganisationsStore()
    const parametresStore = useParametresStore()
        const lookupsStore = useLookupsStore()
    const state = reactive<Partial<Schema>>({
        nom: undefined,
        description: undefined,
        code: undefined,
        type_organisation_id: undefined
    })

    watch(() => props.organisation, (newOrg) => {
        if (newOrg) {
            state.nom = newOrg.nom
            state.description = newOrg.description
            state.code = newOrg.code
            state.type_organisation_id = newOrg.type?.id || newOrg.type_organisation_id
        } else {
            state.nom = undefined
            state.description = undefined
            state.code = undefined
            state.type_organisation_id = undefined
        }
    }, { immediate: true })

    const getTypeOrganisations = computed(() => lookupsStore.getTypeOrganisations)
    const itemsOrganisation = computed<SelectMenuItem[]>(() => getTypeOrganisations.value?.map((org: any) => ({
        label: org.nom,
        id: org.id
    })) || [])

    const loading = ref(false)

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        if (!props.organisation?.id) return
        loading.value = true
        try {
            await organisationsStore.update(props.organisation.id, {
                nom: event.data.nom,
                description: event.data.description,
                code: event.data.code,
                type_organisation_id: event.data.type_organisation_id
            })
            loading.value = false
            toast.add({ title: 'Succès', description: `L'organisation a été modifiée`, color: 'success' })
            emit('point-facturation-updated')
            isOpen.value = false
        } catch (err: any) {
            loading.value = false
            toast.add({ title: 'Erreur', description: `Impossible de modifier : ${err.message}`, color: 'error' })
        }
    }
</script>

<template>
    <UModal v-model:open="isOpen" title="Modifier" description="Modifier les informations de l'organisation">
        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Type d'organisation" name="type_id">
                    <USelectMenu v-model="state.type_organisation_id" value-key="id" :items="itemsOrganisation" class="w-full" />
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
