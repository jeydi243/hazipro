<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import { generateRandomCode } from '~/utils'
    import type { Lookup, Organisation } from '~/types/organisation'

    const parametresStore = useParametresStore()
    const beneficiairesStore = useBeneficiairesStore()
    const schema = z.object({
        nom: z.string().min(6, 'Too short'),
        prenom: z.string().optional(),
        postnom: z.string().optional(),
        approbateur: z.string().optional(),
        code: z.string(),
        genre: z.enum(['M', 'F'], { message: 'Genre is required' }),
        matrice_id: z.string(),
        categorie_id: z.string({ message: 'Organisation is required' })
    })
    const MatriceNF = parametresStore.getMatriceNF;
    const open = ref(false)
    const isLoading = ref(false)
    const toast = useToast()
    type Schema = z.output<typeof schema>
    const state = reactive<Partial<Schema>>({
        nom: undefined,
        code: generateRandomCode(),
        prenom: undefined,
        postnom: undefined,
        matrice_id: undefined,
        approbateur: undefined,
        categorie_id: undefined
    })

    const Organisations = useParametresStore().organisations;
    const TypeBeneficiaires = useLookupsStore().getTypeBeneficiaires;

    const itemsOrganisations = computed<SelectMenuItem[]>(() => Organisations?.map((org: Organisation) => ({
        label: org.nom,
        id: org.id
    })) || [])

    const itemsBeneficiaires = computed<SelectMenuItem[]>(() => TypeBeneficiaires?.map((beneficiaire: Lookup) => ({
        label: beneficiaire.nom,
        id: beneficiaire.id
    })) || [])

    const itemsMatriceNF = computed<SelectMenuItem[]>(() => MatriceNF?.map((matrice: any) => ({
        label: matrice.nom,
        id: matrice.id
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
    async function onSubmit(event: FormSubmitEvent<Schema>) {
        isLoading.value = true
        try {
            await beneficiairesStore.create(event.data)
            toast.add({ title: 'Succès', description: `Nouveau bénéficiaire ajouté`, color: 'success' })
            open.value = false
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        } finally {
            isLoading.value = false
        }
    }
</script>

<template>
    <USlideover v-model:open="open" :ui="{ content: 'min-w-2xl' }" title="Bénéficiaire"
        description="Add a new bénéficiaire to the database">
        <UButton label="Nouveau beneficiaire" icon="i-lucide-plus" />

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
                    <USelectMenu v-model="state.approbateur" value-key="id" :items="itemsMatriceNF" class="w-full" />
                </UFormField>
            </UForm>
        </template>
        <template #footer="{ close }">
            <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
            <UButton label="Créer le bénéficiaire" class="ml-auto" color="primary" variant="solid" type="submit"
                form="beneficiaire-form" :loading="isLoading" />
        </template>
    </USlideover>
</template>
