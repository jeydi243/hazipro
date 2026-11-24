<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { BudgetCorrespondanceLine, Lookup } from '~/types'

    const props = defineProps<{
        budget: BudgetHeader | null
    }>()
    const schema = z.object({
        budget_header_id: z.string(),
        budget_code_id: z.string(),
        entite_id: z.string(),
        montant: z.number(),
    })
    type Schema = z.output<typeof schema>
    const open = ref(false)
    const loading = ref(false)
    const toast = useToast()
    const emit = defineEmits(['budget-line-added'])
    const budgetsStore = useBudgetsStore()
    const parametresStore = useParametresStore()
    const state = reactive<Partial<Schema>>({
        budget_header_id: props.budget?.id || undefined,
        budget_code_id: undefined,
        entite_id: undefined,
        montant: 1,
    })
    const Organisations = computed(() => parametresStore.organisations);
    const BudgetCorrespondanceLines = computed(() => budgetsStore.budgetCorrespondanceLine);
    const BudgetHeaders = computed(() => budgetsStore.getBudgetHeaders);
    const typeBudget: Lookup[] = useLookupsStore().getTypeBudget
    const typeScenarioBudget: Lookup[] = useLookupsStore().getScenarioBudget

    const itemsBudget = computed<SelectMenuItem[]>(() => BudgetHeaders.value?.map((budget) => ({
        label: (budget.type_budget_id as Lookup)?.description + ' - ' + budget.annee + ' - ' + budget.version,
        id: budget.id
    })) || [])
    const itemsScenario = computed<SelectMenuItem[]>(() => typeScenarioBudget?.map((lookup: Lookup) => ({
        label: lookup.nom,
        id: lookup.id
    })) || [])

    const itemsEntité = computed<SelectMenuItem[]>(() => Organisations?.value.map((lookup: Organisation) => ({
        label: lookup.nom,
        id: lookup.id
    })) || [])

    const itemsCodeCorrespondance = computed<SelectMenuItem[]>(() => BudgetCorrespondanceLines?.value.map((lookup: BudgetCorrespondanceLine) => ({
        label: lookup.code,
        id: lookup.id
    })) || [])



    async function onSubmit(event: FormSubmitEvent<Schema>) {
        loading.value = true;
        try {
            await budgetsStore.addBudgetLine(event.data as any)
            toast.add({ title: 'Succès', description: `Nouvelle ligne de budget ${event.data?.budget_code_id} ajoutée`, color: 'success' })
            emit('budget-line-added')
            open.value = false
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        } finally {
            loading.value = false;
        }
    }
</script>


<template>
    <UModal v-model:open="open" title="Budget" description="Ajouter une nouvelle ligne de budget" :size="'md'"
        :closeable="true" :overlay="true" :close-on-esc="true" :close-on-click-outside="true">
        <UButton label="Ajouter une ligne de budget" icon="i-lucide-plus" />

        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Budget" placeholder="_" name="budget_header_id">
                    <USelectMenu v-model="state.budget_header_id" value-key="id" :items="itemsBudget" class="w-full" />
                </UFormField>
                <UFormField label="Entite" placeholder="Code d'organisation" name="entite_id">
                    <USelectMenu v-model="state.entite_id" value-key="id" :items="itemsEntité" class="w-full" />
                </UFormField>
                <UFormField label="Code de budget" placeholder="Code de budget" name="budget_code_id">
                    <USelectMenu v-model="state.budget_code_id" value-key="id" :items="itemsCodeCorrespondance"
                        class="w-full" />
                </UFormField>
                <UFormField label="Montant" placeholder="John Doe" name="montant">
                    <UInputNumber v-model="state.montant" class="w-full" orientation="vertical" :min="1" />
                </UFormField>
                <div class="flex justify-end gap-2">
                    <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Add" color="primary" variant="solid" type="submit" :loading="loading" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
