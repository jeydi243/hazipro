<script setup lang="ts">
import { z } from 'zod'
import type { FormError, FormSubmitEvent } from '#ui/types'

const state = reactive({
    crg_demandeur: undefined,
    org_id: undefined,
    beneficiaire_id: undefined,
    type_budget: undefined,
    categorie: undefined,
    description: undefined,
    date_creation: undefined,
    devise: undefined,
    nature_op: undefined,
    taux: undefined
})
const header_schema = z.object({
    crg_demandeur: z.string().email('Invalid email'),
    org_id: z.string().min(8, 'Must be at least 8 characters'),
    beneficiaire_id: z.number().min(100, 'Must be at least 0'),
    type_budget: z.number().min(100, 'Must be at least 0'),
    categorie: z.string().min(8, 'Must be at least 8 characters'),
    description: z.string().min(8, 'Must be at least 8 characters'),
    date_creation: z.date({ required_error: 'Date is required' }),
    devise: z.string().max(3, 'Must be 3 characters'),
    nature_op: z.number().min(100, 'Must be at least 0'),
    taux: z.number().min(100, 'Must be at least 0')
})
const form = ref()

async function onSubmit(event: FormSubmitEvent<any>) {
    form.value.clear()
    try {
        const response = await $fetch('...')
        // ...
    } catch (err) {
        if (err.statusCode === 422) {
            form.value.setErrors(err.data.errors.map((err) => ({
                // Map validation errors to { path: string, message: string }
                message: err.message,
                path: err.path,
            })))
        }
    }
}
</script>

<template>
    <UForm ref="form" :state="state" :schema="header_schema" class="flex flex-col" @submit="onSubmit">
        <UCard class="flex flex-row  mb-2">
            <UFormGroup label="Direction demandeur" name="email" class="mb-2  block">
                <UInput v-model="state.crg_demandeur" />
            </UFormGroup>

            <UFormGroup label="Organisation" name="password" class=" mb-2">
                <UInput v-model="state.org_id" />
            </UFormGroup>
        </UCard>
        <UCard class="flex flex-row">
            <UFormGroup label="Categorie" name="categorie" class="mb-2  block">
                <UInput v-model="state.categorie" />
            </UFormGroup>

            <UFormGroup label="Nature NF" name="nature_op" class=" mb-2">
                <UInput v-model="state.nature_op" />
            </UFormGroup>
        </UCard>

        <UButton type="submit">
            Submit
        </UButton>
    </UForm>
</template>
