<template>
    <div>
        <!-- Page heading -->
        <div class="mb-8">
            <h1 class="text-2xl font-semibold tracking-tight text-(--ui-text-highlight)">
                Connectez-vous
            </h1>
            <p class="mt-1.5 text-sm text-(--ui-text-muted)">
                Accédez à votre espace de facturation Hazipro
            </p>
        </div>

        <!-- Form -->
        <UAuthForm :schema="schema" :fields="fields" :providers="providers" icon="i-lucide-user" :validate-on="[]"
            @submit="onSubmit" />
    </div>
</template>

<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

    useHead({
        title: 'Connexion — Hazipro',
        meta: [{ name: 'description', content: 'Connectez-vous à votre espace de facturation Hazipro.' }],
    })

    const auth = useAuth()

    const fields: AuthFormField[] = [
        {
            name: 'tenant',
            type: 'text',
            label: 'Espace de travail',
            placeholder: 'Nom de votre organisation',
            required: true,
            autocomplete: 'organization',
        },
        {
            name: 'email',
            type: 'email',
            label: 'Adresse email',
            placeholder: 'vous@exemple.com',
            required: true,
            autocomplete: 'email',
        },
        {
            name: 'password',
            label: 'Mot de passe',
            type: 'password',
            placeholder: 'Votre mot de passe',
            required: true,
            autocomplete: 'current-password',
        },
    ]

    const providers = [
        {
            label: 'Clé d\'accès',
            icon: 'i-lucide-fingerprint',
            color: 'neutral' as const,
            onClick: () => auth.loginWithPasskey(),
        },
    ]

    definePageMeta({
        layout: 'auth',
    })

    const schema = z.object({
        email: z.email('Adresse email invalide'),
        tenant: z.string().min(1, 'Veuillez indiquer votre espace de travail'),
        password: z.string().min(1, 'Veuillez indiquer votre mot de passe'),
    })

    type Schema = z.output<typeof schema>

    const toast = useToast()

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        await auth.login(event.data.tenant, event.data.email, event.data.password)
    }
</script>
