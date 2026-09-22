<script setup lang="ts">
useHead({
    title: 'Settings - Wazi',
    meta: [
        { name: 'description', content: 'Manage your settings.' }
    ]
})
const links = [{
    label: 'Parametres',
    icon: 'i-lucide-user',
    to: '/settings',
    exact: true
}, {
    label: 'Lookups',
    icon: 'i-lucide-users',
    to: '/settings/lookups'
}, {
    label: 'Organisations',
    icon: 'i-lucide-building-2',
    to: '/settings/organisations'
},
{
    label: 'Matrices',
    icon: 'i-lucide-building-2',
    to: '/settings/matrices'
},
{
    label: 'Articles',
    icon: 'i-lucide-package',
    to: '/settings/articles'
},
{
    label: 'Taux',
    icon: 'i-lucide-package',
    to: '/settings/taux'
},

{
    label: 'Grille Tarifaire',
    icon: 'i-lucide-shield',
    to: '/settings/tarifaire'
},
{
    label: 'Utilisateurs',
    icon: 'i-lucide-shield',
    to: '/settings/users'
},
{
    label: 'Rôles',
    icon: 'i-lucide-shield',
    to: '/settings/roles'
},

{
    label: 'Clients',
    icon: 'i-lucide-package',
    to: '/settings/clients'
},
{
    label: 'Security',
    icon: 'i-lucide-shield',
    to: '/settings/security'
}]
</script>

<template>
    <UDashboardPanel id="settings" as="div" :ui="{ body: 'p-0', root: 'p-0 m-0' }" class="p-0">
        <template #header>
            <!-- <UDashboardNavbar title="Parametres">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
</UDashboardNavbar> -->

            <UDashboardToolbar>
                <UDashboardSidebarCollapse />
                <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
                <UNavigationMenu :items="links" class="-mx-1 flex-1" />
            </UDashboardToolbar>
        </template>

        <template #body>
            <NuxtPage />
        </template>
    </UDashboardPanel>
</template>
