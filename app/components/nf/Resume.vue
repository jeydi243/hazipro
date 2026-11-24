<script setup lang="ts">
    import type {
        BudgetCorrespondanceLine,
        BudgetTransaction,
        Beneficiaire,
        Lookup,
        NF,
        Organisation
    } from '~/types'

    const props = defineProps<{
        currentNf: Partial<NF> | null
    }>()

    const nfStore = useNFStore()
    const budgetsStore = useBudgetsStore()
    const lookupsStore = useLookupsStore()
    const beneficiairesStore = useBeneficiairesStore()
    const organisationsStore = useOrganisationsStore()

    const nfId = computed(() => props.currentNf?.id ?? '')
    const lines = computed(() => nfId.value ? nfStore.getLignesNF(nfId.value) : [])

    function relationId(value: string | { id: string } | null | undefined) {
        return typeof value === 'string' ? value : value?.id
    }

    function relationName(
        value: string | Lookup | Organisation | Beneficiaire | null | undefined
    ) {
        if (typeof value === 'string') {
            return lookupsStore.lookups.find((lookup) => lookup.id === value)?.nom
                ?? organisationsStore.items.find((organisation) => organisation.id === value)?.nom
                ?? beneficiairesStore.items.find((beneficiaire) => beneficiaire.id === value)?.nom
        }

        return value?.nom
    }

    const beneficiary = computed(() => {
        const value = props.currentNf?.beneficiaire_id
        if (typeof value !== 'string') return value
        return beneficiairesStore.items.find((item) => item.id === value)
    })

    const beneficiaryName = computed(() => {
        const value = beneficiary.value
        return [value?.nom, value?.postnom, value?.prenom].filter(Boolean).join(' ') || 'Non renseigné'
    })

    const organizationName = computed(() => {
        const value = props.currentNf?.organisation_id
        if (typeof value !== 'string') return value?.nom ?? 'Non renseignée'
        return organisationsStore.items.find((item) => item.id === value)?.nom ?? 'Non renseignée'
    })

    const currencyName = computed(() => relationName(props.currentNf?.devise_id) ?? 'Devise non précisée')

    const linesTotal = computed(() => lines.value.reduce(
        (sum, line) => sum + (Number(line.montant_total) || 0),
        0
    ))

    const totalAmount = computed(() => linesTotal.value || Number(props.currentNf?.montant_total) || 0)

    const budgetTransactions = computed(() => {
        const lineIds = new Set(lines.value.map((line) => line.id))
        return budgetsStore.budgetTransactions.filter((transaction) => {
            const lineId = relationId(transaction.nf_line_id)
            return lineId !== undefined && lineIds.has(lineId)
        })
    })

    const totalRequested = computed(() => budgetTransactions.value.reduce(
        (sum, transaction) => sum + (Number(transaction.montant_demande) || 0),
        0
    ))

    const totalAnnual = computed(() => budgetTransactions.value.reduce(
        (sum, transaction) => sum + (Number(transaction.montant_annuel) || 0),
        0
    ))

    function formatAmount(amount: number | string | null | undefined, currency = currencyName.value) {
        const numericAmount = Number(amount)
        const formatted = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 })
            .format(Number.isFinite(numericAmount) ? numericAmount : 0)
        return currency ? `${formatted} ${currency}` : formatted
    }

    function formatDate(value: string | Date | undefined) {
        if (!value) return 'Non renseignée'
        const date = value instanceof Date ? value : new Date(`${value.slice(0, 10)}T00:00:00`)
        return Number.isNaN(date.getTime())
            ? 'Non renseignée'
            : new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(date)
    }

    function statusColor(status: string | undefined): 'success' | 'warning' | 'error' | 'neutral' {
        const normalizedStatus = status?.toLowerCase()
        if (normalizedStatus?.includes('valid') || normalizedStatus?.includes('pay')) return 'success'
        if (normalizedStatus?.includes('refus') || normalizedStatus?.includes('annul')) return 'error'
        if (normalizedStatus?.includes('attente') || normalizedStatus?.includes('soumis')) return 'warning'
        return 'neutral'
    }

    function budgetLineFor(transaction: BudgetTransaction) {
        const budgetLineId = relationId(transaction.ligne_budget_id)
        return budgetsStore.getAllLignesBudgetaire.find((line) => line.id === budgetLineId)
    }

    function budgetCodeFor(transaction: BudgetTransaction): BudgetCorrespondanceLine | undefined {
        const budgetCode = budgetLineFor(transaction)?.budget_code_id
        return typeof budgetCode === 'object' && budgetCode !== null ? budgetCode : undefined
    }

    function budgetLineLabel(transaction: BudgetTransaction) {
        return budgetCodeFor(transaction)?.code || 'Ligne budgétaire'
    }

    function budgetCodeDescription(transaction: BudgetTransaction) {
        return budgetCodeFor(transaction)?.description ?? ''
    }

    function transactionLineFor(transaction: BudgetTransaction) {
        const lineId = relationId(transaction.nf_line_id)
        return lines.value.find((line) => line.id === lineId)
    }

    function budgetOrganizationName(transaction: BudgetTransaction) {
        const entity = budgetLineFor(transaction)?.entite_id
        if (typeof entity !== 'string') return entity?.nom
        return organisationsStore.items.find((organisation) => organisation.id === entity)?.nom
    }

    const documentStatuses = computed(() => [
        { label: 'Document', value: props.currentNf?.statut_document },
        { label: 'Approbation', value: props.currentNf?.statut_approbation },
        { label: 'Paiement', value: props.currentNf?.statut_paiement },
    ].filter((status) => status.value))
