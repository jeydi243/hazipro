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

    // 2. Verify tenant membership before entering protected routes
    // Cast : les types générés supabase-database.d.ts sont périmés pour la table profils
    const { data: profil } = (await supabase
      .from("profils")
      .select("owner_id, owner:owner_id(nom)")
      .eq("id", data.user.id)
      .single()) as unknown as {
        data: { owner_id: string | null; owner: { nom: string } | null } | null;
      };

    if (!profil?.owner_id) {
      // User authenticated but has no tenant — sign out
      await supabase.auth.signOut();
      toast.add({
        title: "Erreur de connexion",
        description:
          "Votre compte n'est associé à aucune organisation. Contactez un administrateur.",
        color: "error",
      });
      await navigateTo("/auth");
      return null;
    }

    // 4. Verify the tenant name matches (if provided)
    if (tenant && profil.owner && profil.owner.nom !== tenant) {
      await supabase.auth.signOut();
      toast.add({
        title: "Erreur de connexion",
        description: `L'espace de travail "${tenant}" est introuvable.`,
        color: "error",
      });
      await navigateTo("/auth");
      return null;
    }

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
