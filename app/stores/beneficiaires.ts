import { defineStore } from "pinia";
import type { Beneficiaire } from "~/types";

export const useBeneficiairesStore = defineStore("beneficiaires", () => {
    const items = ref<Beneficiaire[]>([]);
    const loading = ref(false);

    async function fetchAll(_ownerId?: string | null) {
        const supabase = useSupabaseClient();
        loading.value = true;
        const { data, error } = await supabase.from("beneficiaires").select(
            "id, code, nom, postnom, prenom, genre, owner:owner_id(id, nom), matrice:matrice_id(id, nom), approbateur, owner_id",
        );
        if (error) throw error;
        if (data) items.value = data as unknown as Beneficiaire[];
        loading.value = false;
        return items.value;
    }

    async function create(data: Partial<Beneficiaire>) {
        const supabase = useSupabaseClient();
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

    return {
        items,
        loading,
        fetchAll,
        create,
        remove,
        fetchLines,
        removeLine,
        subscribeToRealtime,
    };
});
