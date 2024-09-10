import type { User } from "@supabase/supabase-js";

interface storeAuth {
  user: User;
  description: string;
  users: User[];
}

export const useAuth = defineStore("auth", {
  state: (): storeAuth => ({
    user: null,
    users: [],
    description: "",
  }),
  actions: {
    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      this.user = data.user;
      console.log({ data, error });
    },
    async getAssignedOrg() {
      const { data, error } = await supabase.from("assignments").select(`
            name,
            organisations (
                code,
                nom
            )
        `);
    },

    async getAllUsers() {
      const {
        data: { users },
        error,
      } = await supabaseAdmin.auth.admin.listUsers();
      if (!error) {
        this.users = users;
        console.log("La fonction est appelé correctement %o ", users);
      } else {
        console.log("La fonction ne marche pas %o ", error);
      }
    },
  },
});
