<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
    error: NuxtError
}>()
const auth = useAuth()

const isOwnerError = computed(() => props.error.statusCode === 409)

async function logout() {
    await auth.logout()
}

useSeoMeta({
    title: isOwnerError.value ? 'Paramètre owner manquant' : 'Page introuvable',
    description: isOwnerError.value
        ? "Votre paramètre owner n'est pas défini."
        : 'Cette page est introuvable.'
})

useHead({
    htmlAttrs: {
        lang: 'fr'
    }
})
</script>

<template>
    <UApp>
        <div v-if="isOwnerError" class="flex min-h-screen items-center justify-center px-6">
            <UCard class="w-full max-w-lg text-center">
                <UIcon name="i-lucide-triangle-alert" class="mx-auto mb-4 size-12 text-error" />
                <h1 class="text-2xl font-semibold">Paramètre owner non défini</h1>
                <p class="mt-3 text-muted">
                    Votre espace de travail n'est pas configuré. Déconnectez-vous puis reconnectez-vous avec un compte associé à une organisation.
                </p>
                <UButton class="mt-6" color="error" icon="i-lucide-log-out" @click="logout">
                    Se déconnecter
                </UButton>
            </UCard>
        </div>
        <UError v-else :error="error" />
    </UApp>
</template>
