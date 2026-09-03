import { defineStore } from "pinia";
import type { Matrice } from "~/types/organisation";

export const useParametresStore = defineStore("parametres", () => {
  const owner_id = ref<string | null>(null);
  const supabase = useSupabaseClient();
  const itemsMatrice = ref<Matrice[]>([]);

  const lookupsStore = useLookupsStore();
  const clientsStore = useClientsStore();
  const profilsStore = useProfilsStore();
  const articlesStore = useArticlesStore();
  const facturesStore = useFacturesStore();
  const organisationsStore = useOrganisationsStore();
  const beneficiairesStore = useBeneficiairesStore();

  function setOwnerID(id: string) {
    owner_id.value = id;
  }

  async function init() {
    const results = await Promise.allSettled([
      lookupsStore.fetchAll(),
      owner_id.value
        ? organisationsStore.fetchAll(owner_id.value)
        : Promise.resolve(),
      owner_id.value
        ? articlesStore.fetchAll(owner_id.value)
        : Promise.resolve(),
      owner_id.value
        ? clientsStore.fetchAll(owner_id.value)
        : Promise.resolve(),
      owner_id.value
        ? facturesStore.fetchAll(owner_id.value)
        : Promise.resolve(),
      owner_id.value
        ? profilsStore.fetchAll(owner_id.value)
        : Promise.resolve(),
      owner_id.value
        ? beneficiairesStore.fetchAll(owner_id.value)
        : Promise.resolve(),
    ]);

    const errors = results.filter((r) => r.status === "rejected").map((r) =>
      (r as PromiseRejectedResult).reason
    );
    if (errors.length > 0) console.error("[Store] Erreurs init:", errors);

    return { error: errors.length > 0 ? errors : null, loading: false };
  }

  const lookups = computed(() => lookupsStore.lookups);
  const classes = computed(() => lookupsStore.classes);
  const profils = computed(() => profilsStore.items);
  const clients = computed(() => clientsStore.items);
  const articles = computed(() => articlesStore.items);
  const invoiceHeaders = computed(() => facturesStore.items);
  const organisations = computed(() => organisationsStore.items);

  async function createMatrice(data: Partial<Matrice>) {
    const { data: created, error } = await supabase.from("matrices")
      .insert(data as never).select(
        "id, nom, code, description, status, owner_id, type_document_id"
      );
    if (error) throw error;
    if (created) itemsMatrice.value.unshift(created[0] as unknown as Matrice);
    return created[0];
  }
  const getClasseById = computed(() => (id: string) =>
    classes.value.find((c) => c.id === id)?.nom
  );
  const getLookupsById = computed(() => (id: string) =>
    lookups.value.find((l) => l.id == id)?.nom
  );

  const getClasseItems = computed(() =>
    classes.value.map((c) => ({ label: c.nom, id: c.id }))
  );
  const getMatriceNF = computed(() =>
    itemsMatrice.value.map((c) => ({ label: c.nom, id: c.id }))
  );

  return {
    owner_id,
    lookups,
    classes,
    organisations,
    articles,
    clients,
    invoiceHeaders,
    profils,
    init,
    setOwnerID,
    createMatrice,
    getClasseById,
    getLookupsById,
    getClasseItems,
    getMatriceNF
  };
});
