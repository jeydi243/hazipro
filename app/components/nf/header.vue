<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const state = reactive({
    email: undefined,
    password: undefined
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
    <UForm ref="form" :state="state" @submit="onSubmit">
        <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
            <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UButton type="submit">
            Submit
        </UButton>
    </UForm>
</template>
