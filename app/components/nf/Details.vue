<template>
    <USlideover v-model:open="open" :ui="{ content: 'min-w-5xl' }" :dismissible="false" title="Note de frais"
        description="Add a new note de frais to the database" :close="{
            color: 'primary',
            variant: 'outline',
            class: 'rounded-full'
        }">
        <template #body>
            <div v-if="nextStep === 'header'" class="header">
                <UForm id="nf-create-form" :schema="schema" :state="state" class="space-y-4" @submit="onSubmit"
                    @error="onValidationError">
                    <div v-if="validationErrors.length" role="alert" aria-live="assertive"
                        class="rounded-md border border-error/50 bg-error/5 p-3 text-sm text-error">
                        <p class="font-medium">Veuillez corriger les erreurs suivantes :</p>
                        <ul class="mt-1 list-inside list-disc">
                            <li v-for="(error, index) in validationErrors" :key="`${error.id}-${index}`">
                                {{ error.message }}
                            </li>
                        </ul>
                    </div>
                    <div class="grid grid-cols-4 gap-4">
                        <UFormField label="Direction" name="organisation_id">
                            <USelectMenu v-model="state.organisation_id" value-key="id" :items="itemsOrganisations"
                                class="w-full" />
                        </UFormField>
                        <UFormField label="Type NF" placeholder="Employé" name="type_nf">
                            <USelectMenu v-model="state.type_nf" value-key="id" :items="itemsBeneficiaires"
                                class="w-full" />
                        </UFormField>
                        <UFormField label="Nature de la note" placeholder="" name="nature_id">
                            <USelectMenu v-model="state.nature_id" value-key="id" :items="itemsNaturesOrganisation"
                                class="w-full" />
                        </UFormField>
                        <!-- <UFormField label="Code" name="code">
                        <UInput v-model="state.code" class="w-full" placeholder="" />
                    </UFormField> -->
                        <UFormField label="Type budget" placeholder="" name="type_budget_id">
                            <USelectMenu v-model="state.type_budget_id" value-key="id" :items="itemsBudget"
                                class="w-full" />
                        </UFormField>
                        <UFormField label="Matrice" placeholder="" name="matrice_id">
                            <USelectMenu v-model="state.matrice_id" value-key="id" :items="itemsMatriceNF"
                                class="w-full" />
                        </UFormField>
                        <UFormField label="1er Approbateur" placeholder="_" name="approbateur_id">
                            <USelectMenu v-model="state.approbateur_id" value-key="id" :items="itemsApprobateurs"
                                :disabled="!state.matrice_id || !state.organisation_id" class="w-full" />
                        </UFormField>
                        <!-- <UFormField label="Approbateur" placeholder="_" name="aprobateur">
                        <UInput v-model="state.approbateur_id" class="w-full" />
                    </UFormField> -->
                        <UFormField label="Date de la note" name="date_document">
                            <UInputDate ref="inputDate" v-model="dateDocument" :max-value="maxDate">
                                <template #trailing>
                                    <UPopover :reference="inputDate?.inputsRef[3]?.$el">
                                        <UButton color="neutral" variant="link" size="sm" icon="i-lucide-calendar"
                                            aria-label="Select a date" class="px-0" />

                                        <template #content>
                                            <UCalendar v-model="dateDocument" :max-value="maxDate" class="p-2" />
                                        </template>
                                    </UPopover>
                                </template>
                            </UInputDate>
                        </UFormField>
                        <UFormField label="Devise" placeholder="_" name="devise_id">
                            <USelectMenu v-model="state.devise_id" value-key="id" :items="itemsDevises"
                                class="w-full" />
                        </UFormField>
                        <UFormField label="Taux" placeholder="_" name="taux">
                            <UInput v-model="state.taux" class="w-full" disabled />
                        </UFormField>
                        <!-- <UFormField label="Groupe de paiement" placeholder="_" name="aprobateur">
                        <UInput v-model="state.groupe_paiement_id" class="w-full" />
                    </UFormField> -->
                    </div>
                    <div class="mt-auto">
                        <UFormField label="Bénéficiaire" placeholder="_" name="beneficiaire_id" class="mb-2">
                            <USelectMenu v-model="state.beneficiaire_id" value-key="id" :items="benef"
                                icon="i-lucide-user" placeholder="Select user" :ui="{ content: 'min-w-fit' }"
                                class="w-full" @update:open="onOpen">
                                <template #item-label="{ item }">
                                    {{ (item as any)?.label }}

                                    <span class="text-muted">
                                        {{ (item as any)?.email }}
                                    </span>
                                </template>
                            </USelectMenu>
                        </UFormField>
                        <UFormField label="Description" placeholder="_" name="description">
                            <UTextarea v-model="state.description" class="w-full" />
                        </UFormField>
                    </div>
                    <div class="grid grid-cols-4 gap-4 statuts_nf">
                        <UFormField label="Statut document" placeholder="_" name="statut_document">
                            <UInput v-model="state.statut_document" class="w-full" disabled />
                        </UFormField>
                        <UFormField label="Statut approbation" placeholder="_" name="statut_approbation">
                            <UInput v-model="state.statut_approbation" class="w-full" disabled />
                        </UFormField>
                        <UFormField label="Statut paiement" placeholder="_" name="statut_paiement">
                            <UInput v-model="state.statut_paiement" class="w-full" disabled />
                        </UFormField>
                        <UFormField label="Statut planification" placeholder="_" name="statut_planification">
                            <UInput v-model="state.statut_planification" class="w-full" disabled />
                        </UFormField>
                        <UFormField label="Statut programmation" placeholder="_" name="statut_programmation">
                            <UInput v-model="state.statut_programmation" class="w-full" disabled />
                        </UFormField>
                        <UFormField label="Numéro de document" placeholder="_" name="numero_document">
                            <UInput v-model="state.numero_document" class="w-full" disabled />
                        </UFormField>
                    </div>
                    <!-- <div class="flex justify-end gap-2">
                    <UButton label="Annuler" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Créer" form="" color="primary" variant="solid" type="submit" />
                </div> -->
                </UForm>
            </div>
            <div v-else-if="nextStep === 'lignes'">
                <NFDetailsLignes :current-nf="state" />
            </div>
        </template>
        <template #footer="{ close }">
            <UButton v-if="nextStep === 'header'" label="Fermer" color="neutral" variant="outline" @click="close" />
            <UButton v-else label="Precedent" color="info" variant="ghost" @click="setPrevious('header')" />

            <UButton label="Documents" color="info" variant="ghost" />
            <UButton v-if="!state.id" label="Créer la note de frais" class="ml-auto" color="primary" variant="solid"
                type="submit" form="nf-create-form" :loading="isLoading" />
            <span v-else-if="state.id" class="flex flex-row gap-2 ml-auto">
                <UButton label="Mettre à jour" class="ml-auto" color="primary" variant="solid" type="submit"
                    form="nf-create-form" :loading="isLoading" />
                <UButton v-if="state.id" label="Suivant" class="ml-auto" color="primary" variant="ghost"
                    :loading="isLoading" @click="setNext('lignes')" />
            </span>
        </template>
    </USlideover>
