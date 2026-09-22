<script setup lang="ts">
useSeoMeta({
    title: 'Accueil',
    description: 'Tableau de bord Hazipro.',
})

const links = [
    { label: 'Note de frais', description: 'Créer et suivre les notes de frais', icon: 'i-lucide-id-card', to: '/nf' },
    { label: 'OP - Fournisseur', description: 'Gérer les opérations fournisseurs', icon: 'i-lucide-file-text', to: '/op' },
    { label: 'Bénéficiaires', description: 'Gérer les bénéficiaires', icon: 'i-lucide-users', to: '/beneficiaires' },
    { label: 'Paramètres', description: 'Configurer clients, organisations, taux, matrices…', icon: 'i-lucide-settings', to: '/settings' },
]
</script>

<template>
    <UDashboardPanel>
        <template #header>
            <UDashboardNavbar title="Tableau de bord" />
        </template>
        <template #body>
            <UCard class="m-2">
                <template #header>
                    <h2 class="text-lg font-semibold">Bienvenue sur Hazipro</h2>
                </template>
                <p class="text-(--ui-text-muted) mb-4">
                    Accédez rapidement à vos modules de travail.
                </p>
                <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <UButton v-for="link in links" :key="link.to" :to="link.to" color="neutral" variant="outline"
                        block class="h-auto justify-start p-4 text-left">
                        <span class="flex items-center gap-3">
                            <UIcon :name="link.icon" class="size-5 shrink-0 text-(--ui-text-highlighted)" />
                            <span>
                                <span class="block font-medium text-(--ui-text-highlighted)">{{ link.label }}</span>
                                <span class="block text-xs text-(--ui-text-muted)">{{ link.description }}</span>
                            </span>
                        </span>
                    </UButton>
                </div>
            </UCard>
        </template>
    </UDashboardPanel>
</template>
