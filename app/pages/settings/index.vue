<script setup lang="ts">
useHead({
    title: 'Paramètres',
    meta: [
        { name: 'description', content: 'Configuration générale de Hazipro.' },
    ],
})

const sections = [
    { label: 'Classes & Lookups', description: 'Référentiels et classes', icon: 'i-lucide-list-tree', to: '/settings/lookups' },
    { label: 'Organisations', description: 'Organisations et services', icon: 'i-lucide-building-2', to: '/settings/organisations' },
    { label: 'Matrices', description: "Matrices d'approbation", icon: 'i-lucide-grid-2x2', to: '/settings/matrices' },
    { label: 'Taux', description: 'Taux appliqués', icon: 'i-lucide-percent', to: '/settings/taux' },
    { label: 'Grille tarifaire', description: 'Tarifs et articles', icon: 'i-lucide-tags', to: '/settings/tarifaire' },
    { label: 'Utilisateurs', description: 'Comptes et accès', icon: 'i-lucide-users', to: '/settings/users' },
    { label: 'Rôles', description: 'Rôles et permissions', icon: 'i-lucide-shield', to: '/settings/roles' },
    { label: 'Articles', description: 'Catalogue des articles', icon: 'i-lucide-package', to: '/settings/articles' },
    { label: 'Clients', description: 'Clients et NIF', icon: 'i-lucide-handshake', to: '/settings/clients' },
    { label: 'Sécurité', description: 'Sécurité du compte', icon: 'i-lucide-lock', to: '/settings/security' },
    { label: 'Notifications', description: 'Préférences de notification', icon: 'i-lucide-bell', to: '/settings/notifications' },
    { label: 'Accès', description: "Gestion des accès", icon: 'i-lucide-key-round', to: '/settings/access' },
]
</script>

<template>
    <UDashboardPanel>
        <UDashboardSection title="Paramètres" description="Configuration générale de votre espace Hazipro.">
            <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <UCard v-for="section in sections" :key="section.to" :to="section.to">
                    <div class="flex items-start gap-3">
                        <UIcon :name="section.icon" class="size-5 shrink-0 text-(--ui-text-highlighted)" />
                        <div>
                            <p class="font-medium text-(--ui-text-highlighted)">{{ section.label }}</p>
                            <p class="text-xs text-(--ui-text-muted)">{{ section.description }}</p>
                        </div>
                    </div>
                </UCard>
            </div>
        </UDashboardSection>
    </UDashboardPanel>
</template>
