<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'

const toast = useToast()
const emit = defineEmits(['close'])
const isCommOpen = ref(false)

const _employes = [
  { id: 1, label: 'Wade Cooper', click: () => { isCommOpen.value = false } },
  { id: 2, label: 'Arlene Mccoy', click: () => { isCommOpen.value = false } },
  { id: 3, label: 'Devon Webb', click: () => { isCommOpen.value = false } },
  { id: 4, label: 'Tom Cook', click: () => { isCommOpen.value = false } },
  { id: 5, label: 'Tanya Fox', click: () => { isCommOpen.value = false } },
  { id: 6, label: 'Hellen Schmidt', click: () => { isCommOpen.value = false } },
  { id: 7, label: 'Caroline Schultz', click: () => { isCommOpen.value = false } },
  { id: 8, label: 'Mason Heaney', click: () => { isCommOpen.value = false } },
  { id: 9, label: 'Claudie Smitham', click: () => { isCommOpen.value = false } },
  { id: 10, label: 'Emil Schaefer', click: () => { isCommOpen.value = false } }
]
const state = reactive({
  username: undefined,
  email: undefined,
  password: undefined,
  password_confirmation: undefined,
  employee_id: _employes[2].id
})

const selectedEmp = ref(_employes[2])
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.username) errors.push({ path: 'name', message: 'Please enter a username.' })
  if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
  return errors
}
const store = useAuth()

async function onSubmit(event: FormSubmitEvent<any>) {
  // Do something with data
  try {
    console.log(event.data)
    const result = await store.createUser(event.data)
    if (!result.error) {
      toast.add({ title: "Creation d'un utilisateur ", description: "Utilisateur creé avec succes", timeout: 5000 })
      emit('close')
    } else {
      toast.add({ title: "Creation d'un utilisateur ", description: "Utilisateur n'as pas pu etre enregistré " + result.error.message, timeout: 5000, color: 'red' })
    }
  } catch (error) {
    toast.add({ title: "Creation d'un utilisateur ", description: "Utilisateur n'as pas pu etre enregistré " + error.message, timeout: 5000, color: 'red' })
  }
}
function onSelectBeneficiaire(option) {
  state.employee_id = option.id
  option.click()
}
</script>

<template>
  <UForm :validate="validate" :validate-on="['submit']" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Nom d'utilisateur" name="username">
      <UInput v-model="state.username" placeholder="John Doe" autofocus />
    </UFormGroup>
    <UFormGroup label="Mot de passe" name="password">
      <UInput v-model="state.password" placeholder="**********" autofocus />
    </UFormGroup>
    <UFormGroup label="Confirmation mot de passe" name="password_confirmation">
      <UInput v-model="state.password_confirmation" placeholder="**********" autofocus />
    </UFormGroup>

    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" type="email" placeholder="john.doe@example.com" />
    </UFormGroup>
    <UFormGroup label="Employé" name="employe_id" class=" mb-2">
      <UButton icon="i-heroicons-user-circle-16-solid" :label="selectedEmp.label" class="w-[100%]" variant="ghost"
        @click="isCommOpen = true" />
      <UModal v-model="isCommOpen">
        <UCommandPalette v-model="selectedEmp" nullable :groups="[{ key: 'people', commands: _employes }]"
          @update:model-value="onSelectBeneficiaire" />
      </UModal>
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton label="Annuler" color="red" variant="ghost" @click="emit('close')" />
      <UButton type="submit" label="Créer" color="black" />
    </div>
  </UForm>
</template>
