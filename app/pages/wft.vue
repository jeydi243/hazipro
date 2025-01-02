<script setup lang="ts">
  const links = [
    [
      {
        label: 'Workflow',
        icon: 'i-heroicons-user-circle',
        to: '/wft',
        exact: true,
      },
      {
        label: 'Tasks',
        icon: 'i-heroicons-user-group',
        to: '/wft/tasks',
      }
    ],
  ]
  definePageMeta({
    middleware: ['auth'],
  })
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <!-- <UDashboardNavbar title="Parametres" /> -->

      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>

      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>
