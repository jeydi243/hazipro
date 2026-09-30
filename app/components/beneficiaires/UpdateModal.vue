<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import { generateRandomCode } from '~/utils'
    import type { Beneficiaire } from '~/types'
    import type { Lookup } from '~/types/organisation'

    const parametresStore = useParametresStore()
    const beneficiairesStore = useBeneficiairesStore()
    const props = defineProps<{
        open: boolean
        benef?: Beneficiaire | null
    }>()
    const emit = defineEmits<{
        'update:open': [value: boolean]
    }>()
    const isOpen = computed({
        get: () => props.open,
        set: (value: boolean) => emit('update:open', value)
    })
    const schema = z.object({
        nom: z.string().min(6, 'Too short'),
        prenom: z.string().optional(),
        postnom: z.string().optional(),
        approbateur_id: z.string().optional(),
        code: z.string(),
        genre: z.enum(['M', 'F'], { message: 'Genre is required' }),
        matrice_id: z.string(),
        categorie_id: z.string({ message: 'Organisation is required' })
    })
    const MatriceNF = parametresStore.getMatriceNF;
    const isLoading = ref(false)
    const isLoadingUpdate = ref(false)
    const toast = useToast()
    type Schema = z.output<typeof schema>

    const state = reactive<Partial<Schema>>({
        nom: undefined,
        code: generateRandomCode(),
        prenom: undefined,
        postnom: undefined,
        matrice_id: undefined,
        approbateur_id: undefined,
        categorie_id: undefined
    })

    type BeneficiaireAvecMatrice = Beneficiaire & {
        matrice?: string | { id: string } | null
        matrice_id?: string | { id: string } | null
    }
    function relationId(value: string | { id: string } | null | undefined) {
        return typeof value === 'string' ? value : value?.id
    }

    watch(
        [() => props.benef, () => props.open],
        ([benef, isOpen]) => {
            if (!isOpen) return

            const beneficiary = benef as BeneficiaireAvecMatrice | null | undefined
            Object.assign(state, {
                nom: beneficiary?.nom,
                code: beneficiary?.code ?? generateRandomCode(),
                prenom: beneficiary?.prenom,
                postnom: beneficiary?.postnom,
                genre: beneficiary?.genre === 'M' || beneficiary?.genre === 'F'
                    ? beneficiary.genre
                    : undefined,
                matrice_id: relationId(beneficiary?.matrice_id ?? beneficiary?.matrice),
                approbateur_id: relationId(beneficiary?.approbateur_id),
                categorie_id: relationId(beneficiary?.categorie_id)
            })
        },
        { immediate: true }
    )

    const TypeBeneficiaires = useLookupsStore().getTypeBeneficiaires;
    const itemsApprobateurs = computed<SelectMenuItem[]>(() =>
        parametresStore.getApprobateurs(state.matrice_id ?? null).flatMap((approbateur) => {
            const user = approbateur.user_id
            if (!user || typeof user === 'string') return []
            const label = user.nom || user.email
            return label ? [{ label, id: approbateur.id }] : []
        })
    )

    const itemsBeneficiaires = computed<SelectMenuItem[]>(() => TypeBeneficiaires?.map((beneficiaire: Lookup) => ({
        label: beneficiaire.nom,
        id: beneficiaire.id
    })) || [])

    const itemsMatriceNF = computed<SelectMenuItem[]>(() => MatriceNF?.map((matrice: any) => ({
        label: matrice.nom,
        id: matrice.id
    })) || [])

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        // const isUpdating = Boolean(props.benef?.id)
        isLoadingUpdate.value = true;
        try {
            if (props.benef?.id) {
                await beneficiairesStore.update(props.benef.id, event.data)
                toast.add({ title: 'Succès', description: `Bénéficiaire mis à jour`, color: 'success' })
            } else {
                await beneficiairesStore.create(event.data)
                toast.add({ title: 'Succès', description: `Nouveau bénéficiaire ajouté`, color: 'success' })
            }
            isOpen.value = false
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        } finally {
            isLoadingUpdate.value = false;
        }
    }
</script>

<template>
    <USlideover v-model:open="isOpen" :ui="{ content: 'min-w-2xl' }" title="Bénéficiaire"
        description="Add a new bénéficiaire to the database" :dismissible="false">
        <template #body>
            <UForm id="beneficiaire-form" :schema="schema" :state="state" :validate-on="[]" class="space-y-4"
                @submit="onSubmit">
                <div class="mt-auto">
                    <UFormField label="Categorie bénéficiaire" placeholder="_" name="categorie_id">
                        <USelectMenu v-model="state.categorie_id" value-key="id" :items="itemsBeneficiaires"
                            class="w-full" />
                    </UFormField>
                </div>
                <UFormField label="Code" name="code">
                    <UInput v-model="state.code" class="w-full" placeholder="Code du bénéficiaire" :disabled="true">
                        <template #trailing>
                            <UButton icon="i-lucide-refresh-cw" color="neutral" variant="ghost" size="xs"
                                aria-label="Régénérer le code" @click="state.code = generateRandomCode()" />
                        </template>
                    </UInput>
                </UFormField>
                <UFormField label="Nom" name="nom">
                    <UInput v-model="state.nom" class="w-full" />
                </UFormField>
                <UFormField label="Postnom" name="postnom">
                    <UInput v-model="state.postnom" class="w-full" />
                </UFormField>
                <UFormField label="Prénom" name="prenom">
                    <UInput v-model="state.prenom" class="w-full" />
                </UFormField>
                <UFormField label="Genre" name="genre">
                    <URadioGroup v-model="state.genre"
                        :items="[{ label: 'Masculin', value: 'M' }, { label: 'Féminin', value: 'F' }]" />
                </UFormField>
                <UFormField label="Matrice" placeholder="" name="matrice_id">
                    <USelectMenu v-model="state.matrice_id" value-key="id" :items="itemsMatriceNF" class="w-full" />
                </UFormField>
                <UFormField label="1er Approbateur" placeholder="" name="approbateur">
                    <USelectMenu v-model="state.approbateur_id" value-key="id" :items="itemsApprobateurs"
                        class="w-full" />
                </UFormField>
            </UForm>
        </template>
        <template #footer="{ close }">
            <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
            <UButton v-if="!benef" label="Créer le bénéficiaire" class="ml-auto" color="primary" variant="solid"
                type="submit" form="beneficiaire-form" :loading="isLoading" />
            <UButton v-else label="Mettre à jour le bénéficiaire" class="ml-auto" color="primary" variant="solid"
                type="submit" form="beneficiaire-form" :loading="isLoadingUpdate" />
        </template>
    </USlideover>
</template>
