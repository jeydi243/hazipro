<template>
    <UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
        <UAuthForm title="Login" description="Enter your credentials to access your account." align="bottom"
            icon="i-heroicons-user-circle" :validate="validate"
            :fields="[{ name: 'email', type: 'email', label: 'Email', placeholder: 'Enter your email' }, { name: 'password', type: 'password', label: 'Password', placeholder: 'Enter your password' }]"
            :loading="false" :providers="providers" @submit="onSubmit" />
    </UCard>
</template>

<script setup lang="ts">
import type { AuthResponse, AuthTokenResponsePassword } from '@supabase/supabase-js';

const router = useRouter()
let supabase = useSupabaseClient()
let supbaseUer = useSupabaseUser()
const toast = useToast()
definePageMeta({ layout: 'auth' })
useSeoMeta({
    title: 'Login'
})
const validate = (state: any) => {
    const errors = []
    if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
    if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
    return errors
}
const providers = [{
    label: 'Continue with GitHub',
    icon: 'i-simple-icons-github',
    color: 'white' as const,
    click: () => {
        console.log('Redirect to GitHub')
    }
}]
async function onSubmit(payload: any) {
    console.log("onSubmit %o", payload);
    const { data, error }: AuthTokenResponsePassword = await supabase.auth.signInWithPassword({ email: payload.email, password: payload.password });
    // const response: AuthResponse = await supabase.auth.signUp({ email: data.email, password: data.password, options: {} });
    console.log({ data }, { error });
    if (!error) {
        const current_user = useSupabaseUser()
        console.log({ current_user });
        toast.add({ icon: 'i-solar-shield-warning-linear', title: 'Login successfully', color: 'green', description: 'Bienvenue cher membre !' });
        // router.push('/nf')
    } else {
        toast.add({ icon: 'i-heroicons-check-circle', title: 'Login unseccessful', color: 'red', description: error.message });
        // router.push('/')
    }
}
</script>

<style scoped></style>