</script>

<template>
    <section v-if="props.currentNf" class="space-y-3">
        <header class="rounded-xl border border-default bg-elevated p-3 sm:p-3">
            <div class="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div class="min-w-0">
                    <p class="text-sm font-medium text-muted">Résumé de la note de frais</p>
                    <h2 class="mt-1 break-words text-2xl font-semibold tracking-tight text-highlighted">
                        {{ props.currentNf.numero_document || 'Brouillon de note' }}
                    </h2>
                    <p class="mt-2 max-w-2xl text-base leading-6 text-muted">
                        {{ props.currentNf.description || 'Aucune description renseignée.' }}
                    </p>
                </div>

                <div class="shrink-0 rounded-lg border border-default bg-default px-4 py-3 sm:min-w-52 sm:text-right">
                    <p class="text-sm text-muted">Total des frais</p>
                    <p class="mt-1 text-2xl font-semibold tabular-nums text-highlighted">
                        {{ formatAmount(totalAmount) }}
                    </p>
                </div>
            </div>

            <div v-if="documentStatuses.length" class="mt-3 flex flex-wrap gap-2 border-t border-default pt-3">
                <UBadge v-for="status in documentStatuses" :key="status.label"
                    :label="`${status.label} : ${status.value}`" :color="statusColor(status.value)" variant="subtle"
                    class="capitalize" />
            </div>
        </header>

        <section class="rounded-xl border border-default bg-elevated p-3 sm:p-3" aria-labelledby="nf-details-title">
            <div class="flex items-center gap-2">
                <UIcon name="i-lucide-file-text" class="size-5 text-primary" aria-hidden="true" />
                <h3 id="nf-details-title" class="text-lg font-semibold text-highlighted">Entête de la note</h3>
            </div>

            <dl class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                    <dt class="text-sm text-muted">Bénéficiaire</dt>
                    <dd class="mt-1 font-medium text-highlighted">{{ beneficiaryName }}</dd>
                </div>
                <div>
                    <dt class="text-sm text-muted">Entité</dt>
                    <dd class="mt-1 font-medium text-highlighted">{{ organizationName }}</dd>
                </div>
                <div>
                    <dt class="text-sm text-muted">Date du document</dt>
                    <dd class="mt-1 font-medium text-highlighted">{{ formatDate(props.currentNf.date_document) }}</dd>
                </div>
                <div>
                    <dt class="text-sm text-muted">Nature</dt>
                    <dd class="mt-1 font-medium text-highlighted">
                        {{ relationName(props.currentNf.nature_id) || 'Non renseignée' }}
                    </dd>
                </div>
                <div>
                    <dt class="text-sm text-muted">Type de budget</dt>
                    <dd class="mt-1 font-medium text-highlighted">
                        {{ relationName(props.currentNf.type_budget_id) || 'Non renseigné' }}
                    </dd>
                </div>
                <div>
                    <dt class="text-sm text-muted">Type de note</dt>
                    <dd class="mt-1 font-medium text-highlighted">
                        {{ props.currentNf.type_nf || 'Non renseigné' }}
                    </dd>
                </div>
                <div>
                    <dt class="text-sm text-muted">Devise</dt>
                    <dd class="mt-1 font-medium text-highlighted">{{ currencyName }}</dd>
                </div>
                <div>
                    <dt class="text-sm text-muted">Montant indiqué dans l’entête</dt>
                    <dd class="mt-1 font-medium tabular-nums text-highlighted">
                        {{ formatAmount(props.currentNf.montant_total) }}
                    </dd>
                </div>
            </dl>
        </section>

        <section class="rounded-xl border border-default bg-elevated p-3 sm:p-3" aria-labelledby="nf-lines-title">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-receipt-text" class="size-5 text-primary" aria-hidden="true" />
                    <h3 id="nf-lines-title" class="text-lg font-semibold text-highlighted">Lignes de frais</h3>
                </div>
                <UBadge :label="`${lines.length} ligne${lines.length === 1 ? '' : 's'}`" color="neutral"
                    variant="subtle" />
            </div>

            <div v-if="lines.length" class="mt-4 divide-y divide-default border-y border-default">
                <article v-for="(line, index) in lines" :key="line.id" class="py-4">
                    <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div class="flex min-w-0 gap-3">
                            <span
                                class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-default text-sm font-semibold tabular-nums text-muted">
                                {{ String(index + 1).padStart(2, '0') }}
                            </span>
                            <div class="min-w-0">
                                <h4 class="font-medium text-highlighted">{{ line.frais_id || 'Frais sans catégorie' }}
                                </h4>
                                <p class="mt-1 text-base leading-6 text-muted">
                                    {{ line.description || 'Aucune précision ajoutée.' }}
                                </p>
                            </div>
                        </div>
                        <p class="shrink-0 font-semibold tabular-nums text-highlighted sm:text-right">
                            {{ formatAmount(Number(line.montant_total) || 0, line.devise_id || currencyName) }}
                        </p>
                    </div>
                </article>
            </div>

            <div v-else class="mt-4 rounded-lg border border-dashed border-default px-4 py-8 text-center">
                <UIcon name="i-lucide-receipt-text" class="mx-auto size-6 text-muted" aria-hidden="true" />
                <p class="mt-2 font-medium text-highlighted">Aucun frais ajouté</p>
                <p class="mt-1 text-base text-muted">Les lignes de dépenses apparaîtront ici.</p>
            </div>
        </section>

        <section class="rounded-xl border border-default bg-elevated p-3 sm:p-3" aria-labelledby="nf-budget-title">
            <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                    <UIcon name="i-lucide-landmark" class="size-5 text-primary" aria-hidden="true" />
                    <h3 id="nf-budget-title" class="text-lg font-semibold text-highlighted">Imputations budgétaires</h3>
                </div>
                <UBadge :label="`${budgetTransactions.length} imputation${budgetTransactions.length === 1 ? '' : 's'}`"
                    color="neutral" variant="subtle" />
            </div>

            <div v-if="budgetTransactions.length" class="mt-4">
                <dl class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div class="rounded-lg border border-default bg-default px-4 py-3">
                        <dt class="text-sm text-muted">Montant demandé</dt>
                        <dd class="mt-1 text-lg font-semibold tabular-nums text-highlighted">
                            {{ formatAmount(totalRequested) }}
                        </dd>
                    </div>
                    <div class="rounded-lg border border-default bg-default px-4 py-3">
                        <dt class="text-sm text-muted">Budget annuel référencé</dt>
                        <dd class="mt-1 text-lg font-semibold tabular-nums text-highlighted">
                            {{ formatAmount(totalAnnual) }}
                        </dd>
                    </div>
                </dl>

                <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <article v-for="transaction in budgetTransactions" :key="transaction.id"
                        class="min-w-0 rounded-lg border border-default p-4">
                        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div class="flex min-w-0 gap-3">
                                <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-default">
                                    <UIcon name="i-lucide-wallet" class="size-4 text-primary" aria-hidden="true" />
                                </span>
                                <div class="min-w-0">
                                    <h4 class="font-medium text-highlighted">{{ budgetLineLabel(transaction) }}</h4>
                                    <p v-if="budgetCodeDescription(transaction)"
                                        class="mt-1 text-sm leading-5 text-muted">
                                        {{ budgetCodeDescription(transaction) }}
                                    </p>
                                </div>
                            </div>
                            <UBadge v-if="transactionLineFor(transaction)"
                                :label="transactionLineFor(transaction)?.frais_id || 'Ligne de frais'" color="neutral"
                                variant="subtle" class="w-fit max-w-full" />
                        </div>

                        <dl class="mt-4 grid grid-cols-2 gap-3 border-t border-default pt-3">
                            <div>
                                <dt class="text-sm text-muted">Montant demandé</dt>
                                <dd class="mt-1 font-semibold tabular-nums text-highlighted">
                                    {{ formatAmount(transaction.montant_demande) }}
                                </dd>
                            </div>
                            <div>
                                <dt class="text-sm text-muted">Budget annuel</dt>
                                <dd class="mt-1 font-medium tabular-nums text-highlighted">
                                    {{ formatAmount(transaction.montant_annuel) }}
                                </dd>
                            </div>
                        </dl>

                        <div class="mt-3 flex flex-wrap justify-between gap-x-4 gap-y-1 text-sm text-muted">
                            <p v-if="budgetOrganizationName(transaction)">
                                Entité : {{ budgetOrganizationName(transaction) }}
                            </p>
                            <p>Imputé le {{ formatDate(transaction.created) }}</p>
                        </div>
                    </article>
                </div>
            </div>

            <div v-else class="mt-4 rounded-lg border border-dashed border-default px-4 py-8 text-center">
                <UIcon name="i-lucide-wallet" class="mx-auto size-6 text-muted" aria-hidden="true" />
                <p class="mt-2 font-medium text-highlighted">Aucune imputation budgétaire</p>
                <p class="mt-1 text-base text-muted">Les transactions liées aux lignes de frais apparaîtront ici.</p>
            </div>
        </section>
    </section>

    <div v-else class="rounded-lg border border-dashed border-default px-4 py-8 text-center text-base text-muted">
        Sélectionnez une note de frais pour afficher son résumé.
    </div>
</template>
