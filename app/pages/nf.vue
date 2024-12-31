<script lang="ts" setup>
  import { z } from 'zod'

  import type { User } from '~/types'

  const supabase = useSupabaseClient()
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
          console.log('Edit nf with ID = ', current_nf_header)
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
        label: 'Archive',
        icon: 'i-heroicons-archive-box-20-solid',
      },
      {
        label: 'Move',
        icon: 'i-heroicons-arrow-right-circle-20-solid',
      },
    ],
    [
      {
        label: 'Annuler',
        icon: 'mingcute-close-circle-fill',
        shortcuts: ['⌘', 'D'],
      },
    ],
  ]
  const defaultColumns = [
    {
      key: 'id',
      label: '#',
    },
    {
      key: 'beneficiaires',
      label: 'Bénéficiaire',
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      sortable: false,
    },
    {
      key: 'statut_approbation',
      label: "Statut d'approbation",
      sortable: true,
    },
    {
      key: 'statut_paiement',
      label: 'Statut de paiement',
    },
    {
      key: 'currency_code',
      label: 'Devise',
    },
    {
      key: 'montant_original',
      label: 'Montant total',
    },
    {
      key: 'montant_convertie',
      label: 'Montant converti',
    },
    {
      key: 'action',
      label: 'Action',
    },
  ]
  let current_nf_header = ref(null)
  const nf_headers = ref([])
  const employes = ref([])
  const supabase_user = useSupabaseUser()
  const steppersList = ref([
    { label: 'Header', key: 'header' },
    { label: 'Lines', key: 'lines' },
    { label: 'Resume', key: 'resume' },
    { label: 'Apercu', key: 'apercu' },
  ])
  const q = ref('')
  const sort = ref({ column: 'id', direction: 'asc' as const })
  const input = ref<{ input: HTMLInputElement }>()
  const selectedNF = ref<any[]>([])
  const selectedColumns = ref(defaultColumns)
  const selectedStatuses = ref([])
  const selectedLocations = ref([])
  const isNewUserModalOpen = ref(false)
  const headerCreated = ref(false)
  const beneficiaireModalOpen = ref(false)
  const submitingHeader = ref(false)
  const toast = useToast()
  const isCommOpen = ref(false)
  const _loadingForm = ref(false)
  const form = ref()
  const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))
  const query = computed(() => ({
    q: q.value,
    statuses: selectedStatuses.value,
    locations: selectedLocations.value,
    sort: sort.value.column,
    order: sort.value.direction,
  }))
  const { data: users } = await useFetch<User[]>('/api/users', {
    query,
    default: () => [],
  })


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

  defineShortcuts({
    '/': () => {
      input.value?.input?.focus()
    },
  })
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
  const isOpen = ref(false)
  const isOpen2 = ref(false)
  const isOpen3 = ref(false)
  const _employes = [
    {
      id: 1,
      label: 'Wade Cooper',
      click: () => {
        isOpen.value = false
      },
    },
    {
      id: 2,
      label: 'Arlene Mccoy',
      click: () => {
        isOpen.value = false
      },
    },
    {
      id: 3,
      label: 'Devon Webb',
      click: () => {
        isOpen.value = false
      },
    },
    {
      id: 4,
      label: 'Tom Cook',
      click: () => {
        isOpen.value = false
      },
    },
    {
      id: 5,
      label: 'Tanya Fox',
      click: () => {
        isOpen.value = false
      },
    },
    {
      id: 6,
      label: 'Hellen Schmidt',
      click: () => {
        isOpen.value = false
      },
    },
    {
      id: 7,
      label: 'Caroline Schultz',
      click: () => {
        isOpen.value = false
      },
    },
    {
      id: 8,
      label: 'Mason Heaney',
      click: () => {
        isOpen.value = false
      },
    },
    {
      id: 9,
      label: 'Claudie Smitham',
      click: () => {
        isOpen.value = false
      },
    },
    {
      id: 10,
      label: 'Emil Schaefer',
      click: () => {
        isOpen.value = false
      },
    },
  ]
  const childHeader = ref(null)
  const selectedTab = ref(0)
  const defaultLocations = users.value.reduce((acc, user) => {
    if (!acc.includes(user.location)) {
      acc.push(user.location)
    }
    return acc
  }, [] as string[])

  const defaultStatuses = users.value.reduce((acc, user) => {
    if (!acc.includes(user.status)) {
      acc.push(user.status)
    }
    return acc
  }, [] as string[])

  function onSelect(row) {
    console.log('ddddddddd ', row)
    current_nf_header.value = row
    // const index = selectedNF.value.findIndex(item => item.id === row.id)
    // if (index === -1) {
    //   selectedNF.value.push(row.nf_header_id)
    // } else {
    //   selectedNF.value.splice(index, 1)
    // }
  }
  function onSubmitResult({ statut, data }) {
    if (statut === 'success') {
      current_nf_header.value = data
      headerCreated.value = true
      toast.add({
        icon: 'i-heroicons-check-circle',
        title: 'Congratulations !',
        description: 'Your note has been created !',
        color: 'green',
      })
    } else {
      headerCreated.value = false
      toast.add({
        icon: 'i-heroicons-check-circle',
        title: 'Something went wrong !',
        description: 'Your note has not been created. ' + statut,
        color: 'red',
      })
    }
  }
  async function getAllNoteDeFrais() {
    const { data, error } = await supabase
      .from('nf_headers')
      .select(`nf_header_id, beneficiaires (id, name, code), description, statut_approbation, statut_paiement, devise, montant_original, montant_conversion`)

    // const { data, error } = await supabase.from('beneficiaires').select(`id, name, code`)

    if (error) {
      console.log({ error })
    } else {
      console.log({ data })
      nf_headers.value = data
    }
  }
  async function getEmployes() {
    const { data } = await supabase.from('employes').select()
    employes.value = data
  }
  function onSubmit(form) {
    console.log('Submitted form:', form)
    form.value?.submit()
  }
  function onSelectBeneficiaire(option) {
    state.beneficiaire_id = option.id
    beneficiaireModalOpen.value = false
  }
  function submitCurrentForm() {
    _loadingForm.value = true
    setTimeout(() => {
      _loadingForm.value = false
    }, 2000)
    if (selectedTab.value === 0) {
      childHeader.value?.submitHeader()
      console.log('The selected tab is: ' + items[selectedTab.value].key)
    } else {
      console.log('The tab is: ' + selectedTab.value)
      alert('Selected Tab is null')
    }
  }
  function onChange(index) {
    selectedTab.value = index
    // alert(`${items[index].label} was clicked!`)
  }
  async function uploadFile() {
    const fileInput = document.getElementById('file_annexe') as HTMLInputElement
    const file = fileInput?.files?.[0]
    if (!file) return
    
    const { data, error } = await supabase.storage.from('annexes').upload('file_path', file)
    if (error) {
      // Handle error
      console.log({ error })
    } else {
      console.log({ data })
      // Handle success
    }
  }
  function goNextTab(){
    console.log('Go next tab');
  }
  onMounted(() => {
    getEmployes()
    getAllNoteDeFrais()
  })
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Note de frais" :badge="users.length">
        <template #right>
          <USlideover v-model="isOpen3" :ui="{ width: 'min-w-[90%]' }" prevent-close>
            <UCard
              class="flex flex-col flex-1 overflow-y-auto"
              :ui="{
                body: { base: 'flex-1' },
                ring: '',
                divide: 'divide-y divide-gray-100 dark:divide-gray-800',
              }"
            >
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Note de frais</h3>
                  <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isOpen3 = false" />
                </div>
              </template>
              <div class="scrollbar">
                <UTabs v-model="selectedTab" :items="items" class="w-full" @change="onChange">
                  <!-- <template #default="{ item, index, selected }">
                    <div class="flex items-center gap-2 relative truncate">
                      <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

                      <span class="truncate">{{ index + 1 }}. {{ item.label }}</span>

                      <span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                    </div>
                  </template> -->
                  <template #item="{ item }">
                    <!-- {{ item }} -->
                    <StepperSlide v-model="selectedTab" :steppers="steppersList" />
                    {{ current_nf_header }}
                    <div class="flex flex-row space-x-4 p-0">
                      <NfHeader v-if="item.key === 'header'" ref="childHeader" @submit-result="onSubmitResult" />
                      <NfLines v-else-if="item.key === 'lines'" />
                      <NfResume v-else-if="item.key === 'resume'" />
                      <NfApercu v-else-if="item.key === 'apercu'" />

                      <UCard :ui="{ base: 'w-[25%]' }">
                        <template #header>
                          <p v-if="item.key === 'header'">Annexes</p>
                          <!-- <div></div> -->
                        </template>
                        <ol class="list-decimal pl-5">
                          <!-- <li v-for="(file, index) in itemsFiles" :key="index" class="flex items-start space-x-2 mb-2">
                            <UIcon :name="item.icon" class="w-9 h-9 flex-shrink-0 self-center" />
                            <div>
                              <p class="font-medium">{{ file.filename }}</p>
                              <p class="text-sm text-gray-500">{{ item.description }}</p>
                            </div>
                          </li> -->
                        </ol>
                        <template #footer>
                          <div v-if="item.key === 'header'">
                            <UInput id="file_annexe" type="file" size="2xs" icon="i-heroicons-folder" />
                          </div>
                          <UButton :loading="false" @click="uploadFile">Charger</UButton>
                        </template>
                      </UCard>
                    </div>
                  </template>
                </UTabs>
              </div>

              <template #footer>
                <div class="flex flex-row-reverse">
                  <UButton v-if="headerCreated" color="primary" variant="soft" icon="i-heroicons-arrow-long-right-solid" :trailing="false" @click="goNextTab">Suivant</UButton>
                  <UButton v-else color="primary" variant="soft" icon="heroicons:document-plus-20-solid" :trailing="false" :loading="_loadingForm" @click="submitCurrentForm">Créer</UButton>
                </div>
              </template>
            </UCard>
          </USlideover>
          <!-- <UButton label="Note de frais 2" leading-icon="i-heroicons-plus" color="gray" @click="isOpen2 = true" /> -->
          <UModal v-model="isOpen2" fullscreen>
            <UCard
              :ui="{
                base: 'h-full flex flex-col',
                rounded: '',
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

              <UTabs :items="items" class="w-full">
                <template #default="{ item, index, selected }">
                  <div class="flex items-center gap-2 truncate sticky">
                    <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

                    <span class="truncate">{{ index + 1 }}. {{ item.label }}</span>

                    <span v-if="selected" class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                  </div>
                </template>
                <template #item="{ item }">
                  <!-- {{ item }} -->
                  <div class="flex flex-row space-x-4 p-0">
                    <NfHeader v-if="item.key === 'header'" />
                    <NfLines v-else-if="item.key === 'lines'" />
                    <NfResume v-else-if="item.key === 'resume'" />
                    <NfApercu v-else-if="item.key === 'apercu'" />

                    <UCard :ui="{ base: 'w-[25%]' }">test</UCard>
                  </div>
                </template>
              </UTabs>
            </UCard>
          </UModal>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <USelectMenu v-model="selectedStatuses" icon="i-heroicons-check-circle" placeholder="Status" multiple :options="defaultStatuses" :ui-menu="{ option: { base: 'capitalize' } }" />
          <USelectMenu v-model="selectedLocations" icon="i-heroicons-map-pin" placeholder="Location" :options="defaultLocations" multiple />
          <USelectMenu v-model="selectedColumns" icon="i-heroicons-adjustments-horizontal-solid" :options="defaultColumns" multiple class="hidden lg:block">
            <template #label>Display</template>
          </USelectMenu>
        </template>
        <template #right>
          <UButton label="Nouvelle note de frais" leading-icon="i-heroicons-plus" color="gray" @click="isOpen3 = true" />
        </template>
      </UDashboardToolbar>
      current_nf_header = {{ current_nf_header }}
      <UTable
        v-model:sort="sort"
        :rows="nf_headers"
        :columns="columns"
        sort-mode="manual"
        class="w-[97%] self-center rounded-sm border border-gray-200 dark:border-gray-700 top-1"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      >
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar v-bind="row.avatar" :alt="row.name" size="xs" />

            <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
          </div>
        </template>
        <template #action-data="{ row }">
          <UDropdown :items="dropdownItems" :popper="{ placement: 'bottom-start' }" @click="onSelect(row)">
            <!-- {{ row }} -->
            <UButton color="white" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" variant="solid" />
          </UDropdown>
        </template>

        <template #status_approbation-data="{ row }">
          <UBadge
            :label="row.status_approbation"
            :color="row.status_approbation === 'En cours' ? 'green' : row.status === 'Non soumis' ? 'blue' : 'red'"
            variant="subtle"
            class="capitalize"
          />
        </template>
        <template #beneficiaires-data="{ row }">{{ row.beneficiaires.code }} - {{ row.beneficiaires.name }}</template>
      </UTable>
    </UDashboardPanel>
  </UDashboardPage>
</template>