</template>
<script setup lang="ts">
    import * as z from 'zod'
    import { getLocalTimeZone, today } from '@internationalized/date'
    import type { FormErrorEvent, FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { DateValue } from '@internationalized/date'
    import type { Lookup, Organisation } from '~/types/organisation'
    import type { Beneficiaire, NF } from '~/types'

    const props = defineProps<{
        currentNf: NF | null
    }>()
    const maxDate = today(getLocalTimeZone())
    const schema = z.object({
        id: z.string().optional(),
        description: z.string().min(1, 'La description est obligatoire'),
        matrice_id: z.string().min(1, 'La matrice est obligatoire'),
        approbateur_id: z.string().min(1, 'Aucun approbateur trouvé pour cette matrice et cette direction'),
        organisation_id: z.string({ message: 'La direction est obligatoire' }).min(1, 'La direction est obligatoire'),
        taux: z.number().optional(),
        type_nf: z.string().min(1, 'Le type de note de frais est obligatoire'),
        type_budget_id: z.string().min(1, 'Le type de budget est obligatoire'),
        groupe_paiement_id: z.string().optional(),
        nature_id: z.string().min(1, 'La nature de la note est obligatoire'),
        beneficiaire_id: z.string().min(1, 'Le bénéficiaire est obligatoire'),
        devise_id: z.string().min(3, 'La devise est obligatoire'),
        numero_document: z.string().optional(),
        statut_document: z.string(),
        statut_approbation: z.string(),
        statut_paiement: z.string(),
        statut_planification: z.string(),
        statut_programmation: z.string(),
        montant_total: z.number().optional(),
        date_document: z.string().min(1, 'La date de la note est obligatoire').refine(
            (value) => value <= maxDate.toString(),
            'La date ne peut pas être dans le futur',
        )
    })
    const state = reactive<Partial<Schema>>({
        description: undefined,
        matrice_id: undefined,
        approbateur_id: undefined,
        organisation_id: undefined,
        type_nf: undefined,
        type_budget_id: undefined,
        nature_id: undefined,
        beneficiaire_id: undefined,
        groupe_paiement_id: undefined,
        taux: undefined,
        devise_id: undefined,
        montant_total: 0,
        date_document: maxDate.toString(),
        statut_document: 'Brouillon',
        statut_approbation: 'Non soumis',
        statut_paiement: 'Non payé',
        statut_planification: 'Non planifié',
        statut_programmation: 'Non programmé'
    })

    type Schema = z.output<typeof schema>
    const open = ref(false)
    const isLoading = ref(false)
    const nextStep = ref<string | null>("header")
    const toast = useToast()
    const nfStore = useNFStore()
    const parametresStore = useParametresStore()
    const dateDocument = shallowRef<DateValue | null>(maxDate)
    const inputDate = useTemplateRef<{ inputsRef: Array<{ $el: HTMLElement }> }>('inputDate')
    const validationErrors = ref<FormErrorEvent['errors']>([])

    watch(dateDocument, (date) => {
        state.date_document = date?.toString()
    })
    watch(
        () => props.currentNf,
        (nf) => {
            state.id = nf?.id
            state.nature_id = nf?.nature_id as string
            state.date_document = nf?.date_document
            state.organisation_id = nf?.organisation_id as string
            state.beneficiaire_id = nf?.beneficiaire_id as string
            state.statut_approbation = nf?.statut_approbation
            state.statut_paiement = nf?.statut_paiement
            state.devise_id = nf?.devise_id as string
            state.type_nf = nf?.type_nf
            state.description = nf?.description
            state.montant_total = nf?.montant_total
            state.matrice_id = nf?.matrice_id as string
            state.approbateur_id = nf?.approbateur_id as string
            state.type_budget_id = nf?.type_budget_id as string
        },
        { immediate: true }
    )
    watch(
        [() => state.devise_id, () => state.date_document],
        ([deviseId, selectedDate]) => {
            if (!deviseId) {
                state.taux = undefined
                return
            }

            const taux = parametresStore.getTauxForDevise(deviseId, selectedDate ?? null)
            if (taux !== null && taux !== undefined) {
                state.taux = taux
            }
        },
        { immediate: true }
    )
    watch(
        [() => state.matrice_id, () => state.organisation_id],
        ([matriceId, organisationId]) => {
            if (!matriceId || !organisationId) {
                state.approbateur_id = undefined
                return
            }

            state.approbateur_id = undefined
            const approbateurId = parametresStore.getFirstApprobateurID(
                matriceId,
                organisationId,
            )

            if (approbateurId) {
                state.approbateur_id = approbateurId
            }
        },
        { immediate: true }
    )

    const Organisations = parametresStore.organisations;
    const TypeBudget = useLookupsStore().getTypeBudget;
    const TypeBeneficiaires = useLookupsStore().getTypeBeneficiaires;
    const MatriceNF = parametresStore.getMatriceNF;
    const Devises = useLookupsStore().getDevise;
    const Natures = useLookupsStore().getNatures;
    const Beneficiaires = useBeneficiairesStore().getBeneficiaires;

    const itemsOrganisations = computed<SelectMenuItem[]>(() => Organisations?.map((org: Organisation) => ({
        label: org.nom,
        id: org.id
    })) || [])

    const itemsBeneficiaires = computed<SelectMenuItem[]>(() => TypeBeneficiaires?.map((beneficiaire: Lookup) => ({
        label: beneficiaire.nom,
        id: beneficiaire.id
    })) || [])

    const itemsNaturesOrganisation = computed<SelectMenuItem[]>(() => Natures?.map((org: Lookup) => ({
        label: org.nom,
        id: org.id
    })) || [])

    const itemsBudget = computed<SelectMenuItem[]>(() => TypeBudget?.map((org: Lookup) => ({
        label: org.nom,
        id: org.id
    })) || [])

    const itemsMatriceNF = computed<SelectMenuItem[]>(() => MatriceNF?.map((matrice: any) => ({
        label: matrice.nom,
        id: matrice.id
    })) || [])

    const itemsApprobateurs = computed<SelectMenuItem[]>(() =>
        parametresStore.getApprobateurs(
            state.matrice_id ?? null,
            state.organisation_id ?? null,
            1
        ).flatMap((approbateur) => {
            const user = approbateur.user_id
            if (!user || typeof user === 'string') return []

            const label = [user.nom, user.postnom, user.prenom].filter(Boolean).join(' ') || user.email
            return label ? [{ label, id: user.id }] : []
        })
    )

    const itemsDevises = computed<SelectMenuItem[]>(() => Devises?.map((org: Lookup) => ({
        label: org.nom,
        id: org.id
    })) || [])

    const benef = computed<SelectMenuItem[]>(() => Beneficiaires.value?.map((beneficiaire: any) => ({
        label: beneficiaire.nom + ' ' + beneficiaire.postnom + ' ' + beneficiaire.prenom,
        email: beneficiaire.email,
        id: beneficiaire.id,
        avatar: { src: `https://i.pravatar.cc/120?img=${beneficiaire.id}`, loading: 'lazy' as const }
    })) || [])

    const { data: beneficiaires, execute } = useLazyFetch('https://jsonplaceholder.typicode.com/users', {
        key: 'typicode-users-email',
        transform: (data: { id: number, name: string, email: string }[]) => {
            return data?.map(user => ({
                label: user.name,
                email: user.email,
                value: String(user.id),
                avatar: { src: `https://i.pravatar.cc/120?img=${user.id}`, loading: 'lazy' as const }
            }))
        },
        immediate: false
    })

    function onOpen() {
        if (!beneficiaires.value?.length) {
            execute()
        }
    }

    function onValidationError(error: FormErrorEvent) {
        validationErrors.value = error.errors
    }
    function setNext(next: string) {
        nextStep.value = next
    }
    function setPrevious(previous: string) {
        nextStep.value = previous
    }

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        validationErrors.value = []
        isLoading.value = true
        try {
            await nfStore.create(event.data)
            toast.add({ title: 'Succès', description: `Nouvelle note de frais ajoutée`, color: 'success' })
            open.value = false
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        } finally {
            isLoading.value = false
        }
    }
</script>
