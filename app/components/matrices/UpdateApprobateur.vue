<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import { CalendarDate, getLocalTimeZone } from '@internationalized/date'
    import type { Approbateur, Profil } from '~/types'
    import type { Matrice } from '~/types/organisation';

    const props = defineProps<{
        matrice: Matrice | null,
        approbateur: Approbateur | null
    }>()
    const Profils = useProfilsStore().items;
    const emit = defineEmits<{
        'approbateur-updated': []
    }>()

    const schema = z.object({
        id: z.string(),
        user_id: z.string().min(1, 'Utilisateur requis'),
        date_debut: z.date({ message: 'Date de début requise' }),
        date_fin: z.date().optional(),
        organisation_id: z.string().optional(),
        type_beneficiaire: z.string().optional(),
        niveau: z.number().min(1, 'Niveau requis').max(5, 'Niveau maximum 5')
    })

    const open = defineModel<boolean>('open', { default: false })
    const toast = useToast()
    const paramsStore = useParametresStore()

    type Schema = z.output<typeof schema>

    const state = reactive<Partial<Schema>>({
        id: undefined,
        user_id: undefined,
        date_debut: undefined,
        date_fin: undefined,
        organisation_id: undefined,
        type_beneficiaire: undefined,
        niveau: undefined
    })

    const maxDate = new CalendarDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate())

    function relationId(value: string | { id: string } | null | undefined) {
        return typeof value === 'string' ? value : value?.id
    }

    function toDate(value: string | Date | null | undefined) {
        if (!value) return undefined
        const date = value instanceof Date
            ? new Date(value)
            : /^\d{4}-\d{2}-\d{2}$/.test(value)
                ? new Date(`${value}T00:00:00`)
                : new Date(value)
        return Number.isNaN(date.getTime()) ? undefined : date
    }

    watch(
        () => props.approbateur,
        (approbateur) => {
            state.id = approbateur?.id
            state.user_id = relationId(approbateur?.user_id)
            state.date_debut = toDate(approbateur?.date_debut)
            state.date_fin = toDate(approbateur?.date_fin)
            state.organisation_id = relationId(approbateur?.organisation_id)
            state.type_beneficiaire = relationId(approbateur?.type_beneficiaire)
            state.niveau = approbateur?.niveau
        },
        { immediate: true }
    )

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

    const profilItems = computed<SelectMenuItem[]>(() => (Profils || []).map((p: Profil) => ({
        label: `${p.email}`,
        id: p.id
    })))

    const organisationItems = computed<SelectMenuItem[]>(() => {
        const organisations = useOrganisationsStore().items || []
        return organisations.map((organisation: any) => ({
            label: `${organisation.nom}${organisation.code ? ` (${organisation.code})` : ''}`,
            id: organisation.id
        }))
    })

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        if (!props.approbateur?.id) return

        try {
            await paramsStore.updateApprobateur(event.data)

            toast.add({ title: 'Succès', description: `Approbateur mis à jour avec succès`, color: 'success' })
            emit('approbateur-updated')
            open.value = false
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        }
    }
</script>

<template>
    <UModal v-model:open="open" title="Modifier l'approbateur" description="Modifier les informations de l'approbateur">
        <UButton label="Modifier l'approbateur" icon="i-lucide-pencil" size="sm" variant="subtle"
            :disabled="!props.approbateur" />

        <template #body>
            <div v-if="props.matrice" class="mb-4 p-3 bg-elevated rounded-lg border border-default text-sm">
                <!-- <p class="text-(--ui-text-muted) flex items-center gap-2 mb-1">
                    <UIcon name="i-lucide-building" />
                    Organisation Parente
                </p> -->
                <p class="font-medium text-highlighted">
                    {{ props.matrice.nom }}
                    <span class="text-xs font-mono opacity-60 ml-1">({{ props.matrice.code || 'N/A' }})</span>
                </p>
            </div>

            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Utilisateur" name="user_id">
                    <USelectMenu v-model="state.user_id" class="w-full" value-key="id" :items="profilItems"
                        placeholder="Choisir un utilisateur" />
                </UFormField>
                <UFormField label="Organisation" name="organisation_id">
                    <USelectMenu v-model="state.organisation_id" class="w-full" value-key="id"
                        :items="organisationItems" placeholder="Choisir une organisation" />
                </UFormField>
                <UFormField label="Niveau" name="niveau">
                    <USelectMenu v-model="state.niveau" class="w-full" value-key="id" :items="[
                        { label: '1', id: 1 },
                        { label: '2', id: 2 },
                        { label: '3', id: 3 },
                        { label: '4', id: 4 },
                        { label: '5', id: 5 }
                    ]" placeholder="Choisir un niveau" />
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
                    <UButton label="Enregistrer" color="primary" variant="solid" type="submit" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
