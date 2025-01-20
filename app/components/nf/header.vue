<script setup lang="ts">
  import { z } from 'zod'
  import { ref } from 'vue'
  import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date'
  import { CalendarIcon } from '@radix-icons/vue'
  import { format } from 'date-fns'
  import { Calendar } from '@/components/ui/calendar'
  import { cn } from '@/lib/utils'
  import { Button } from '@/components/ui/button'
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

  import type { FormSubmitEvent } from '#ui/types'
  import type { Beneficiaire } from '~/types'

  const emit = defineEmits(['submit-result'])
  const { getEmployes } = useStoreGeneral()
  const df = new DateFormatter('fr-FR', {
    dateStyle: 'long',
  })
  let supabase = useSupabaseClient()
  let supabaseUser = useSupabaseUser()
  const { signIn } = useStoreAuth()
  const { addNF } = useStoreNF()
  const form = ref()
  const toast = useToast()
  const _orgs = [{ name: 'APR', value: 14 }]
  const _cr = [{ name: 'SUE', value: 18 }]
  const _categories = [{ name: 'Employé', value: 13 }]
  const _type_budget = [
    { name: "BA - Budget d'activité", value: 1 },
    { name: 'TR - Budget Trésorerie', value: 1 },
  ]
  const _devises = [
    { name: 'USD', value: 'USD' },
    { name: 'CDF', value: 'CDF' },
    { name: 'ZAR', value: 'ZAR' },
  ]
  const _payment_group = [
    { name: 'PGF', value: 1 },
    { name: 'TRO', value: 2 },
    { name: 'TRC', value: 3 },
  ]
  const isCommOpen = ref(false)
  const _natureOP = [{ name: 'Mission', value: 1 }]
  const state = reactive({
    crg_id: undefined,
    org_id: undefined,
    cr_id: undefined,
    beneficiaire_id: undefined,
    type_budget: undefined,
    categorie_id: undefined,
    description:
      'Irure excepteur voluptate aute incididunt cillum magna tempor elit velit Lorem do aute qui consequat. Proident do duis nulla nisi ut. Cupidatat duis reprehenderit commodo officia aliqua proident est esse non aliqua cupidatat',
    date_creation: new Date(),
    currency_code: 'CDF',
    nature_id: undefined,
    taux_echange: undefined,
    payment_group_id: 1,
  })
  const header_schema = z.object({
    crg_id: z.string().transform(v => Number(v)), // .min(1, 'Le crg demandeur doit etre un ID'),
    cr_id: z.string().transform(v => Number(v)), // .min(1, 'Le CR doit etre un ID'),
    org_id: z.string().transform(v => Number(v)), // .min(1, 'Vous devez indiquer le 1er approvateur'),
    beneficiaire_id: z.number().min(1, 'Vous devez indiquer un bénéficiaire'),
    type_budget: z.string().min(1, 'Vous devez indiquer le type de budget'),
    categorie_id: z.string().min(1, 'Vous devez indiquer la catégorie de note de frais'),
    description: z.string().min(2, 'Vous devez indiquer une description'),
    currency_code: z.string().max(3, 'Vous devez indiquer une devise'),
    nature_id: z.string().min(1, 'Vous devez indiquer une nature de note de frais'),
    taux_echange: z.number().min(1, 'Must be at least 1'),
    date_creation: z.custom<DateValue>(() => true),
    payment_group_id: z.string(),
  })
  const _employes = getEmployes.reduce((acc, emp) => {
    acc.push({
      ...emp,
      label: emp.name,
      click: () => {
        isCommOpen.value = false
      },
    })
    return acc
  }, [] as any[])
  // const _employes = [
  //   {
  //     id: 1,
  //     label: 'Wade Cooper',
  //     click: () => {
  //       isCommOpen.value = false
  //     },
  //   },
  //   {
  //     id: 2,
  //     label: 'Arlene Mccoy',
  //     click: () => {
  //       isCommOpen.value = false
  //     },
  //   },
  //   {
  //     id: 3,
  //     label: 'Devon Webb',
  //     click: () => {
  //       isCommOpen.value = false
  //     },
  //   },
  //   {
  //     id: 4,
  //     label: 'Tom Cook',
  //     click: () => {
  //       isCommOpen.value = false
  //     },
  //   },
  //   {
  //     id: 5,
  //     label: 'Tanya Fox',
  //     click: () => {
  //       isCommOpen.value = false
  //     },
  //   },
  //   {
  //     id: 6,
  //     label: 'Hellen Schmidt',
  //     click: () => {
  //       isCommOpen.value = false
  //     },
  //   },
  //   {
  //     id: 7,
  //     label: 'Caroline Schultz',
  //     click: () => {
  //       isCommOpen.value = false
  //     },
  //   },
  //   {
  //     id: 8,
  //     label: 'Mason Heaney',
  //     click: () => {
  //       isCommOpen.value = false
  //     },
  //   },
  //   {
  //     id: 9,
  //     label: 'Claudie Smitham',
  //     click: () => {
  //       isCommOpen.value = false
  //     },
  //   },
  //   {
  //     id: 10,
  //     label: 'Emil Schaefer',
  //     click: () => {
  //       isCommOpen.value = false
  //     },
  //   },
  // ]
  const selectedEmp = ref(_employes[3])
  async function onSubmit(event: FormSubmitEvent<any>) {
    // form.value.clear()
    console.log({ data: event.data })
    // console.log('Current user on submit ', supabaseUser.value)
    try {
      const { data, error } = await supabase.from('nf_headers').insert([event.data]).select()
      console.log({ data }, { error })
      if (!error) {
        // toast.add({ icon: 'i-heroicons-check-circle', title: 'Congratulations !', description: 'Your note has been created !', color: 'green' })
        // addNF(data.value)
        emit('submit-result', { statut: 'success', data: data.value })
      } else {
        toast.add({ icon: 'i-heroicons-check-circle', title: 'Something went wrong !', description: 'Your note has not been created. ' + error.message, color: 'red' })
        emit('submit-result', { statut: 'failed', data: null })
      }
    } catch (err) {
      console.log({ err })
      if (err.statusCode === 422) {
        form.value.setErrors(
          err.data.errors.map(err => ({
            // Map validation errors to { path: string, message: string }
            message: err.message,
            path: err.path,
          }))
        )
      }
    }
  }
  function onSelectBeneficiaire(option) {
    state.beneficiaire_id = option.id
    option.click()
  }

  async function submitHeader() {
    await form.value?.submit()
  }

  defineExpose({
    submitHeader,
  })
