<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { Lookup } from '~/types'

    const schema = z.object({
        scenario: z.string(),
        version: z.number(),
        annee: z.number(),
        type_budget_id: z.string(),
    })
    const open = ref(false)
    const loading = ref(false)
    const toast = useToast()
    const emit = defineEmits(['budget-added'])
    const budgetsStore = useBudgetsStore()
    type Schema = z.output<typeof schema>
    const supabase = useSupabaseClient()
    const state = reactive<Partial<Schema>>({
        scenario: undefined,
        type_budget_id: undefined,
        version: 1,
        annee: new Date().getFullYear()
    })
    const typeBudget: Lookup[] = useLookupsStore().getTypeBudget
    const typeScenarioBudget: Lookup[] = useLookupsStore().getScenarioBudget

    const items = computed<SelectMenuItem[]>(() => typeBudget?.map((lookup: Lookup) => ({
        label: lookup.nom,
        id: lookup.id
    })) || [])
    const itemsScenario = computed<SelectMenuItem[]>(() => typeScenarioBudget?.map((lookup: Lookup) => ({
        label: lookup.nom,
        id: lookup.id
    })) || [])



    async function onSubmit(event: FormSubmitEvent<Schema>) {
        loading.value = true;
        try {
            await budgetsStore.addBudgetHeader(event.data as any)
            toast.add({ title: 'Succès', description: `Nouveau budget ${event.data?.scenario} ajouté`, color: 'success' })
            emit('budget-added')
            open.value = false
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        } finally {
            loading.value = false;
        }
    }
</script>


<template>
    <UModal v-model:open="open" title="Budget" description="Ajouter un nouveau budget" :size="'md'" :closeable="true"
        :overlay="true" :close-on-esc="true" :close-on-click-outside="true" :close="{
            color: 'primary',
            variant: 'ghost',
            class: 'rounded-full'
        }">
        <UButton label="Ajouter le budget" icon="i-lucide-plus" />

        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Type de budget" placeholder="_" name="type_budget_id">
                    <USelectMenu v-model="state.type_budget_id" value-key="id" :items="items" class="w-full" />
                </UFormField>
                <UFormField label="Scenario" placeholder="Code d'organisation" name="scenario">
                    <USelectMenu v-model="state.scenario" value-key="id" :items="itemsScenario" class="w-full" />
                </UFormField>
                <UFormField label="Version" placeholder="John Doe" name="version">
                    <UInputNumber v-model="state.version" class="w-full" orientation="vertical" :min="1" />
                </UFormField>
                <UFormField label="Exercice fiscale" placeholder="John Doe" name="annee">
                    <UInputNumber v-model="state.annee" class="w-full" orientation="vertical" :min="2026" />
                </UFormField>
                <div class="flex justify-end gap-2">
                    <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Add" color="primary" variant="solid" type="submit" :loading="loading" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
