import { defineStore } from "pinia";
import type { Classe, Lookup } from "~/types";

export const useLookupsStore = defineStore("lookups", () => {
  const lookups = ref<Lookup[]>([]);
  const classes = ref<Classe[]>([]);
  const loading = ref(false);

  async function fetchAll() {
    const supabase = useSupabaseClient();
    loading.value = true;
    const [lookupsRes, classesRes] = await Promise.allSettled([
      supabase.from("lookups").select(
        "id, nom, code, description, classe_id, classe:classe_id(id, code, nom, description, table_name)",
      ),
      supabase.from("classes").select("id, nom, code, description, table_name"),
    ]);

    if (lookupsRes.status === "fulfilled" && lookupsRes.value.data) {
      lookups.value = lookupsRes.value.data as unknown as Lookup[];
    }
    if (classesRes.status === "fulfilled" && classesRes.value.data) {
      classes.value = classesRes.value.data as unknown as Classe[];
    }
    loading.value = false;
  }

  async function fetchLookupsByClass(classId: string) {
    const supabase = useSupabaseClient();
    const { data, error } = await supabase
      .from("lookups")
      .select(
        "id, nom, code, description, classe_id, classe:classe_id(id, code, nom, description, table_name)",
      )
      .eq("classe_id", classId);
    if (error) throw error;
    return data as unknown as Lookup[];
  }

  async function createLookup(data: Partial<Lookup>) {
    const supabase = useSupabaseClient();
    const { data: created, error } = await supabase.from("lookups").insert(
      [data] as never,
    )
      .select("id, nom, code, description, classe_id");
    if (error) throw error;
    if (created) lookups.value.push(created[0] as unknown as Lookup);
    return created;
  }

  async function updateLookup(id: string, data: Partial<Lookup>) {
    const supabase = useSupabaseClient();
    const { data: updated, error } = await supabase.from("lookups").update(
      data as never,
    )
      .eq("id", id).select("id, nom, code, description, classe_id");
    if (error) throw error;
    if (updated) {
      const idx = lookups.value.findIndex((l) => l.id === id);
      if (idx !== -1) lookups.value[idx] = updated[0] as unknown as Lookup;
    }
    return updated;
  }

  async function removeLookup(id: string) {
    const supabase = useSupabaseClient();
    const { error } = await supabase.from("lookups").delete().eq("id", id);
    if (error) throw error;
    lookups.value = lookups.value.filter((l) => l.id !== id);
  }

  async function createClasse(data: Partial<Classe>) {
    const supabase = useSupabaseClient();
    const { data: created, error } = await supabase.from("classes").insert(
      [data] as never,
    )
      .select("id, nom, code, description, table_name");
    if (error) throw error;
    if (created) classes.value.push(created[0] as unknown as Classe);
    return created;
  }

  async function updateClasse(id: string, data: Partial<Classe>) {
    const supabase = useSupabaseClient();
    const { data: updated, error } = await supabase.from("classes").update(
      data as never,
    )
      .eq("id", id).select("id, nom, code, description, table_name");
    if (error) throw error;
    if (updated) {
      const idx = classes.value.findIndex((c) => c.id === id);
      if (idx !== -1) classes.value[idx] = updated[0] as unknown as Classe;
    }
    return updated;
  }

  const getTypeBudget = computed(() =>
    lookups.value.filter((l) => l.classe?.table_name === "type_budget")
  );
  const getTypeDocumentMatrice = computed(() =>
    lookups.value.filter((l) =>
      l.classe?.table_name === "type_document_matrice"
    )
  );
  const getTypeAvoirs = computed(() =>
    lookups.value.filter((l) => l.classe?.table_name === "type_avoirs")
  );
  const getModePaiement = computed(() =>
    lookups.value.filter((l) => l.classe?.table_name === "mode_paiements")
  );
  const getConditionPaiement = computed(() =>
    lookups.value.filter((l) => l.classe?.table_name === "conditions_paiements")
  );
  const getDevise = computed(() =>
    lookups.value.filter((l) => l.classe?.table_name === "devises")
  );
  const getTypeClient = computed(() =>
    lookups.value.filter((l) => l.classe?.table_name === "type_clients")
  );
  const getTypeArticles = computed(() =>
    lookups.value.filter((l) => l.classe?.table_name === "type_articles")
  );
  const getTypeOrganisations = computed(() =>
    lookups.value.filter((l) => l.classe?.table_name === "type_organisations")
  );

  const getGroupeTaxation = computed(() =>
    lookups.value.filter((l) => l.classe?.table_name === "groupe_taxation")
  );

  return {
    lookups,
    classes,
    loading,
    fetchAll,
    fetchLookupsByClass,
    createLookup,
    updateLookup,
    removeLookup,
    createClasse,
    updateClasse,
    getTypeBudget,
    getTypeAvoirs,
    getModePaiement,
    getConditionPaiement,
    getTypeDocumentMatrice,
    getDevise,
    getTypeClient,
    getTypeArticles,
    getTypeOrganisations,
    getGroupeTaxation,
  };
});
