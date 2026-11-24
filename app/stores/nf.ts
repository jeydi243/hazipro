import { defineStore } from "pinia";
import type { NF } from "~/types";
import type { LigneNF } from "~/types/organisation";

export const useNFStore = defineStore("nf", () => {
    const items = ref<NF[]>([]);
    const itemsLignes = ref<LigneNF[]>([]);
    const owner_id = ref<string | null>(null);
    const loading = ref(false);
    const supabase = useSupabaseClient();
    const benefStore = useBeneficiairesStore();
    const paramStore = useParametresStore();
    const lookupsStore = useLookupsStore();

    async function fetchAll(_ownerId?: string | null) {
        loading.value = true;
        owner_id.value = _ownerId || null;
        const tasks = [
            {
                name: "nf",
                promise: _ownerId ? fetchNF(_ownerId) : Promise.resolve(),
            },
            {
                name: "nf_lines",
                promise: _ownerId ? fetchNFLines(_ownerId) : Promise.resolve(),
            },
        ];
        const results = await Promise.allSettled(
            tasks.map((task) => task.promise),
        );

        const errors = results.flatMap((result, index) =>
            result.status === "rejected"
                ? [{ name: tasks[index]?.name, reason: result.reason }]
                : []
        );
        if (errors.length > 0) {
            console.error("[NF STORE] Erreurs init:", errors);
        }

        return { error: errors.length > 0 ? errors : null, loading: false };

        // const { data, error } = await supabase.from("nf").select("*");
        // if (error) throw error;
        // if (data) items.value = data as unknown as NF[];
        // loading.value = false;
        // return items.value;
    }
    async function fetchNFLines(ownerId?: string | null) {
        let query = supabase.from("nf_lines").select(
            "*",
        );
        if (ownerId) query = query.eq("owner_id", ownerId);
        const { data, error } = await query;
        if (error) throw error;
        if (data) itemsLignes.value = data as unknown as LigneNF[];
    }
    async function fetchNF(ownerId?: string | null) {
        let query = supabase.from("nf").select(
            "*",
        );
        if (ownerId) query = query.eq("owner_id", ownerId);
        const { data, error } = await query;
        if (error) throw error;
        if (data) items.value = data as unknown as NF[];
    }
    async function create(data: Partial<NF>) {
        const { data: created, error } = await supabase.from("nf").insert(
            { ...data, owner_id: owner_id.value } as never,
        ).select("*");
        if (error) throw error;
        if (created) items.value.unshift(created[0] as unknown as NF);
        return created[0];
    }
    async function submitForApproval(nfId: string) {
        const { data: updated, error } = await supabase.from("nf").update(
            { status: "En cours" } as never,
        ).eq("id", nfId).select("*");
        if (error) throw error;
        if (updated) {
            const index = items.value.findIndex((nf) => nf.id === nfId);
            if (index !== -1) {
                items.value[index] = updated[0] as unknown as NF;
            }
        }
    }
    async function createLigne(data: Partial<LigneNF>) {
        const { data: created, error } = await supabase.from("nf_lines").insert(
            { ...data, owner_id: owner_id.value } as never,
        ).select("*");
        if (error) throw error;
        if (created) {
            itemsLignes.value.unshift(created[0] as unknown as LigneNF);
        }
        return created[0];
    }
    async function remove(id: string) {
        const supabase = useSupabaseClient();
        const { error } = await supabase.from("nf").delete().eq("id", id);
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
            .channel("factures_realtime")
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "factures",
            }, onChange)
            .subscribe();
        return () => {
            supabase.removeChannel(channel);
        };
    }
    const getNF = computed(() => {
        return items.value.filter((l) => {
            const benef = benefStore.getBeneficiaires.value.find((b) =>
                b.id === l.beneficiaire_id
            );
            return { ...l, beneficiaire: benef };
        });
    });
    const getLignesNF = computed(() => (nf_id: string) => {
        return itemsLignes.value.filter((l) => l.nf_id === nf_id).map((l) => {
            const frais = paramStore.getFrais.find((a) => a.id === l.frais_id);
            const devise = lookupsStore.getDevise.find((d) =>
                d.id === l.devise_id
            );
            return { ...l, frais_id: frais?.nom, devise_id: devise?.nom };
        });
    });

    return {
        items,
        loading,
        fetchAll,
        create,
        remove,
        fetchLines,
        submitForApproval,
        removeLine,
        getNF,
        getLignesNF,
        createLigne,
        subscribeToRealtime,
    };
});
