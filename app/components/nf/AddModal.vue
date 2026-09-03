<template>
    <USlideover v-model:open="open" :ui="{ content: 'min-w-5xl' }" title="Note de frais"
        description="Add a new note de frais to the database">
        <UButton label="Nouvelle Note de frais" icon="i-lucide-plus" />

        <template #body>
            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <div class="grid grid-cols-4 gap-4">
                    <UFormField label="Direction" name="code">
                        <USelectMenu v-model="state.organisation_id" value-key="id" :items="itemsOrganisations"
                            class="w-full" />
                    </UFormField>
                    <UFormField label="Type NF" placeholder="Employé" name="type_nf">
                        <UInput v-model="state.type_nf" class="w-full" />
                    </UFormField>
                    <UFormField label="Nature de la note" placeholder="" name="nature_nf">
                        <USelectMenu v-model="state.nature_id" value-key="id" :items="itemsNaturesOrganisation"
                            class="w-full" />
                    </UFormField>

                    <UFormField label="Code" name="code">
                        <UInput v-model="state.code" class="w-full" placeholder="Code de l'article" />
                    </UFormField>
                    <UFormField label="Type budget" placeholder="John Doe" name="nom">
                        <USelectMenu v-model="state.type_budget" value-key="id" :items="itemsBudget" class="w-full" />
                    </UFormField>
                    <UFormField label="Matrice" placeholder="" name="description">
                        <USelectMenu v-model="state.matrice_id" value-key="id" :items="itemsMatriceNF" class="w-full" />
                    </UFormField>
                    <UFormField label="1er Approbateur" placeholder="_" name="aprobateur">
                        <UInput v-model="state.approbateur_id" class="w-full" />
                    </UFormField>
                    <UFormField label="Approbateur" placeholder="_" name="aprobateur">
                        <UInput v-model="state.approbateur_id" class="w-full" />
                    </UFormField>
                    <UFormField label="Date de la note" name="date_document">
                        <UInputDate ref="inputDate" v-model="dateDocument">
                            <template #trailing>
                                <UPopover :reference="inputDate?.inputsRef[3]?.$el">
                                    <UButton color="neutral" variant="link" size="sm" icon="i-lucide-calendar"
                                        aria-label="Select a date" class="px-0" />

                                    <template #content>
                                        <UCalendar v-model="dateDocument" class="p-2" />
                                    </template>
                                </UPopover>
                            </template>
                        </UInputDate>
                    </UFormField>
                    <UFormField label="Devise" placeholder="_" name="aprobateur">
                        <USelectMenu v-model="state.devise_id" value-key="id" :items="itemsDevises" class="w-full" />
                    </UFormField>
                    <UFormField label="Taux" placeholder="_" name="aprobateur">
                        <UInput v-model="state.taux" class="w-full" />
                    </UFormField>
                    <UFormField label="Groupe de paiement" placeholder="_" name="aprobateur">
                        <UInput v-model="state.groupe_paiement_id" class="w-full" />
                    </UFormField>
                </div>
                <div class="mt-auto">
                    <UFormField label="Bénéficiaire" placeholder="_" name="beneficiaire_id">
                        <USelectMenu v-model="state.beneficiaire_id" value-key="value" :items="beneficiaires"
                            icon="i-lucide-user" placeholder="Select user" :ui="{ content: 'min-w-fit' }" class="w-full"
                            @update:open="onOpen">
                            <template #item-label="{ item }">
                                {{ item.label }}

                                <span class="text-muted">
                                    {{ item.email }}
                                </span>
                            </template>
                        </USelectMenu>
                    </UFormField>
                    <UFormField label="Description" placeholder="_" name="aprobateur">
                        <UTextarea v-model="state.description" class="w-full" />
                    </UFormField>
                </div>
                <!-- <div class="flex justify-end gap-2">
                    <UButton label="Annuler" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Créer" form="" color="primary" variant="solid" type="submit" />
                </div> -->
            </UForm>
        </template>
        <template #footer="{ close }">
            <UButton label="Cancel" color="neutral" variant="outline" @click="close" />
            <UButton label="Documents" color="info" variant="outline" />
            <UButton label="Créer la note de frais" class="ml-auto" color="primary" variant="solid" type="submit"
                :loading="isLoading" />
        </template>
    </USlideover>
</template>
<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import type { DateValue } from '@internationalized/date'
    import { generateRandomCode } from '~/utils'
    import type { Lookup, Organisation } from '~/types/organisation'

    const schema = z.object({
        nom: z.string().min(3, 'Too short'),
        description: z.string(),
        code: z.string(),
        matrice_id: z.string(),
        approbateur_id: z.string(),
        organisation_id: z.string({ message: 'Organisation is required' }),
        taux: z.number().optional(),
        type_nf: z.string(),
        type_budget: z.string(),
        groupe_paiement_id: z.string().optional(),
        nature_id: z.string(),
        beneficiaire_id: z.string(),
        devise_id: z.string(),
        date_document: z.string()
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
        approbateur_id: undefined,
        organisation_id: undefined,
        type_nf: undefined,
        nature_id: undefined,
        groupe_paiement_id: undefined,
        taux: undefined,
        devise_id: undefined,
        date_document: undefined
    })
    const dateDocument = ref<DateValue | null>(null)
    const inputDate = useTemplateRef<{ inputsRef: Array<{ $el: HTMLElement }> }>('inputDate')

    watch(dateDocument, (date) => {
        state.date_document = date?.toString()
    })

    const Organisations = useParametresStore().organisations;
    const TypeBudget = useLookupsStore().getTypeBudget;
    const MatriceNF = useParametresStore().getMatriceNF;
    const Devises = useLookupsStore().getDevise;

    const itemsOrganisations = computed<SelectMenuItem[]>(() => Organisations?.map((org: Organisation) => ({
        label: org.nom,
        id: org.id
    })) || [])

    const itemsNaturesOrganisation = computed<SelectMenuItem[]>(() => Organisations?.map((org: Organisation) => ({
        label: org.nom,
        id: org.id
    })) || [])

    const itemsBudget = computed<SelectMenuItem[]>(() => TypeBudget?.map((org: Lookup) => ({
        label: org.nom,
        id: org.id
    })) || [])

    const itemsMatriceNF = computed<SelectMenuItem[]>(() => MatriceNF?.map((org: Lookup) => ({
        label: org.nom,
        id: org.id
    })) || [])

    const itemsDevises = computed<SelectMenuItem[]>(() => Devises?.map((org: Lookup) => ({
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
