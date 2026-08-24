import { defineStore } from "pinia";
import type { Organisation } from "~/types";
import type { Matrice } from "~/types/organisation";

export const useOrganisationsStore = defineStore("organisations", () => {
  const supabase = useSupabaseClient();
  const items = ref<Organisation[]>([]);
  const loading = ref(false);

  async function fetchAll(ownerId?: string | null) {
    loading.value = true;
    let query = supabase.from("organisations").select(
      "id, nom, code, description, status, owner_id, organisation_parent_id, type:type_organisation_id(id, code, description, classe:classe_id(id, code, description))",
    );
    if (ownerId) query = query.eq("owner_id", ownerId);
    const { data, error } = await query;
    if (error) throw error;
    if (data) items.value = data as unknown as Organisation[];
    loading.value = false;
    return items.value;
  }

  async function fetchById(id: string) {
    const { data, error } = await supabase.from("organisations").select(
      "id, nom, code, description, status, owner_id, organisation_parent_id, type:type_organisation_id(id, nom, code)",
    ).eq("id", id).single();
    if (error) throw error;
    return data as unknown as Organisation;
  }

  async function fetchChildren(parentId: string) {
    const { data, error } = await supabase.from("organisations").select(
      "id, nom, code, description, status, owner_id, organisation_parent_id",
    ).eq("organisation_parent_id", parentId);
    if (error) throw error;
    return data as unknown as Organisation[];
  }

  async function fetchChildrenEmplacements(parentId: string) {
    const { data, error } = await supabase
      .from("organisations")
      .select(
        "id, nom, code, description, status, owner_id, organisation_parent_id, type:type_organisation_id!inner(id, nom, code, description)",
      )
      .eq("organisation_parent_id", parentId)
      .eq("lookup.description", "Emplacement");
    if (error) throw error;
    return data;
  }

  async function fetchByLookupCode(code: string) {
    const { data } = await supabase.from("organisations").select(
      "id, nom, code, lookup:lookups!inner(id, code)",
    ).eq("lookup.code", code);
    return data;
  }

  async function fetchByLookupName(name: string) {
    const { data } = await supabase.from("organisations").select(
      "id, nom, description, lookups!inner(id, nom)",
    ).eq("lookups.nom", name);
    return data;
  }

  async function create(data: Partial<Organisation>) {
    const { data: created, error } = await supabase.from("organisations")
      .insert(data as never).select(
        "id, nom, code, description, status, owner_id, organisation_parent_id",
      );
    if (error) throw error;
    if (created) items.value.unshift(created[0] as unknown as Organisation);
    return created[0];
  }
  

  async function update(id: string, data: Partial<Organisation>) {
    const { data: updated, error } = await supabase.from("organisations")
      .update(data).eq("id", id).select(
        "id, nom, code, description, status, owner_id, organisation_parent_id",
      );
    if (error) throw error;
    if (updated) {
      const idx = items.value.findIndex((o) => o.id === id);
      if (idx !== -1) items.value[idx] = updated[0] as unknown as Organisation;
    }
    return updated?.[0];
  }

  async function remove(id: string) {
    const { error } = await supabase.from("organisations").delete().eq(
      "id",
      id,
    );
    if (error) throw error;
    items.value = items.value.filter((o) => o.id !== id);
  }

  const getEmplacements = computed(() => (parentId: string) =>
    items.value.filter((o) =>
      o.lookup?.code === "EMP" && o.organisation_parent_id === parentId
    )
  );

  const getMags = computed(() =>
    items.value.filter((o) => o.lookup?.code === "MAG")
  );

  return {
    items,
    loading,
    fetchAll,
    fetchById,
    fetchChildren,
    fetchChildrenEmplacements,
    fetchByLookupCode,
    fetchByLookupName,
    create,
    update,
    remove,
    getEmplacements,
    getMags,
  };
});
