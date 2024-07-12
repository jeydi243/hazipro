<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'dark:bg-gray-950'
  }
})

</script>

<template>
  <UDashboardLayout>
    <div class="h-screen flex items-center justify-center overlay w-screen">
      <slot />
    </div>
    <!-- ~/components/NotificationsSlideover.vue -->
    <NotificationsSlideover />
  </UDashboardLayout>
</template>
