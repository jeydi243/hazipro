<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { Lookup } from '~/types'

    const schema = z.object({
        type_budget_id: z.string(),
        code: z.string(),
        description: z.string(),
        compte_budget: z.number(),
        
    })
    const open = ref(false)
    const loading = ref(false)
    const toast = useToast()
    const emit = defineEmits(['code-budget-added'])
    const budgetsStore = useBudgetsStore()
    type Schema = z.output<typeof schema>
    const supabase = useSupabaseClient()
    const state = reactive<Partial<Schema>>({
        type_budget_id: undefined,
        code: undefined,
        description: undefined,
        compte_budget: undefined
    })
    const typeBudget: Lookup[] = useLookupsStore().getTypeBudget
    const typeScenarioBudget: Lookup[] = useLookupsStore().getScenarioBudget

    const items = computed<SelectMenuItem[]>(() => typeBudget?.map((lookup: Lookup) => ({
        label: lookup.nom,
        id: lookup.id
    })) || [])

    async function onSubmit(event: FormSubmitEvent<Schema>) {
            loading.value = true;
        try {
            await budgetsStore.addCodeBudget(event.data as any)
            toast.add({ title: 'Succès', description: `Nouveau code budget ${event.data?.code} ajouté`, color: 'success' })
            emit('code-budget-added')
            open.value = false
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        } finally {
            loading.value = false;
        }
    }
</script>


<template>
    <UModal v-model:open="open" title="Budget" description="Ajouter un nouveau code budget" :size="'md'" :closeable="true" :overlay="true" :close-on-esc="true" :close-on-click-outside="true">
        <UButton label="Ajouter un code de budget" icon="i-lucide-plus" />

        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Type de budget" placeholder="_" name="type_budget_id">
                    <USelectMenu v-model="state.type_budget_id" value-key="id" :items="items" class="w-full" />
                </UFormField>
                <UFormField label="Code" placeholder="Code budget" name="code">
                    <UInput v-model="state.code" class="w-full" />
                </UFormField>
                <UFormField label="Description" placeholder="Description du budget" name="description">
                    <UInput v-model="state.description" class="w-full" />
                </UFormField>
                <UFormField label="Compte budgétaire" placeholder="Compte budgétaire" name="compte_budget">
                    <UInputNumber v-model="state.compte_budget" class="w-full" orientation="vertical" />
                </UFormField>
                <div class="flex justify-end gap-2">
                    <UButton label="Cancel" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Add" color="primary" variant="solid" type="submit" :loading="loading" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
