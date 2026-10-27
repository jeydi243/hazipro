<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { Lookup } from '~/types'
    import { getLocalTimeZone, today, type DateValue } from '@internationalized/date';

    const props = defineProps<{ currentNf: Partial<NF> | null }>();
    const inputDate = useTemplateRef<{ inputsRef: Array<{ $el: HTMLElement }> }>('inputDate')
    const maxDate = today(getLocalTimeZone())
    const Devises = useLookupsStore().getDevise;
    const datePiece = shallowRef<DateValue | undefined>(maxDate)
    const open = ref(false)
    const isLoading = ref(false)
    const toast = useToast()
    const schema = z.object({
        frais_id: z.string(),
        montant_total: z.number().positive('Montant total doit être un nombre positif'),
        devise_id: z.string(),
        nf_id: z.string(),
        numero_piece: z.string().optional(),
        date_piece: z.string().optional(),
    })
    const itemsDevises = computed<SelectMenuItem[]>(() => Devises?.map((org: Lookup) => ({
        label: org.nom,
        id: org.id
    })) || [])
    type Schema = z.output<typeof schema>
    const state = reactive<Partial<Schema>>({
        frais_id: undefined,
        montant_total: 0,
        nf_id: props.currentNf?.id,
        numero_piece: undefined,
        date_piece: undefined,
        devise_id: (props.currentNf?.devise_id as string) || undefined,
    })

    const frais = useParametresStore().getFrais
    const itemsFrais = computed<SelectMenuItem[]>(() => frais?.map((f) => ({
        label: f.nom,
        id: f.id
    })) || [])

    const emit = defineEmits(['ligne-added'])
    const nfsStore = useNFStore()

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        try {
            isLoading.value = true;
            await nfsStore.createLigne(event.data)
            toast.add({ title: 'Succès', description: `Nouveau frais ajoutée`, color: 'success' })
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
                    <USelectMenu v-model="state.frais_id" value-key="id" :items="itemsFrais" class="w-full" />
                </UFormField>
                <UFormField label="Montant" placeholder="Montant" name="montant_total">
                    <UInputNumber v-model="state.montant_total" type="number" class="w-full" />
                </UFormField>
                <UFormField label="Devise" placeholder="Code de la ligne" name="devise_id">
                    <USelectMenu v-model="state.devise_id" disabled value-key="id" :items="itemsDevises"
                        class="w-full" />
                </UFormField>
                <UFormField label="Numéro de pièce" placeholder="Numéro de pièce" name="numero_piece">
                    <UInput v-model="state.numero_piece" class="w-full" />
                </UFormField>
                <UFormField label="Date de la note" name="date_document">
                    <UInputDate ref="inputDate" :model-value="datePiece as any" :max-value="maxDate as any" class="w-full">
                        <template #trailing>
                            <UPopover :reference="inputDate?.inputsRef[3]?.$el">
                                <UButton color="neutral" variant="link" size="sm" icon="i-lucide-calendar"
                                    aria-label="Select a date" class="px-0" />

                                <template #content>
                                    <UCalendar
                                        :model-value="datePiece as any"
                                        :max-value="maxDate as any"
                                        class="p-2"
                                        @update:model-value="datePiece = $event as unknown as DateValue"
                                    />
                                </template>
                            </UPopover>
                        </template>
                    </UInputDate>
                </UFormField>
                <div class="flex justify-end gap-2">
                    <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Ajouter" color="primary" variant="solid" type="submit" :loading="isLoading" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
