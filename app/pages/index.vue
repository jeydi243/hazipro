<script setup lang="ts">
useSeoMeta({
    title: 'Accueil',
    description: 'Bienvenue sur votre application Nuxt.',
})
</script>

<template>
    <UDashboardPanel>
        <UDashboardSection title="Tableau de bord">
            <UDashboardCard>
                <template #header>
                    <h2 class="text-lg font-semibold">Bienvenue sur votre template Nuxt</h2>
                </template>
                <p class="text-(--ui-text-muted)">
                    Ce template inclut Nuxt 4, Nuxt UI v4, Supabase, Pinia, Tailwind CSS v4, et plus encore.
                    Utilisez les parametres pour configurer votre application.
                </p>
            </UDashboardCard>
        </UDashboardSection>
    </UDashboardPanel>
</template>
