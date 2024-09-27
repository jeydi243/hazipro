import type { User } from "@supabase/supabase-js";

interface storeAuth {
  user: User;
  description: string;
  baseUrl: string;
  users: User[];
}

export const useOrg = defineStore("org", {
  state: (): storeAuth => ({
    user: null,
    users: [],
    baseUrl: "http://127.0.0.1:4000/v1",
    description: "",
  }),
  actions: {
    async assign_to_org(payload: any) {
      const { data, error } = await supabase
        .from("users_access_rights")
        .insert(payload);
      console.log({ data, error });
      return { data, error };
    },
  },
});
