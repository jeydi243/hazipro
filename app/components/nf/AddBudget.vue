<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { Lookup } from '~/types'
    import { getLocalTimeZone, today, type DateValue } from '@internationalized/date';

    const props = defineProps<{ currentNf: Partial<NF> | null; ligneId: string }>();
    const inputDate = useTemplateRef<{ inputsRef: Array<{ $el: HTMLElement }> }>('inputDate')
    const maxDate = today(getLocalTimeZone())
    const Devises = useLookupsStore().getDevise;
    const datePiece = shallowRef<DateValue | undefined>(maxDate)
    const open = ref(false)
    const isLoading = ref(false)
    const toast = useToast()
    const schema = z.object({
        ligne_budget_id: z.string('Veuillez sélectionner une ligne budgetaire'),
        montant_demande: z.number().positive('Montant demandé doit être un nombre positif'),
        montant_annuel: z.number().positive('Montant annuel doit être un nombre positif'),
        devise_id: z.string(),
        nf_line_id: z.string(),
        date_piece: z.string().optional(),
    })
    const itemsDevises = computed<SelectMenuItem[]>(() => Devises?.map((org: Lookup) => ({
        label: org.nom,
        id: org.id
    })) || [])

    type Schema = z.output<typeof schema>
    const state = reactive<Partial<Schema>>({
        ligne_budget_id: undefined,
        montant_demande: 0,
        montant_annuel: 0,
        nf_line_id: props.ligneId,
        devise_id: (props.currentNf?.devise_id as string) || undefined,
    })
    watch(() => state.ligne_budget_id, (newValue) => {
        if (newValue) {
            const selectedLigne = lignesBudgetaire.value.find((ligne) => ligne.id === newValue);
            if (selectedLigne) {
                state.montant_annuel = selectedLigne.montant;
            }
        }
    });

    const frais = useParametresStore().getFrais
    const entiteId = computed(() => props.currentNf?.organisation_id as string)
    const budgetStore = useBudgetsStore()
    const annee = ref(new Date().getFullYear())

    const lignesBudgetaire = computed(() =>
        budgetStore.getLignesBudgetaire(entiteId.value, annee.value)
    )

    const itemsLignesBudgetaire = computed<SelectMenuItem[]>(() => lignesBudgetaire.value?.map((f) => ({
        label: (f.budget_code_id as BudgetCorrespondanceLine).code + ' - ' + (f.budget_code_id as BudgetCorrespondanceLine).description,
        id: f.id
    })) || [])

    const emit = defineEmits(['ligne-added'])

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        try {
            isLoading.value = true;
            await budgetStore.addBudgetTransaction(event.data as any)
            toast.add({ title: 'Succès', description: `Ligne budgetisée avec succès`, color: 'success' })
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
    <UModal v-model:open="open" title="Budgetiser la ligne" description="Enregistrer un budget pour cette ligne">
        <UButton label="Budgetiser" aria-label="Budgetiser" variant="ghost" class="ml-auto" />

        <template #body>
            {{ state }}
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Ligne budgetaire" placeholder="Ligne budgetaire" name="ligne_budget_id">
                    <USelectMenu v-model="state.ligne_budget_id" value-key="id" :items="itemsLignesBudgetaire"
                        class="w-full" />
                </UFormField>
                <UFormField label="Montant annuel" placeholder="Montant annuel" name="montant_annuel">
                    <UInputNumber v-model="state.montant_annuel" type="number" class="w-full" orientation="vertical" disabled
                        locale="de-DE" :format-options="{ useGrouping: true }" />
                </UFormField>
                <UFormField label="Montant demandé" placeholder="Montant demandé" name="montant_demande">
                    <UInputNumber v-model="state.montant_demande" type="number" class="w-full" orientation="vertical"
                        locale="de-DE" :format-options="{ useGrouping: true }" />
                </UFormField>
                <UFormField label="Devise" placeholder="Code de la ligne" name="devise_id">
                    <USelectMenu v-model="state.devise_id" disabled value-key="id" :items="itemsDevises"
                        class="w-full" />
                </UFormField>

                <div class="flex justify-end gap-2">
                    <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Ajouter" color="primary" variant="solid" type="submit" :loading="isLoading" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
