<script setup lang="ts">
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from '@internationalized/date'
import { CalendarIcon } from '@radix-icons/vue'
import { Calendar } from '@/components/ui/calendar'
import type { FormError, FormSubmitEvent } from '#ui/types'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const toast = useToast()
const emit = defineEmits(['close'])
const isCommOpen = ref(false)
const df = new DateFormatter('fr-FR', {
  dateStyle: 'long',
})

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})
const _orgs = [
  { id: 1, label: 'Filiale de la maison', click: () => { isCommOpen.value = false } },
  { id: 2, label: 'Arlene Mccoy', click: () => { isCommOpen.value = false } },
  { id: 3, label: 'Devon Webb', click: () => { isCommOpen.value = false } },
  { id: 4, label: 'Tom Cook', click: () => { isCommOpen.value = false } },
]
const state = reactive({
  org_id: undefined,
  user_id: props.user.id,
  user: props.user.email,
  date_debut: undefined,
  employee_id: _orgs[1].id
})

const selectedOrg = ref(_orgs[1])
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ path: 'name', message: 'Please enter a username.' })
  if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
  return errors
}
const store = useAuth()
const storeOrg = useOrg()

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  try {
    console.log(event.data)
    const result = await storeOrg.assign_to_org(event.data)
    if (!result.error) {
      toast.add({ title: "Affectation organisation ", description: "Utilisateur affecté à l'organisation", timeout: 5000 })
      emit('close')
    } else {
      toast.add({ title: "Affectation organisation ", description: "Utilisateur n'as pas pu etre affecté " + result.error.message, timeout: 5000, color: 'red' })
    }
  } catch (error) {
    toast.add({ title: "Affectation organisation ", description: "Utilisateur n'as pas pu etre affecté " + error.message, timeout: 5000, color: 'red' })
  }
}
function onSelectOrg(option) {
  state.org_id = option.id
  option.click()
}
</script>

<template>
  <UForm :validate="validate" :validate-on="['submit']" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="User" name="user">
      <UInput v-model="state.user" autofocus />
    </UFormGroup>
    <UFormGroup label="Organisation" name="org_id" class=" mb-2">
      <UButton icon="i-heroicons-user-circle-16-solid" :label="selectedOrg.label" class="w-[100%]" variant="ghost"
        @click="isCommOpen = true" />
      <UModal v-model="isCommOpen">
        <UCommandPalette v-model="selectedOrg" nullable :groups="[{ key: 'people', commands: _orgs }]"
          @update:model-value="onSelectOrg" />
      </UModal>
    </UFormGroup>
    <UFormGroup label="Date de création" name="date_creation" class="w-[200px]">
      <Popover>
        <PopoverTrigger as-child>
          <Button variant="outline" :class="cn(
            'w-[280px] justify-start text-left font-normal',
            !state.date_debut && 'text-muted-foreground'
          )">
            <CalendarIcon class="mr-2 h-4 w-4" />
            {{ state.date_debut ?
              df.format(state.date_debut.toDate(getLocalTimeZone())) :
              "Choisissez une date" }}
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0">
          <Calendar v-model="state.date_debut" initial-focus />
        </PopoverContent>
      </Popover>
    </UFormGroup>


    <div class="flex justify-end gap-3">
      <UButton label="Annuler" color="red" variant="ghost" @click="emit('close')" />
      <UButton type="submit" label="Affecter" color="black" />
    </div>
  </UForm>
</template>
