<script setup lang="ts">
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
    <UForm ref="form" :state="state" class="flex flex-col" @submit="onSubmit">
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
