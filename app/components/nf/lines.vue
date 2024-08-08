<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const state = reactive({
    date_piece: undefined,
    numero_piece: undefined,
    montant_total: undefined,
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
    <UCard :ui="{ base: 'w-[75%]' }">
        <UForm ref="form" :state="state" @submit="onSubmit">
            <UFormGroup label="Date piece" name="date_piece">
                <UInput v-model="state.date_piece" />
            </UFormGroup>

            <UFormGroup label="Numero pièce" name="numero_piece">
                <UInput v-model="state.numero_piece" />
            </UFormGroup>

            <UFormGroup label="Montant total" name="montant_total">
                <UInput v-model="state.montant_total" />
            </UFormGroup>

            <UButton type="submit">
                Submit
            </UButton>
        </UForm>
    </UCard>
</template>
