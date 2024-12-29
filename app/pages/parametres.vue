<script setup lang="ts">
  const links = [
    [
      {
        label: 'General',
        icon: 'i-heroicons-user-circle',
        to: '/parametres',
        exact: true,
      },
      {
        label: 'Lookups',
        icon: 'i-heroicons-user-group',
        to: '/parametres/lookups',
      },
      {
        label: 'Users',
        icon: 'i-heroicons-users',
        to: '/parametres/users',
      },
      {
        label: 'Frais',
        icon: 'i-heroicons-bell',
        to: '/parametres/frais',
      },
      {
        label: 'Beneficiaires',
        icon: 'i-heroicons-bell',
        to: '/parametres/beneficiaires',
      },
      {
        label: 'Organisations',
        icon: 'i-heroicons-bell',
        to: '/parametres/orgs',
      },
      {
        label: "Matrice d'approbation",
        icon: 'i-heroicons-bell',
        to: '/parametres/matrice_approbation',
      },
    ],
    [
      {
        label: 'Frais',
        icon: 'i-heroicons-book-open',
        to: 'https://ui.nuxt.com/pro',
        target: '_blank',
      },
      {
        label: 'Buy now',
        icon: 'i-heroicons-credit-card',
        to: 'https://ui.nuxt.com/pro/purchase',
        target: '_blank',
      },
    ],
  ]
  definePageMeta({
    middleware: ['auth'],
  })
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Parametres" />

      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>

      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>
