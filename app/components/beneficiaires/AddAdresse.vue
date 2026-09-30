<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import { CalendarDate, getLocalTimeZone } from '@internationalized/date'
    import type { Beneficiaire, Organisation, Profil } from '~/types'
    import type { Matrice } from '~/types/organisation';

    const props = defineProps<{
        parent: Beneficiaire | null
    }>()
    const Profils = useProfilsStore().items;
    const emit = defineEmits(['adresse-added'])

    const schema = z.object({
        user_id: z.string().min(1, 'Utilisateur requis'),
        date_debut: z.date({ message: 'Date de début requise' }),
        date_fin: z.date().optional(),
        type_beneficiaire: z.string().optional(),
        niveau: z.number().min(1, 'Niveau requis').max(5, 'Niveau maximum 5')
    })

    const open = ref(false)
    const toast = useToast()
    const supabase = useSupabaseClient()
    const beneficiairesStore = useBeneficiairesStore()

    type Schema = z.output<typeof schema>

    const state = reactive<Partial<Schema>>({
        user_id: undefined,
        date_debut: new Date(),
        date_fin: undefined,
        type_beneficiaire: undefined,
        niveau: 1
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

    const profilItems = computed<SelectMenuItem[]>(() => (Profils || []).map((p: Profil) => ({
        label: `${p.email}`,
        id: p.id
    })))

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        if (!props.parent?.id) return

        try {
            await beneficiairesStore.createAdresse({
                ...event.data,
                beneficiaire_id: props.parent.id
            })

            toast.add({ title: 'Succès', description: `Adresse ajoutée avec succès`, color: 'success' })
            emit('adresse-added')
            open.value = false
            // Reset state
            state.user_id = undefined
            state.date_debut = new Date()
            state.date_fin = undefined
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        }
    }
</script>

<template>
    <UModal v-model:open="open" title="Attacher un utilisateur"
        description="Attacher un utilisateur à cette organisation">
        <UButton label="Attacher un utilisateur" icon="i-lucide-plus" size="sm" variant="subtle" />

        <template #body>
            <div v-if="props.parent" class="mb-4 p-3 bg-elevated rounded-lg border border-default text-sm">
                <!-- <p class="text-(--ui-text-muted) flex items-center gap-2 mb-1">
                    <UIcon name="i-lucide-building" />
                    Organisation Parente
                </p> -->
                <p class="font-medium text-highlighted">
                    {{ props.parent.nom }}
                    <span class="text-xs font-mono opacity-60 ml-1">({{ props.parent.code || 'N/A' }})</span>
                </p>
            </div>

            <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
                <UFormField label="Utilisateur" name="user_id">
                    <USelectMenu v-model="state.user_id" class="w-full" value-key="id" :items="profilItems"
                        placeholder="Choisir un utilisateur" />
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
                    <UButton label="Attacher" color="primary" variant="solid" type="submit" />
                </div>
            </UForm>
        </template>
    </UModal>
</template>