</script>

<template>
  <UCard :ui="{ base: 'w-[75%]' }">
    <UForm ref="form" :state="state" :schema="header_schema" class="flex flex-col" @submit="onSubmit">
      {{ state }}
      <div class="flex flex-col space-y-3 grow">
        <UCard class="flex flex-row w-full grow">
          <div class="flex flex-row space-x-3 w-full grow">
            <UFormGroup label="CRG" name="crg_demandeur" class="grow flex-auto min-w-[200px]">
              <USelect v-model="state.crg_id" option-attribute="name" class="w-[200px]" color="gray" variant="outline" :options="_orgs" />
            </UFormGroup>
            <UFormGroup label="CR" name="cr_id" class="w-[200px]">
              <USelect v-model="state.cr_id" option-attribute="name" name="cr_id" color="gray" variant="outline" :options="_cr" />
            </UFormGroup>
            <UFormGroup label="1er Approbateur" name="org_id" class="w-[200px]">
              <USelect v-model="state.org_id" option-attribute="name" name="org_id" color="gray" variant="outline" :options="_orgs" />
            </UFormGroup>
            <UFormGroup label="Catégorie" name="categorie_id" class="mb-2 w-[200px]">
              <USelect v-model="state.categorie_id" option-attribute="name" name="categorie_id" color="gray" variant="outline" :options="_categories" />
            </UFormGroup>
          </div>
        </UCard>
        <UCard>
          <div class="flex flex-row w-full">
            <UFormGroup label="Beneficiaire" name="beneficiaire_id" class="mb-2 mr-3">
              <UButton icon="i-heroicons-user-circle-16-solid" :label="selectedEmp?.name" class="min-w-[200px]" variant="solid" @click="isCommOpen = true" />
              <UModal v-model="isCommOpen">
                <UCommandPalette v-model="selectedEmp" nullable :groups="[{ key: 'people', commands: _employes }]" @update:model-value="onSelectBeneficiaire" />
              </UModal>
            </UFormGroup>
            <UFormGroup label="Type Budget" name="type_budget" class="mb-2 w-[200px]">
              <USelect v-model="state.type_budget" option-attribute="name" name="type_budget" color="gray" variant="outline" :options="_type_budget" />
            </UFormGroup>
          </div>
        </UCard>
        <UCard class="w-full">
          <div class="flex flex-row space-x-3 w-full grow">
            <UFormGroup label="Devise" name="devise" class="w-[200px]">
              <USelect v-model="state.currency_code" option-attribute="name" color="gray" variant="outline" :options="_devises" />
            </UFormGroup>
            <UFormGroup label="Taux de change" name="taux_echange" class="w-[200px] z-0">
              <UInput v-model="state.taux_echange" type="number" placeholder="2875" icon="i-heroicons-currency-dollar-solid" variant="outline" color="gray" />
            </UFormGroup>
            <UFormGroup label="Nature NF" name="nature" class="w-[200px]">
              <USelect v-model="state.nature_id" option-attribute="name" color="gray" variant="outline" :options="_natureOP" />
            </UFormGroup>
            <UFormGroup label="Groupe de paiement" name="payment_group_id" class="w-[200px]">
              <USelect v-model="state.payment_group_id" option-attribute="name" color="gray" variant="outline" :options="_payment_group" />
            </UFormGroup>
            <UFormGroup label="Date de création" name="date_creation" class="w-[200px]">
              <!-- <Popover>
                <PopoverTrigger as-child>
                  <Button variant="outline" :class="cn('w-[280px] justify-start text-left font-normal', !state.date_creation && 'text-muted-foreground')">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ state.date_creation ? df.format(state.date_creation.toDate(getLocalTimeZone())) : 'Choisissez une date' }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar v-model="state.date_creation" initial-focus />
                </PopoverContent>
              </Popover> -->

              <UPopover :popper="{ placement: 'bottom-start' }">
                <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(state.date_creation, 'd MMM, yyy')" />
                <template #panel="{ close }">
                  <DatePicker v-model="state.date_creation" is-required @close="close" />
                </template>
              </UPopover>
            </UFormGroup>
          </div>
        </UCard>
        <UCard :ui="{ base: 'w-750px', body: { base: 'w-full', padding: 'px-4 py-5 sm:p-6' } }" class="flex flex-row w-750px ff">
          <div class="flex-grow">
            <UFormGroup size="lg" label="Description" name="description" class="mb-2 w-full">
              <UTextarea v-model="state.description" class="w-[100%]" variant="outline" color="gray" />
            </UFormGroup>
          </div>
        </UCard>
        <!-- <div class="flex flex-row-reverse">
                    <UButton type="submit" variant="soft" icon="i-heroicons-arrow-long-right-solid" :trailing="false">
                        Suivant
                    </UButton>
                </div> -->
      </div>
    </UForm>
  </UCard>
</template>
