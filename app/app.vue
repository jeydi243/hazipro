<script setup lang="ts">
  const colorMode = useColorMode()
  const color = computed(() => (colorMode.value === 'dark' ? '#111827' : '#fff8f7'))

  useHead({
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { key: 'theme-color', name: 'theme-color', content: color }],
    link: [{ rel: 'icon', href: '/favicon.ico' }],
    htmlAttrs: {
      lang: 'en',
    },
  })
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: 'https://dashboard-template.nuxt.dev/social-card.png',
    twitterImage: 'https://dashboard-template.nuxt.dev/social-card.png',
    twitterCard: 'summary_large_image',
  })
  onMounted(() => {
    const store1 = useOrg()
    const store2 = useBudget()
    // Call the init actions
    store1.init()
    store2.init()
  })
  const title = 'Hazipro'
  const description = 'Hazipro'
</script>

<template>
  <div>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <UNotifications />
    <UModals />
  </div>
</template>
<style lang="css">
  @keyframes overlayShow {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes contentShow {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }

    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
</style>
