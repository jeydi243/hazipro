import { createPinia, setActivePinia } from 'pinia'
import { toRaw } from 'vue'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia()

  nuxtApp.vueApp.use(pinia)
  setActivePinia(pinia)
  nuxtApp.provide('pinia', pinia)

  ;(nuxtApp as typeof nuxtApp & { $pinia?: typeof pinia }).$pinia = pinia

  if (nuxtApp.payload && nuxtApp.payload.pinia) {
    pinia.state.value = nuxtApp.payload.pinia
  }

  nuxtApp.hook('app:rendered', () => {
    const activePinia = (nuxtApp as typeof nuxtApp & { $pinia?: typeof pinia }).$pinia
    if (activePinia) {
      nuxtApp.payload.pinia = toRaw(activePinia).state.value
    }
    setActivePinia(undefined)
  })
})
