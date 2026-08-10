import { defineStore } from "pinia";
import type { Facture } from "~/types";

export const useNFStore = defineStore("nf", () => {
    const items = ref<Facture[]>([]);
    const loading = ref(false);

    async function fetchAll(_ownerId?: string | null) {
        const supabase = useSupabaseClient();
        loading.value = true;
        const { data, error } = await supabase.from("nf").select(
            "*, client:owner_id(*)",
        );
        if (error) throw error;
        if (data) items.value = data as unknown as Facture[];
        loading.value = false;
        return items.value;
    }

    async function create(data: Partial<Facture>) {
        const supabase = useSupabaseClient();
        const { data: created, error } = await supabase.from("nf").insert(
            data,
        ).select();
        if (error) throw error;
        if (created) items.value.unshift(created[0] as unknown as Facture);
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
            .select("*, article:article_id(*)")
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

    function subscribeToRealtime(onChange: () => void) {
        const supabase = useSupabaseClient();
        let channel: ReturnType<typeof supabase.channel> | null = null;
        onMounted(() => {
            channel = supabase
                .channel("factures_realtime")
                .on("postgres_changes", {
                    event: "*",
                    schema: "public",
                    table: "factures",
                }, onChange)
                .subscribe();
        });
        onUnmounted(() => {
            if (channel) supabase.removeChannel(channel as any);
        });
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
