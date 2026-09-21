import { items } from "happy-dom/lib/PropertySymbol.js";
import { defineStore } from "pinia";
import type { Approbateur, Taux } from "~/types";
import type { Matrice } from "~/types/organisation";

export const useParametresStore = defineStore("parametres", () => {
  const owner_id = ref<string | null>(null);
  const ownerStorageKey = "hazipro-owner-id";
  const supabase = useSupabaseClient();
  const itemsMatrice = ref<Matrice[]>([]);
  const itemsTaux = ref<Taux[]>([]);
  const itemsApprobateurs = ref<Approbateur[]>([]);

  const lookupsStore = useLookupsStore();
  const clientsStore = useClientsStore();
  const profilsStore = useProfilsStore();
  const articlesStore = useArticlesStore();
  const facturesStore = useFacturesStore();
  const organisationsStore = useOrganisationsStore();
  const beneficiairesStore = useBeneficiairesStore();

  const lookups = computed(() => lookupsStore.lookups);
  const classes = computed(() => lookupsStore.classes);
  const profils = computed(() => profilsStore.items);
  const clients = computed(() => clientsStore.items);
  const articles = computed(() => articlesStore.items);
  const invoiceHeaders = computed(() => facturesStore.items);
  const organisations = computed(() => organisationsStore.items);

  function setOwnerID(id: string) {
    owner_id.value = id;
    if (import.meta.client) {
      localStorage.setItem(ownerStorageKey, id);
    }
  }

  function clearOwnerID() {
    owner_id.value = null;
    if (import.meta.client) {
      localStorage.removeItem(ownerStorageKey);
    }
  }
  async function restoreOwnerID(userId: string | undefined) {
    if (!userId) {
      clearOwnerID();
      return null;
    }

    if (import.meta.client) {
      const cachedOwnerID = localStorage.getItem(ownerStorageKey);
      if (cachedOwnerID) {
        owner_id.value = cachedOwnerID;
      }
    }

    const { data: profil, error } = await supabase
      .from("profils")
      .select("owner_id")
      .eq("id", userId)
      .maybeSingle() as {
        data: { owner_id: string } | null;
        error: { message: string } | null;
      };

    if (error || !profil?.owner_id) {
      clearOwnerID();
      return null;
    }

    setOwnerID(profil.owner_id);
    return profil.owner_id;
  }
  async function init(userId?: string) {
    await restoreOwnerID(userId ?? useSupabaseUser().value?.id);

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
      owner_id.value ? fetchTaux(owner_id.value) : Promise.resolve(),
      owner_id.value ? fetchMatrices(owner_id.value) : Promise.resolve(),
    ]);

    const errors = results.filter((r) => r.status === "rejected").map((r) =>
      (r as PromiseRejectedResult).reason
    );
    if (errors.length > 0) console.error("[Store] Erreurs init:", errors);

    return { error: errors.length > 0 ? errors : null, loading: false };
  }
  async function fetchTaux(ownerId?: string | null) {
    let query = supabase.from("taux").select(
      "id, from_currency, to_currency, valeur, date_taux",
    );
    if (ownerId) query = query.eq("owner_id", ownerId);
    const { data, error } = await query;
    if (error) throw error;
    if (data) itemsTaux.value = data as unknown as Taux[];
  }
  async function fetchMatrices(ownerId?: string | null) {
    let query = supabase.from("matrices").select(
      "*",
    );
    if (ownerId) query = query.eq("owner_id", ownerId);
    const { data, error } = await query;
    if (error) throw error;
    if (data) itemsMatrice.value = data as unknown as Matrice[];
  }
  async function createMatrice(data: Partial<Matrice>) {
    const { data: created, error } = await supabase.from("matrices")
      .insert({ ...data, owner_id: owner_id.value } as never).select(
        "id, nom, code, description, status, owner_id, type_document_id",
      );
    if (error) throw error;
    if (created) itemsMatrice.value.unshift(created[0] as unknown as Matrice);
    return created[0];
  }
  async function createTaux(data: Partial<Taux>) {
    const today = new Date().toISOString().slice(0, 10);
    if (data.date_taux && data.date_taux > today) {
      throw new Error("La date du taux ne peut pas être dans le futur.");
    }

    const { data: created, error } = await supabase.from("taux")
      .insert({ ...data, owner_id: owner_id.value } as never).select(
        "id, from_currency, to_currency, valeur, date_taux",
      );
    if (error) throw error;
    if (created) itemsTaux.value.unshift(created[0] as unknown as Taux);
    return created[0];
  }

  const getClasseById = computed(() => (id: string) =>
    classes.value.find((c) => c.id === id)?.nom
  );
  const getFirstApprobateurID = computed(
    () => (matrice_id: string, org_id: string) =>
      itemsApprobateurs.value.find((a) =>
        a.matrice_id === matrice_id && a.org_id === org_id
      )?.user_id,
  );
  const getLookupsById = computed(() => (id: string) =>
    lookups.value.find((l) => l.id == id)?.nom
  );
  const getClasseItems = computed(() =>
    classes.value.map((c) => ({ label: c.nom, id: c.id }))
  );
  const getMatriceNF = computed(() =>
    itemsMatrice.value.map((c) => ({ nom: c.nom, id: c.id }))
  );
  const getTaux = computed(() =>
    itemsTaux.value.map((c) => {
      const from = lookups.value.find(
        (lookup) => lookup.id === c.from_currency,
      );
      const to = lookups.value.find(
        (lookup) => lookup.id === c.to_currency,
      );
      return {
        from_currency: from?.code,
        to_currency: to?.code,
        id: c.id,
        valeur: c.valeur,
        date_taux: c.date_taux,
      };
    })
  );

  function getTauxForDevise(
    destinationCurrencyId: string,
    date?: string | null,
  ) {
    if (!destinationCurrencyId) return null;

    const usdLookup = lookups.value.find((lookup) =>
      lookup.code?.toUpperCase() === "USD"
    );
    if (!usdLookup) return null;

    if (usdLookup.id === destinationCurrencyId) {
      return 1;
    }

    const matchingTaux = itemsTaux.value.filter((taux) =>
      taux.from_currency === usdLookup.id &&
      taux.to_currency === destinationCurrencyId
    );

    if (!matchingTaux.length) return null;

    const sortedByDate = [...matchingTaux].sort((a, b) =>
      new Date(b.date_taux).getTime() - new Date(a.date_taux).getTime()
    );

    if (date) {
      const exactDate = sortedByDate.find((taux) => taux.date_taux === date);
      if (exactDate) return exactDate.valeur;

      const latestBeforeDate = sortedByDate.find((taux) =>
        new Date(taux.date_taux).getTime() <= new Date(date).getTime()
      );
      if (latestBeforeDate) return latestBeforeDate.valeur;
    }

    return sortedByDate[0]?.valeur ?? null;
  }

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
    clearOwnerID,
    createMatrice,
    getClasseById,
    getLookupsById,
    getClasseItems,
    getMatriceNF,
    getTaux,
    getTauxForDevise,
    createTaux,
    itemsTaux,
    itemsApprobateurs,
    getFirstApprobateurID,
  };
});
