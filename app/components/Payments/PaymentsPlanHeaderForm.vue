<template>
  <div class="p-0">
    <UForm :validate="validate" :validate-on="['submit']" :state="state" class="space-y-4 bg-slate-50 dark:bg-transparent" @submit="onSubmit">
      {{ state }}
      <UFormGroup label="Matrice" name="matrice">
        <USelectMenu
          v-model="state.matrice_id"
          searchable
          searchable-placeholder="Rechercher une matrice"
          icon="i-tabler-building-community"
          placeholder="Matrice"
          value-attribute="organisation_id"
          :options="matrices"
          option-attribute="name"
        />
      </UFormGroup>
      <UFormGroup label="CRG" name="organisation">
        <USelectMenu v-model="state.organisation_id" icon="i-tabler-building-community" :options="['BA', 'TR']" option-attribute="name" />
      </UFormGroup>
      <UFormGroup label="Groupe de paiement" name="payment_group_id" class="w-full">
        <USelectMenu v-model="state.payment_group_id" icon="i-material-symbols-universal-currency-alt" :options="['USD', 'CDF']" option-attribute="name" />
      </UFormGroup>
      <UFormGroup label="1er Approbateur" name="approbateur_id" class="w-full mr-2">
        <USelectMenu v-model="state.approbateur_id" icon="i-tabler-building-community" placeholder="Type budget" :options="['BA', 'TR']" option-attribute="name" />
      </UFormGroup>

      <div class="flex flex-row">
        <div class="flex grow w-[50%]">
          <UFormGroup label="Periode" name="periode" class="w-full mr-2">
            <USelectMenu v-model="state.periode" placeholder="Periode" :options="['2024']" option-attribute="name" />
          </UFormGroup>
        </div>
        <div class="flex grow w-[50%]">
          <UFormGroup label="Exercice" name="exercice" class="w-full mr-2">
            <USelectMenu v-model="state.exercice" placeholder="Periode" :options="['1', '2', '3', '4', '5', '6']" option-attribute="name" />
          </UFormGroup>
        </div>
      </div>
      <UFormGroup label="Description" name="DESCRIPTION_BUDGET">
        <UTextarea v-model="state.description" type="text" placeholder="" />
      </UFormGroup>

      <div class="flex justify-end gap-3 mt-auto">
        <UButton label="Annuler" color="red" variant="ghost" @click="emit('close')" />
        <UButton type="submit" label="Créer" color="black" />
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '#ui/types'

  const emit = defineEmits(['close'])
  const toast = useToast()
  let searchCRG = ''
  const storePayments = useStorePayments()
  const { getListCrg, getOrgs } = useStoreOrg()
  const { getMatrices: matrices } = useStoreGeneral()
  const state = reactive({
    matrice_id: undefined,
    description: undefined,
    payment_group_id: undefined,
    periode: undefined,
    exercice: undefined,
    approbateur_id: undefined,
    organisation_id: undefined,
  })
  const listCRG = computed(() => getOrgs)
  async function onSubmit(event: FormSubmitEvent<any>) {
    // Do something with data
    try {
      console.log(event.data)
      const result = await storePayments.addPaymentPlanHeader(event.data)
      if (!result) {
        toast.add({ title: "Creation d'un utilisateur ", description: 'Utilisateur creé avec succes', timeout: 5000 })
        emit('close')
      } else {
        toast.add({ title: "Creation d'un utilisateur ", description: "Utilisateur n'as pas pu etre enregistré " + result, timeout: 5000, color: 'red' })
      }
    } catch (error) {
      toast.add({ title: "Creation d'un utilisateur ", description: "Utilisateur n'as pas pu etre enregistré " + error.message, timeout: 5000, color: 'red' })
    }
  }
  const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.username) errors.push({ path: 'name', message: 'Please enter a username.' })
    if (!state.email) errors.push({ path: 'email', message: 'Please enter an email.' })
    return errors
  }
</script>
<style scoped></style>
