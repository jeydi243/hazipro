export function useAuth() {
  const supabase = useSupabaseClient();
  const user = useSupabaseUser();
  const toast = useToast();
  const parametresStore = useParametresStore();
  const usersStore = useUsersStore();

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => {
    return usersStore.usersRoles?.some((ur: any) =>
      ur.role?.code === "admin"
    ) ?? false;
  });

  async function login(tenant: string, email: string, password: string) {
    // 1. Authenticate first (prevents tenant enumeration)
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.add({
        title: "Erreur de connexion",
        description: error.message,
        color: "error",
      });
      return null;
    }

    if (!data.user) return null;

    const userId = data.user.id;
    const uuidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidPattern.test(userId)) {
      await supabase.auth.signOut();
      toast.add({
        title: "Erreur de connexion",
        description: "L'identifiant utilisateur reçu n'est pas un UUID valide.",
        color: "error",
      });
      return null;
    }

    // 2. Verify tenant membership before entering protected routes
    const { data: profil, error: errorProfil } = await supabase
      .from("profils_owner")
      .select(
        "owner_id, profil_id, owner:owner_id!inner(nom), profil:profil_id(email)",
      )
      .eq("profil_id", userId)
      .eq("owner.nom", tenant)
      .single();
    
    console.log({profil});
    console.log(tenant);
    
    if (errorProfil) {
      await supabase.auth.signOut();
      toast.add({
        title: "Erreur de connexion",
        description: "Impossible de vérifier votre organisation. " +
          errorProfil.message,
        color: "error",
      });
      return null;
    }

    if (!profil?.owner_id) {
      // User authenticated but has no tenant — sign out
      await supabase.auth.signOut();
      toast.add({
        title: "Erreur de connexion",
        description:
          `Votre compte n'est pas associé à organisation ${tenant}. Contactez un administrateur.`,
        color: "error",
      });
      await navigateTo("/auth");
      return null;
    }

    // 4. Verify the tenant name matches (if provided)
    // if (!profil) {
    //   await supabase.auth.signOut();
    //   toast.add({
    //     title: "Erreur de connexion",
    //     description: `L'espace de travail "${tenant}" est introuvable.`,
    //     color: "error",
    //   });
    //   await navigateTo("/auth");
    //   return null;
    // }

    parametresStore.setOwnerID(profil.owner_id);
    // Charge les données du tenant en arrière-plan (ne bloque pas le rendu)
    void parametresStore.init();

    toast.add({
      title: "Connexion réussie",
      description: `Bienvenue ${data.user.email || ""} !`,
      color: "success",
    });
    await navigateTo("/");

    return data.user;
  }

  async function loginWithPasskey() {
    const { data, error } = await supabase.auth.signInWithPasskey();

    if (error) {
      toast.add({
        title: "Erreur",
        description: error.message,
        color: "error",
      });
      return null;
    }

    if (data?.user) {
      // Verify user has a profil/tenant before entering protected routes
      // Cast : types générés périmés pour la table profils
      const { data: profil } = (await supabase
        .from("profils")
        .select("owner_id")
        .eq("id", data.user.id)
        .single()) as unknown as {
          data: { owner_id: string | null } | null;
        };

      if (!profil?.owner_id) {
        await supabase.auth.signOut();
        toast.add({
          title: "Erreur",
          description: "Votre compte n'est associé à aucune organisation.",
          color: "error",
        });
        await navigateTo("/auth");
        return null;
      }

      parametresStore.setOwnerID(profil.owner_id);
      void parametresStore.init();

      toast.add({
        title: "Connexion réussie",
        description: "Bienvenue via Passkey !",
        color: "success",
      });
      await navigateTo("/");
    }

    return data?.user ?? null;
  }

  async function logout() {
    const currentUser = user.value;
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.add({
        title: "Erreur",
        description: error.message,
        color: "error",
      });
      return;
    }

    await navigateTo("/auth");
    toast.add({
      title: `Au revoir ${currentUser?.email || ""} !`,
      description: "Vous êtes déconnecté.",
      color: "warning",
    });
  }

  async function register(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      toast.add({
        title: "Erreur",
        description: error.message,
        color: "error",
      });
      return null;
    }

    return data.user;
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    loginWithPasskey,
    logout,
    register,
  };
}
