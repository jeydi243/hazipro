import { defineStore } from "pinia";
import type { BudgetLine, Classe, Lookup } from "~/types";

export const useBudgetsStore = defineStore("budgets", () => {
    const budgetHeaders = ref<BudgetHeader[]>([]);
    const budgetLines = ref<BudgetLine[]>([]);
    const budgetCorrespondanceLine = ref<BudgetCorrespondanceLine[]>([]);
    const budgetTransactions = ref<BudgetTransaction[]>([]);
    const owner_id = ref<string | null>(null);
    const loading = ref(false);
    const supabase = useSupabaseClient();

    const lookupsStore = useLookupsStore();
    const organisationsStore = useOrganisationsStore();
    const lookups = computed(() => lookupsStore.lookups);
    const organisations = computed(() => organisationsStore.items);

    async function fetchAll(_ownerId?: string | null) {
        loading.value = true;
        owner_id.value = _ownerId || null;
        const ownerId = _ownerId ?? "";
        const [
            budgetHeadersRes,
            budgetLinesRes,
            budgetTransactionsRes,
            budgetCorrespondanceLinesRes,
        ] = await Promise.allSettled([
            supabase.from("budget_headers").select("*").eq(
                "owner_id",
                ownerId,
            ),
            supabase.from("budget_lines").select("*").eq(
                "owner_id",
                ownerId,
            ),
            supabase.from("budget_trx").select("*").eq("owner_id", ownerId),
            supabase.from("budget_correspondances").select("*").eq(
                "owner_id",
                ownerId,
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
                [{ ...data, owner_id: owner_id.value }] as never,
            )
            .select("*");
        if (error) throw error;
        if (created) {
            budgetLines.value.push(created[0] as unknown as BudgetLine);
        }
        return created;
    }
    async function addBudgetTransaction(data: Partial<BudgetTransaction>) {
        const supabase = useSupabaseClient();
        const { data: created, error } = await supabase.from("budget_trx")
            .insert(
                [{ ...data, owner_id: owner_id.value }] as never,
            )
            .select("*");
        if (error) throw error;
        if (created) {
            budgetTransactions.value.push(
                created[0] as unknown as BudgetTransaction,
            );
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

    const getMontantAnnuel = computed(() => (ligne_budget_id: string) =>
        budgetTransactions.value
            .filter((t) => t.ligne_budget_id === ligne_budget_id)
            .reduce((sum, t) => sum + t.montant_annuel, 0)
    );

    const getLignesBudgetaire = computed(() =>
    (
        entite_id: string | null,
        annee?: number,
    ) => budgetLines.value.filter((line) => line.entite_id === entite_id).map(
        (line) => {
            const budget_code_id = budgetCorrespondanceLine.value.find((
                l,
            ) => l.id === line.budget_code_id);
            return {
                ...line,
                budget_code_id,
            };
        },
    ));
    const getAllLignesBudgetaire = computed(() =>
        budgetLines.value.map(
            (line) => {
                const budget_code_id = budgetCorrespondanceLine.value.find(
                    (l) => l.id === line.budget_code_id,
                );
                const entite_id = organisations.value.find((o) =>
                    o.id === line.entite_id
                );
                return {
                    ...line,
                    budget_code_id,
                    entite_id,
                };
            },
        )
    );
    const getBudgetHeaders = computed(() =>
        budgetHeaders.value.map(
            (header) => {
                const lookupTypeBudget = lookups.value
                    .find((l) => l.id === header.type_budget_id);
                const lookupScenario = lookups.value
                    .find((l) => l.id === header.scenario);
                return {
                    ...header,
                    type_budget_id: lookupTypeBudget,
                    scenario: lookupScenario,
                };
            },
        )
    );

    return {
        budgetHeaders,
        budgetTransactions,
        loading,
        budgetCorrespondanceLine,
        fetchAll,
        getAllLignesBudgetaire,
        addBudgetLine,
        addCodeBudget,
        getMontantAnnuel,
        addBudgetHeader,
        updateBudgetLine,
        addBudgetTransaction,
        removeBudgetLine,
        getBudgetHeaders,
        getLignesBudgetaire,
    };
});
