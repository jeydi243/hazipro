<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import { CalendarDate, getLocalTimeZone } from '@internationalized/date'
    import type { Beneficiaire, Profil } from '~/types'
    import type { Lookup, Matrice } from '~/types/organisation';

    const props = defineProps<{
        parent: Beneficiaire | null
    }>()
    const Profils = useProfilsStore().items;
    const TypeComptes = useLookupsStore().lookups;
    const emit = defineEmits(['compte-added'])

    const schema = z.object({
        beneficiaire_id: z.string().min(1, 'Bénéficiaire requis'),
        numero_compte: z.string().min(1, 'Numéro de compte requis'),
        intitule_compte: z.string().min(1, 'Intitulé de compte requis'),
        banque_id: z.string().min(1, 'Banque requise'),
        type_compte_id: z.string().min(1, 'Type de compte requis'),
        date_debut: z.date({ message: 'Date de début requise' }),
        date_fin: z.date().optional(),

    })

    const open = ref(false)
    const toast = useToast()
    const beneficiairesStore = useBeneficiairesStore()

    type Schema = z.output<typeof schema>

    const state = reactive<Partial<Schema>>({
        beneficiaire_id: props.parent?.id,
        numero_compte: undefined,
        intitule_compte: undefined,
        banque_id: undefined,
        type_compte_id: undefined,
        date_debut: new Date(),
        date_fin: undefined
    })

    const maxDate = new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())

    const toCalendarDate = (date: Date) => {
        return new CalendarDate(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate()
        )
    }

    const dateDebutModel = computed<any>({
        get: () => state.date_debut ? toCalendarDate(state.date_debut) : undefined,
        set: (value: any) => {
            state.date_debut = value ? value.toDate(getLocalTimeZone()) : undefined
        }
    })

    const dateFinModel = computed<any>({
        get: () => state.date_fin ? toCalendarDate(state.date_fin) : undefined,
        set: (value: any) => {
            state.date_fin = value ? value.toDate(getLocalTimeZone()) : undefined
        }
    })

    function formatNumeroCompte(value: string) {
        const digits = value.replace(/\D/g, '').slice(0, 23)
        state.numero_compte = [
            digits.slice(0, 5),
            digits.slice(5, 10),
            digits.slice(10, 21),
            digits.slice(21, 23)
        ].filter(Boolean).join('-')
    }

    const profilItems = computed<SelectMenuItem[]>(() => (Profils || []).map((p: Profil) => ({
        label: `${p.email}`,
        id: p.id
    })))
    const typeCompteItems = computed<SelectMenuItem[]>(() => (TypeComptes || []).map((t: Lookup) => ({
        label: `${t.nom}`,
        id: t.id
    })))

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        if (!props.parent?.id) return

        try {
            await beneficiairesStore.createCompteBancaire({
                ...event.data,
                beneficiaire_id: props.parent.id
            })

            toast.add({ title: 'Succès', description: `Compte bancaire ajouté avec succès`, color: 'success' })
            emit('compte-added')
            open.value = false
            // Reset state
            state.beneficiaire_id = undefined
            state.numero_compte = undefined
            state.intitule_compte = undefined
            state.banque_id = undefined
            state.date_debut = new Date()
            state.date_fin = undefined
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        }
    }
</script>

<template>
    <UModal v-model:open="open" title="Ajouter un compte bancaire"
        description="Ajouter un compte bancaire à ce bénéficiaire">
        <UButton label="Ajouter un compte bancaire" icon="i-lucide-plus" size="sm" variant="subtle" />

        <template #body>
            <div v-if="props.parent" class="mb-4 p-3 bg-elevated rounded-lg border border-default text-sm">
                <!-- <p class="text-(--ui-text-muted) flex items-center gap-2 mb-1">
                    <UIcon name="i-lucide-building" />
                    Organisation Parente
                </p> -->
                <p class="font-medium text-highlighted">
                    {{ props.parent.nom }} {{ props.parent.postnom }} {{ props.parent.prenom }}
                    <span class="text-xs font-mono opacity-60 ml-1">({{ props.parent.code || 'N/A' }})</span>
                </p>
            </div>

            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Numéro de compte" name="numero_compte">
                    <UInput :model-value="state.numero_compte" class="w-full"
                        placeholder="12345-12345-12345678901-12" inputmode="numeric" maxlength="26"
                        @update:model-value="formatNumeroCompte" />
                </UFormField>
                <UFormField label="Intitulé de compte" name="intitule_compte">
                    <UInput v-model="state.intitule_compte" class="w-full" placeholder="Entrez l'intitulé du compte" />
                </UFormField>
                <UFormField label="Banque" name="banque_id">
                    <USelectMenu v-model="state.banque_id" class="w-full" value-key="id" :items="profilItems"
                        placeholder="Choisir une banque" />
                </UFormField>
                <UFormField label="Type de compte" name="type_compte_id">
                    <USelectMenu v-model="state.type_compte_id" class="w-full" value-key="id" :items="typeCompteItems" placeholder="Choisir un type de compte" />
                </UFormField>
                <UFormField label="Date debut" name="date_debut">
                    <UInputDate v-model="dateDebutModel" class="w-full" :max-date="maxDate">
                        <template #trailing>
                            <UPopover>
                                <UButton color="neutral" variant="link" size="sm" icon="i-lucide-calendar"
                                    aria-label="Select a date" class="px-0" />

                                <template #content>
                                    <UCalendar v-model="dateDebutModel" class="p-2" :max-date="maxDate" />
                                </template>
                            </UPopover>
                        </template>
                    </UInputDate>
                </UFormField>
                <UFormField label="Date fin" name="date_fin">
                    <UInputDate v-model="dateFinModel" class="w-full">
                        <template #trailing>
                            <UPopover>
                                <UButton color="neutral" variant="link" size="sm" icon="i-lucide-calendar"
                                    aria-label="Select a date" class="px-0" />

                                <template #content>
                                    <UCalendar v-model="dateFinModel" class="p-2" />
                                </template>
                            </UPopover>
                        </template>
                    </UInputDate>
                </UFormField>

                <div class="flex justify-end gap-2">
                    <UButton label="Annuler" color="neutral" variant="subtle" @click="open = false" />
                    <UButton label="Attacher" color="primary" variant="solid" type="submit" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
