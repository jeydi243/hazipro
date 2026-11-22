import { defineStore } from "pinia";
import type { BudgetLine, Classe, Lookup } from "~/types";

export const useBudgetsStore = defineStore("budgets", () => {
    const budgetHeaders = ref<BudgetHeader[]>([]);
    const budgetLines = ref<BudgetLine[]>([]);
    const budgetCorrespondanceLine = ref<BudgetCorrespondanceLine[]>([]);
    const budgetTransactions = ref<BudgetTransaction[]>([]);
    const owner_id = ref<string | null>(null);
    const classes = ref<Classe[]>([]);
    const loading = ref(false);
    const supabase = useSupabaseClient();

    async function fetchAll(_ownerId?: string | null) {
        loading.value = true;
        owner_id.value = _ownerId || null;
        const [
            budgetHeadersRes,
            budgetLinesRes,
            budgetTransactionsRes,
            budgetCorrespondanceLinesRes,
        ] = await Promise.allSettled([
            supabase.from("budget_headers").select("*").eq(
                "owner_id",
                _ownerId,
            ),
            supabase.from("budget_lines").select("*").eq(
                "owner_id",
                _ownerId,
            ),
            supabase.from("budget_trx").select("*").eq("owner_id", _ownerId),
            supabase.from("budget_correspondances").select("*").eq(
                "owner_id",
                _ownerId,
            ),
        ]);

        if (
            budgetHeadersRes.status === "fulfilled" &&
            budgetHeadersRes.value.data
        ) {
            budgetHeaders.value = budgetHeadersRes.value
                .data as unknown as BudgetHeader[];
        }
        if (
            budgetLinesRes.status === "fulfilled" && budgetLinesRes.value.data
        ) {
            budgetLines.value = budgetLinesRes.value
                .data as unknown as BudgetLine[];
        }
        if (
            budgetTransactionsRes.status === "fulfilled" &&
            budgetTransactionsRes.value.data
        ) {
            budgetTransactions.value = budgetTransactionsRes.value
                .data as unknown as BudgetTransaction[];
        }
        if (
            budgetCorrespondanceLinesRes.status === "fulfilled" &&
            budgetCorrespondanceLinesRes.value.data
        ) {
            budgetCorrespondanceLine.value = budgetCorrespondanceLinesRes.value
                .data as unknown as BudgetCorrespondanceLine[];
        }
        loading.value = false;
    }

    async function addBudgetLine(data: Partial<BudgetLine>) {
        const supabase = useSupabaseClient();
        const { data: created, error } = await supabase.from("budget_lines")
            .insert(
                [data] as never,
            )
            .select("id, nom, code, description, classe_id");
        if (error) throw error;
        if (created) {
            budgetLines.value.push(created[0] as unknown as BudgetLine);
        }
        return created;
    }
    async function addBudgetHeader(data: Partial<BudgetHeader>) {
        const supabase = useSupabaseClient();
        const { data: created, error } = await supabase.from("budget_headers")
            .insert(
                [{ ...data, owner_id: owner_id.value }] as never,
            )
            .select("*");
        if (error) throw error;
        if (created) {
            budgetHeaders.value.push(created[0] as unknown as BudgetHeader);
        }
        return created;
    }
    async function addCodeBudget(data: Partial<BudgetHeader>) {
        const supabase = useSupabaseClient();
        const { data: created, error } = await supabase.from(
            "budget_correspondances",
        )
            .insert(
                [{ ...data, owner_id: owner_id.value }] as never,
            )
            .select("*");
        if (error) throw error;
        if (created) {
            budgetCorrespondanceLine.value.push(
                created[0] as unknown as BudgetCorrespondanceLine,
            );
        }
        return created;
    }

    async function updateBudgetLine(id: string, data: Partial<BudgetLine>) {
        const supabase = useSupabaseClient();
        const { data: updated, error } = await supabase.from("budget_lines")
            .update(
                data as never,
            )
            .eq("id", id).select("id, nom, code, description, classe_id");
        if (error) throw error;
        if (updated) {
            const idx = budgetLines.value.findIndex((l) => l.id === id);
            if (idx !== -1) {
                budgetLines.value[idx] = updated[0] as unknown as BudgetLine;
            }
        }
        return updated;
    }

    async function removeBudgetLine(id: string) {
        const supabase = useSupabaseClient();
        const { error } = await supabase.from("budget_lines").delete().eq(
            "id",
            id,
        );
        if (error) throw error;
        budgetLines.value = budgetLines.value.filter((l) => l.id !== id);
    }
    const getGroupeTaxation = computed(() =>
        lookups.value.filter((l) => l.classe?.table_name === "groupe_taxation")
    );
    const getLignesBudgetaire = computed(() =>
    (
        entite_id: string | null,
        annee?: number,
    ) => budgetLines.value.filter((line) => line.entite_id === entite_id).map(
        (line) => {
            const budgetCorrespondant = budgetCorrespondanceLine.value.find((
                l,
            ) => l.id === line.budget_code_id);
            return {
                ...line,
                ...budgetCorrespondant,
            };
        },
    ));

    return {
        budgetHeaders,
        loading,
        budgetCorrespondanceLine,
        fetchAll,
        addBudgetLine,
        addCodeBudget,
        addBudgetHeader,
        updateBudgetLine,
        removeBudgetLine,
        getGroupeTaxation,
        getLignesBudgetaire,
    };
});
