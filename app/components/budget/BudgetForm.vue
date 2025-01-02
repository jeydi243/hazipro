<template>
  <div class=" p-0 bg-slate-50">
    <UForm :validate="validate" :validate-on="['submit']" :state="state" class="space-y-4 bg-slate-50 dark:bg-transparent" @submit="onSubmit">
      {{ state }}
      <UFormGroup label="CRG Gerant" name="CRG_GERANT">
        <USelectMenu
          v-model="state.CRG_GERANT"
          searchable
          searchable-placeholder="Choisir un CRG"
          icon="i-tabler-building-community"
          placeholder="CRG Gerant"
          value-attribute="organisation_id"
          :options="listCRG"
          option-attribute="name"
        />
      </UFormGroup>

      <div class="flex flex-row">
        <div class="flex grow w-[50%]">
          <UFormGroup label="Type budget" name="TYPE_BUDGET" class="w-full mr-2">
            <USelectMenu v-model="state.TYPE_BUDGET" icon="i-tabler-building-community" placeholder="Type budget" :options="['BA', 'TR']" option-attribute="name" />
          </UFormGroup>
        </div>
        <div class="flex grow w-[50%]">
          <UFormGroup label="Devise" name="CURRENCY_CODE" class="w-full">
            <USelectMenu v-model="state.CURRENCY_CODE" icon="i-material-symbols-universal-currency-alt" placeholder="Devise" :options="['USD', 'CDF']" option-attribute="name" />
          </UFormGroup>
        </div>
      </div>

      <div class="flex flex-row">
        <div class="flex grow w-[50%]">
          <UFormGroup label="Code Budget" name="CODE_BUDGET" class="w-full mr-2">
            <USelectMenu v-model="state.CODE_BUDGET" placeholder="Code" :options="['2024', '2025']" option-attribute="name" />
          </UFormGroup>
        </div>
        <div class="flex grow w-[50%]">
          <UFormGroup label="Compte Budgetaire" name="COMPTE_BUDGETAIRE" class="w-full">
            <UInput v-model="state.COMPTE_BUDGETAIRE" type="number" placeholder="" />
          </UFormGroup>
        </div>
      </div>

      <UFormGroup label="Description" name="DESCRIPTION_BUDGET">
        <UInput v-model="state.DESCRIPTION_BUDGET" type="text" placeholder="" />
      </UFormGroup>

      <div class="flex flex-row">
        <div class="flex grow w-[50%]">
          <UFormGroup label="Année" name="BUDGET_YEAR" class="w-full mr-2">
            <USelectMenu v-model="state.BUDGET_YEAR" placeholder="Devise" :options="['2024', '2025']" option-attribute="name" />
          </UFormGroup>
        </div>
        <div class="flex grow w-[50%]">
          <UFormGroup label="Periode" name="periode" class="w-full mr-2">
            <UInput v-model="state.BUDGET_PERIOD" type="number" placeholder="" />
          </UFormGroup>
        </div>
      </div>

      <UFormGroup label="Montant de la ligne" name="password">
        <UInput v-model="state.BUDGET_LINE_AMOUNT" />
      </UFormGroup>
      <UFormGroup label="Budget Code ID" name="password">
        <UInput v-model="state.BUDGET_CODE_ID" />
      </UFormGroup>
      <UFormGroup label="Valeur de la ligne" name="password" class="mb-auto">
        <UInput v-model="state.VALUE_QTY" />
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
  const storeBudget = useStoreBudget()
  const { getListCrg, getOrgs } = useStoreOrg()
  const state = reactive({
    CRG_GERANT: undefined,
    BUDGET_LINE_ID: undefined,
    BUDGET_LINE_AMOUNT: undefined,
    BUDGET_REQUEST_AMOUNT: undefined,
    STANDARD_COST: undefined,
    VALUE_QTY: undefined,
    BUDGET_PERIOD: undefined,
    BUDGET_YEAR: undefined,
    CRG_EMETTEUR: undefined,
    DESCRIPTION_BUDGET: undefined,
    TYPE_BUDGET: undefined,
    VERSION: undefined,
    CURRENCY_CODE: undefined,
    CATEG_BUDGET: undefined,
    CODE_BUDGET: undefined,
    COMPTE_BUDGETAIRE: undefined,
    BUDGET_CODE_ID: undefined,
  })
  const listCRG = computed(() => getOrgs)
  async function onSubmit(event: FormSubmitEvent<any>) {
    // Do something with data
    try {
      console.log(event.data)
      const result = await storeBudget.updateBudgetLine(state.BUDGET_LINE_ID, event.data)
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
