<script setup lang="ts">
    useHead({
        title: 'Budget - Wazi',
        meta: [
            { name: 'description', content: 'Manage your budget.' }
        ]
    })
    const links = [{
        label: 'Budget',
        icon: 'i-lucide-user',
        to: '/budget',
        exact: true
    }, {
        label: 'Controle budgétaire',
        icon: 'i-lucide-users',
        to: '/budget/controle'
    }, {
        label: 'Réalisation budgétaire',
        icon: 'octicon:organization-16',
        to: '/budget/realisation'
    },
    {
        label: 'Table de concordance',
        icon: 'octicon:organization-16',
        to: '/budget/concordance'
    },
    {
        label: 'Reporting',
        icon: 'icon-park-outline:ad-product',
        to: '/budget/reporting'
    }
    ]
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
