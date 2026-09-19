<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { Lookup } from '~/types'
    import { getLocalTimeZone, today } from '@internationalized/date'
    import type { DateValue } from '@internationalized/date'

    const maxDate = today(getLocalTimeZone())

    const schema = z.object({
        from_currency: z.string().min(3, 'Too short'),
        to_currency: z.string().min(3, 'Too short'),
        valeur: z.number().positive('Valeur must be a positive number'),
        date_taux: z.string().min(1, 'Date is required').refine(
            (value) => value <= maxDate.toString(),
            'La date ne peut pas être dans le futur',
        ),
    })
    const open = ref(false)
    const toast = useToast()
    type Schema = z.output<typeof schema>
    let loading = ref(false)
    const state = reactive<Partial<Schema>>({
        from_currency: undefined,
        to_currency: undefined,
        valeur: undefined,
        date_taux: undefined,
    })

    const devises: Lookup[] = useLookupsStore().getDevise
    const items = computed<SelectMenuItem[]>(() => devises?.map((lookup: any) => ({
        label: lookup.nom,
        id: lookup.id
    })) || [])
    const dateDocument = shallowRef<DateValue | null>(null)
    const inputDate = useTemplateRef<{ inputsRef: Array<{ $el: HTMLElement }> }>('inputDate')

    watch(dateDocument, (date) => {
        state.date_taux = date?.toString()
    })
    const emit = defineEmits(['taux-added'])
    const parametresStore = useParametresStore()

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        loading.value = true
        try {
            await parametresStore.createTaux({
                from_currency: event.data.from_currency,
                to_currency: event.data.to_currency,
                valeur: event.data.valeur,
                date_taux: event.data.date_taux
            } as any)
            toast.add({ title: 'Succès', description: `Nouveau taux ${event.data.from_currency} ajouté`, color: 'success' })
            emit('taux-added')
            open.value = false
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        } finally {
            loading.value = false
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
                    <UInputNumber v-model="state.valeur" class="w-full" />
                </UFormField>
                <UFormField label="Date du taux" placeholder="Date du taux" name="date_taux">
                    <UInputDate ref="inputDate" v-model="dateDocument" :max-value="maxDate" class="w-full">
                        <template #trailing>
                            <UPopover :reference="inputDate?.inputsRef[3]?.$el">
                                <UButton color="neutral" variant="link" size="sm" icon="i-lucide-calendar"
                                    aria-label="Select a date" class="px-0" />

                                <template #content>
                                    <UCalendar v-model="dateDocument" :max-value="maxDate" class="p-2" />
                                </template>
                            </UPopover>
                        </template>
                    </UInputDate>
                </UFormField>
                <div class="flex justify-between gap-2">
                    <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Ajouter" color="primary" variant="solid" type="submit" :loading="loading" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
