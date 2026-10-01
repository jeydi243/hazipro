import { defineStore } from "pinia";
import type { Adresse, Beneficiaire, CompteBancaire } from "~/types";

export const useBeneficiairesStore = defineStore("beneficiaires", () => {
    const supabase = useSupabaseClient();
    const items = ref<Beneficiaire[]>([]);
    const itemsComptesBancaires = ref<CompteBancaire[]>([]);
    const itemsAdresses = ref<Adresse[]>([]);
    const loading = ref(false);

    // async function fetchAll(_ownerId?: string | null) {
    //     loading.value = true;
    //     const { data, error } = await supabase.from("beneficiaires").select(
    //         "id, code, nom, postnom, prenom, genre, owner:owner_id(id, nom), matrice:matrice_id(id, nom), approbateur_id(nom, postnom, email), owner_id",
    //     );
    //     if (error) throw error;
    //     if (data) items.value = data as unknown as Beneficiaire[];
    //     loading.value = false;
    //     return items.value;
    // }
    async function fetchAll(ownerId?: string | null) {
        loading.value = true;
    //     if (ownerId) query = query.eq("owner_id", ownerId);
    // const { data, error } = await query;
        const [benefRes, classesRes, adressesRes] = await Promise.allSettled([
            supabase.from("beneficiaires").select(
                "id, code, nom, postnom, prenom, genre, owner:owner_id(id, nom), matrice:matrice_id(id, nom), approbateur_id(nom, postnom, email), owner_id",
            ).eq("owner_id", ownerId),
            supabase.from("comptes_bancaires").select(
                "numero_compte, intitule_compte, banque_id(id, nom), type_compte_id(id, nom), beneficiaire_id(id, nom, postnom, prenom), id",
            ).eq("owner_id", ownerId),
            supabase.from("adresses").select(
                "adresse,ville,pays, beneficiaire_id(id, nom, postnom, prenom), id",
            ).eq("owner_id", ownerId),
        ]);

        if (benefRes.status === "fulfilled" && benefRes.value.data) {
            items.value = benefRes.value
                .data as unknown as Beneficiaire[];
        }
        if (classesRes.status === "fulfilled" && classesRes.value.data) {
            itemsComptesBancaires.value = classesRes.value
                .data as unknown as CompteBancaire[];
        }
        if (adressesRes.status === "fulfilled" && adressesRes.value.data) {
            itemsAdresses.value = adressesRes.value
                .data as unknown as Adresse[];
        }
        loading.value = false;
    }

    async function create(data: Partial<Beneficiaire>) {
        const ownerId = useParametresStore().owner_id;

        if (!ownerId) {
            throw new Error("ownerId introuvable");
        }

        const { data: created, error } = await supabase
            .from("beneficiaires")
            .insert({
                ...data,
                owner_id: ownerId,
            } as never)
            .select()
            .single();

        if (error) throw error;

        items.value.unshift(created as Beneficiaire);
        return created;
    }
    async function createCompteBancaire(data: Partial<CompteBancaire>) {
        const ownerId = useParametresStore().owner_id;

        if (!ownerId) {
            throw new Error("ownerId introuvable");
        }

        const { data: created, error } = await supabase
            .from("comptes_bancaires")
            .insert({
                ...data,
                owner_id: ownerId,
            } as never)
            .select()
            .single();

        if (error) throw error;

        items.value.unshift(created as Beneficiaire);
        return created;
    }
    async function createAdresse(data: Partial<Adresse>) {
        const ownerId = useParametresStore().owner_id;

        if (!ownerId) {
            throw new Error("ownerId introuvable");
        }

        const { data: created, error } = await supabase
            .from("adresses")
            .insert({
                ...data,
                owner_id: ownerId,
            } as never)
            .select()
            .single();

        if (error) throw error;

        items.value.unshift(created as Beneficiaire);
        return created;
    }

    async function update(id: string, data: Partial<Beneficiaire>) {
        const { data: updated, error } = await supabase
            .from("beneficiaires")
            .update(data as never)
            .eq("id", id)
            .select(
                "id, code, nom, postnom, prenom, genre, categorie_id, owner:owner_id(id, nom), matrice:matrice_id(id, nom), approbateur_id(id, nom, postnom, email), owner_id",
            )
            .single();
        if (error) throw error;

        const beneficiary = updated as unknown as Beneficiaire;
        const index = items.value.findIndex((item) => item.id === id);
        if (index !== -1) items.value[index] = beneficiary;
        return beneficiary;
    }

    async function remove(id: string) {
        const supabase = useSupabaseClient();
        const { error } = await supabase.from("beneficiaires").delete().eq(
            "id",
            id,
        );
        if (error) throw error;
        items.value = items.value.filter((f) => f.id !== id);
    }

    async function fetchLines(headerId: string) {
        const supabase = useSupabaseClient();
        const { data, error } = await supabase
            .from("nf_lines")
            .select(
                "id, nf_header_id, article_id, article:article_id(id, nom, code)",
            )
            .eq("nf_header_id", headerId);
        if (error) throw error;
        return data;
    }

    async function removeLine(id: string) {
        const supabase = useSupabaseClient();
        const { error } = await supabase.from("nf_lines").delete().eq(
            "id",
            id,
        );
        if (error) throw error;
    }

    function subscribeToRealtime(onChange: () => void): () => void {
        const supabase = useSupabaseClient();
        const channel = supabase
            .channel("beneficiaires_realtime")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "beneficiaires",
            }, onChange)
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }
    const getBeneficiaires = computed(() => items);

    const getComptesBancaires = computed(
        () => (beneficiaire_id: string | null) =>
            itemsComptesBancaires.value.filter((c) =>
                c.beneficiaire_id === beneficiaire_id
            ),
    );
    const getAdresses = computed(() => (beneficiaire_id: string | null) =>
        itemsAdresses.value.filter((a) => a.beneficiaire_id === beneficiaire_id)
    );

    return {
        items,
        loading,
        fetchAll,
        create,
        update,
        remove,
        fetchLines,
        createCompteBancaire,
        getAdresses,
        getComptesBancaires,
        createAdresse,
        removeLine,
        subscribeToRealtime,
        getBeneficiaires,
    };
});
