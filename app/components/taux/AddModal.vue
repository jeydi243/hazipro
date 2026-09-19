<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
import type { Lookup } from '~/types'

const schema = z.object({
    from_currency: z.string().min(3, 'Too short'),
    to_currency: z.string().min(3, 'Too short'),
    description: z.string(),
    valeur: z.string(),
    date_taux: z.string(),
})
const open = ref(false)
const toast = useToast()
type Schema = z.output<typeof schema>
const supabase = useSupabaseClient()
const state = reactive<Partial<Schema>>({
    from_currency: undefined,
    to_currency: undefined,
    description: undefined,
    valeur: undefined,
    date_taux: undefined,
})
const { data: lookups } = useAsyncData('org-lookups', async () => {
    const { data, error } = await supabase.from('lookups').select('id, nom')
    if (error) throw error
    return data
})
const devises: Lookup[] = useLookupsStore().getDevise
const items = computed<SelectMenuItem[]>(() => devises?.map((lookup: any) => ({
    label: lookup.nom,
    id: lookup.id
})) || [])

const emit = defineEmits(['taux-added'])
const parametresStore = useParametresStore()

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        await parametresStore.createTaux({
            from_currency: event.data.from_currency,
            to_currency: event.data.to_currency,
            description: event.data.description,
            valeur: event.data.valeur,
            date_taux: event.data.date_taux
        } as any)
        toast.add({ title: 'Succès', description: `Nouveau taux ${event.data.from_currency} ajouté`, color: 'success' })
        emit('taux-added')
        open.value = false
    } catch (err: any) {
        toast.add({ title: 'Erreur', description: err.message, color: 'error' })
    }
}
</script>


<template>
    <UModal v-model:open="open" title="Taux" description="Add a new taux to the database">
        <UButton label="New taux" icon="i-lucide-plus" />

        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Devise d'origine" placeholder="_" name="from_currency">
                    <USelectMenu v-model="state.from_currency" value-key="id" :items="items" class="w-full" />
                </UFormField>
                <UFormField label="Devise de destination" placeholder="_" name="to_currency">
                    <USelectMenu v-model="state.to_currency" value-key="id" :items="items" class="w-full" />
                </UFormField>
                <UFormField label="Valeur" placeholder="Valeur du taux" name="valeur">
                    <UInput v-model="state.valeur" class="w-full" />
                </UFormField>
                <UFormField label="Date du taux" placeholder="Date du taux" name="date_taux">
                    <UInput v-model="state.date_taux" class="w-full" />
                </UFormField>
                <div class="flex justify-end gap-2">
                    <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Add" color="primary" variant="solid" type="submit" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
