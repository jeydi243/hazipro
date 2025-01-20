<script setup lang="ts">
  const colorMode = useColorMode()
  const supabase = useSupabaseClient()
  const color = computed(() => (colorMode.value === 'dark' ? '#111827' : '#fff8f7'))

  useHead({
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { key: 'theme-color', name: 'theme-color', content: color }],
    link: [{ rel: 'icon', href: '/favicon.ico' }],
    htmlAttrs: {
      lang: 'fr',
    },
  })
  onMounted(async () => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      const store1 = useStoreAuth()
      console.log({ event }, { session })
      if (event == 'INITIAL_SESSION' || event == 'SIGNED_IN') {
        await store1.init()
      } else if (event == 'SIGNED_OUT') {
        store1.onSignedOut()
      }
      const store2 = useStoreOrg()
      const store3 = useStoreBudget()
      const store4 = useStoreNF()
      const store5 = useStorePayments()
      const store6 = useStoreGeneral()

      await store2.init()
      await store3.init()
      await store4.init()
      await store5.init()
      await store6.init()
    })
  })
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
