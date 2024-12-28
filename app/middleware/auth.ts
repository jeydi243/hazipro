// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  console.log({ user });
  if (!user.value && to.path !== "/auth") {
    return navigateTo("/auth");
  } else {
    console.log("No user connected ", user.value);
  }
});
