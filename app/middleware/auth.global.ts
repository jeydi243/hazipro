export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()
  const parametresStore = useParametresStore()

  if (to.path === '/auth' || to.path === '/confirm') {
    return
  }

  if (!auth.isAuthenticated.value) {
    return navigateTo('/auth')
  }

  // if (!parametresStore.owner_id) {
  //   return showError({
  //     statusCode: 409,
  //     statusMessage: "Le paramètre owner n'est pas défini.",
  //   })
  // }
})
