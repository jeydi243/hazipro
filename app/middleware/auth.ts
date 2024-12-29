// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  if (!user.value && to.path != '/auth') {
    return navigateTo('/auth');
  } else {
    // console.log('User connected ', user.value, ' to ', to.path, ' is ', user.value === null && to.path != '/auth')
    console.log('There is user connected ', user.value);
  }
})
