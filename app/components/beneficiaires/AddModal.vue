<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import { generateRandomCode } from '~/utils'
    import type { Organisation } from '~/types/organisation'

    const schema = z.object({
        nom: z.string().min(3, 'Too short'),
        description: z.string(),
        code: z.string(),
        matrice_id: z.string(),
        categorie_id: z.string({ message: 'Organisation is required' })
    })
    const open = ref(false)
    const isLoading = ref(false)
    const toast = useToast()
    const nfStore = useNFStore()
    type Schema = z.output<typeof schema>
    const supabase = useSupabaseClient<any>()
    const state = reactive<Partial<Schema>>({
        nom: undefined,
        description: undefined,
        code: undefined,
        matrice_id: undefined,
        categorie_id: undefined
    })

    const Organisations = useParametresStore().organisations;

    const itemsOrganisations = computed<SelectMenuItem[]>(() => Organisations?.map((org: Organisation) => ({
        label: org.nom,
        id: org.id
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
            await nfStore.create(event.data)
            toast.add({ title: 'Succès', description: `Nouvelle note de frais ajoutée`, color: 'success' })
            open.value = false
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        }
    }
</script>

<template>
    <USlideover v-model:open="open" title="Bénéficiaire" description="Add a new bénéficiaire to the database">
        <UButton label="Nouveau beneficiaire" icon="i-lucide-plus" />

        <template #body>
            <UForm :schema="schema" :state="state" :validate-on="[]" class="space-y-4" @submit="onSubmit">
                <UFormField label="Code" name="code">
                    <UInput v-model="state.code" class="w-full" placeholder="Code de l'article">
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
                <UFormField label="Matrice" placeholder="" name="description">
                    <UInput v-model="state.matrice_id" class="w-full" />
                </UFormField>

                <div class="mt-auto">
                    <UFormField label="Categorie bénéficiaire" placeholder="_" name="beneficiaire_id">
                        <USelectMenu v-model="state.categorie_id" :items="beneficiaires" icon="i-lucide-user"
                            placeholder="Select user" :ui="{ content: 'min-w-fit' }" class="w-full"
                            @update:open="onOpen">
                            <template #item-label="{ item }">
                                {{ item.label }}

                                <span class="text-muted">
                                    {{ item.email }}
                                </span>
                            </template>
                        </USelectMenu>
                    </UFormField>
                </div>
            </UForm>
        </template>
        <template #footer="{ close }">
            <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
            <UButton label="Créer le bénéficiaire" class="ml-auto" color="primary" variant="solid" type="submit"
                :loading="isLoading" />
        </template>
    </USlideover>
</template>
