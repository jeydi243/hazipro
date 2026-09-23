<script setup lang="ts">
    import * as z from 'zod'
    import type { FormSubmitEvent, SelectMenuItem } from '@nuxt/ui'
    import { CalendarDate, getLocalTimeZone } from '@internationalized/date'
    import type { Profil } from '~/types'
    import type { Matrice } from '~/types/organisation';

    const props = defineProps<{
        parent: Matrice | null
    }>()

    const emit = defineEmits(['approbateur-added'])

    const schema = z.object({
        matrice_id: z.string().min(1, 'Matrice requise'),
        user_id: z.string().min(1, 'Utilisateur requis'),
        niveau: z.number().min(1, 'Niveau requis').max(10, 'Niveau maximum 10'),
        date_debut: z.date({ message: 'Date de début requise' }),
        date_fin: z.date().optional()
    })

    const open = ref(false)
    const toast = useToast()
    const parametresStore = useParametresStore()

    type Schema = z.output<typeof schema>

    const state = reactive<Partial<Schema>>({
        matrice_id: props.parent?.id,
        user_id: props.parent?.id ? undefined : undefined,
        niveau: 1,
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

    const { items: profils } = storeToRefs(useProfilsStore())

    const profilItems = computed<SelectMenuItem[]>(() => profils.value?.map((p: Profil) => ({
        label: !p.email ? `${p.nom} ${p.prenom} ${p.postnom || ''}` : p.email,
        id: p.id
    })) || [])

    async function onSubmit(event: FormSubmitEvent<Schema>) {
        if (!props.parent?.id) return

        try {
            await parametresStore.ajouterApprobateur({
                user_id: event.data.user_id,
                matrice_id: props.parent.id,
                niveau: event.data.niveau,
                date_debut: event.data.date_debut,
                date_fin: event.data.date_fin
            })
            toast.add({ title: 'Succès', description: `Approbateur ajouté avec succès`, color: 'success' })
            emit('approbateur-added')
            open.value = false
            // Reset state
            state.user_id = undefined
            state.date_debut = undefined
            state.date_fin = undefined
        } catch (err: any) {
            toast.add({ title: 'Erreur', description: err.message, color: 'error' })
        }
    }
</script>

<template>
    <UModal v-model:open="open" title="Ajouter un approbateur" description="Ajouter un approbateur à cette matrice">
        <UButton label="Ajouter un approbateur" icon="i-lucide-plus" size="sm" variant="subtle" />

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
                    <UInputNumber v-model="state.niveau" class="w-full" />
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
