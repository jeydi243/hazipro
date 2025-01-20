<template>
  <UDashboardPage>
    <UDashboardPanel grow class="bg-slate-50 dark:bg-transparent">
      <UDashboardNavbar title="Plan de decaissement" :badge="33">
        <template #right>
          <UModal v-model="isOpen2" fullscreen>
            <UCard
              :ui="{
                base: 'h-full flex flex-col',
                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                body: {
                  base: 'grow',
                },
              }"
            >
              <template #header>
                <div class="flex items-center justify-between sticky">
                  <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Modal</h3>
                  <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen2 = false" />
                </div>
              </template>
              Au milieu
            </UCard>
          </UModal>
        </template>
      </UDashboardNavbar>

      <UDashboardSlideover
        v-model="openPlanDecaissement"
        :ui="{
          overlay: {
            base: 'fixed inset-0 transition-opacity',
            background: 'bg-gray-500/75 dark:bg-gray-800/75',
          },
          body: {
            base: 'flex-1 overflow-y-auto ',
          },
        }"
        title="Plan de decaissement"
      >
        <PaymentsPlanHeaderForm />
      </UDashboardSlideover>

      <UDashboardToolbar>
        <template #left>
          <USelectMenu
            v-model="selectedPaymentsGroup"
            icon="i-heroicons-check-circle"
            placeholder="Groupe de paiement"
            multiple
            :options="defaultComptes"
            :ui-menu="{ option: { base: 'capitalize' } }"
          />
          <USelectMenu v-model="selectedYear" searchable icon="i-heroicons-map-pin" placeholder="Année" :options="defaultYears" multiple />
          <USelectMenu v-model="selectedColumns" searchable icon="i-heroicons-adjustments-horizontal-solid" :options="defaultColumns" multiple class="hidden lg:block">
            <template #label>Colonnes</template>
          </USelectMenu>
        </template>
        <template #right>
          <UButton label="Nouveau Plan" leading-icon="i-heroicons-plus" color="gray" @click="openPlanDecaissement = !openPlanDecaissement" />
        </template>
      </UDashboardToolbar>
      <UTable
        v-model:sort="sort"
        :rows="payment_plan_headers"
        :columns="columns"
        sort-mode="manual"
        class="w-[97%] self-center rounded-sm border border-gray-200 dark:border-gray-700 top-1 bg-white dark:bg-transparent"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      >
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar v-bind="row.avatar" :alt="row.name" size="xs" />

            <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
          </div>
        </template>
        <template #id-data="{ row }">
          <UButton :id="row" color="white" label="Ouvrir" variant="solid" @click="openOnePlan(row.pp_header_id)" />
        </template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script lang="ts" setup>
  import type { User } from '~/types'

  const dropdownItems = [
    {
      label: 'Initiateur',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/739984?v=4',
      },
    },
    [
      {
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        shortcuts: ['E'],
        click: () => {
          console.log('Edit nf with ID = ')
        },
      },
      {
        label: 'Duplicate',
        icon: 'i-heroicons-document-duplicate-20-solid',
        shortcuts: ['D'],
        disabled: true,
      },
    ],
    [
      {
        label: 'Annuler',
        icon: 'mingcute-close-circle-fill',
        shortcuts: ['⌘', 'D'],
      },
    ],
  ] as any[]
  const defaultColumns = [
    {
      key: 'id',
      label: '#',
    },
    {
      key: 'code',
      label: 'Code',
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
    },
    {
      key: 'periode',
      label: 'Periode',
      sortable: true,
    },
    {
      key: 'exercice',
      label: 'Exercice',
      sortable: true,
    },
    {
      key: 'matrice_id',
      label: 'Matrice',
      sortable: true,
    },
    {
      key: 'statut_approbation',
      label: 'Statut approbation',
      sortable: true,
    },
    {
      key: 'action',
      label: 'Action',
    },
  ]

  const toast = useToast()
  const sort = ref({ column: 'id', direction: 'asc' as const })
  const input = ref<{ input: HTMLInputElement }>()
  const selectedColumns = ref(defaultColumns)
  const selectedPaymentsGroup = ref([])
  const selectedYear = ref([])
  const { payment_plan_headers } = useStorePayments()
  const openPlanDecaissement = ref(false)
  const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

  const state = reactive({
    crg_demandeur: undefined,
    org_id: undefined,
    beneficiaire_id: undefined,
    type_budget: undefined,
    categorie: undefined,
    description: undefined,
    date_creation: undefined,
    devise: undefined,
    taux: undefined,
  })

  const router = useRouter()
  const items = [
    {
      key: 'header',
      label: 'Header',
      icon: 'i-heroicons-information-circle',
      description: "Make changes to your account here. Click save when you're done.",
    },
    {
      key: 'lines',
      label: 'Lines',
      icon: 'i-heroicons-information-circle',
      description: "Change your password here. After saving, you'll be logged out.",
    },
    {
      key: 'resume',
      label: 'Resume',
      icon: 'i-heroicons-information-circle',
      description: "Change your password here. After saving, you'll be logged out.",
    },
    {
      key: 'apercu',
      icon: 'i-heroicons-information-circle',
      label: 'Apercu',
      description: "Change your password here. After saving, you'll be logged out.",
    },
  ]
  const isOpen2 = ref(false)
  const isOpen3 = ref(false)
  const childHeader = ref(null)
  const defaultYears = payment_plan_headers.reduce((acc, budget) => {
    if (!acc.includes(budget.BUDGET_YEAR)) {
      acc.push(budget.BUDGET_YEAR)
    }
    return acc
  }, [] as string[])

  const defaultComptes = payment_plan_headers.reduce((acc, budget) => {
    if (!acc.includes(budget.COMPTE_BUDGETAIRE)) {
      acc.push(budget.COMPTE_BUDGETAIRE)
    }
    return acc
  }, [] as string[])

  function onSelect(row) {
    console.log('ddddddddd ', row)
  }
  function openOnePlan(pp_header_id) {
    if (pp_header_id) router.push('/plan_decaissement/' + pp_header_id)
  }
  function onSubmit(form) {
    console.log('Submitted form:', form)
    form.value?.submit()
  }
  function submitCurrentForm() {
    childHeader.value?.submitHeader()
  }
  //   onMounted(() => {
  //     getEmployes()
  //     getAllNoteDeFrais()
  //   })
</script>

<style scoped></style>
