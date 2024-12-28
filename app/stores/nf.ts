import type { SupabaseClient, User } from "@supabase/supabase-js";

interface storeNF {
  user: User;
  description: string;
  baseUrl: string;
  users: User[];
  supabase: SupabaseClient | null | any;
}

export const useNF = defineStore("nf", {
  state: (): storeNF => ({
    user: null,
    nf_headers: [],
    baseUrl: "http://127.0.0.1:4000/v1",
    description: "",
    supabase: null,
  }),
  actions: {
    async init() {
      this.supabase = useSupabaseClient();
    },
    async addNF(payload: any) {
      this.nf_headers.push(payload);
    },
  },
});
