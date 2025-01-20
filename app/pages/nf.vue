<script lang="ts" setup>
  import { VuePDF, usePDF } from '@tato30/vue-pdf'

  const { pdf } = usePDF('https://www.iris-france.org/wp-content/uploads/2021/04/Cycle-de-conf%C3%A9rence-Comprendre-le-monde.pdf')
  useHead({
    title: 'Note de frais',
  })
  const supabase = useSupabaseClient()
  const supabase_user = useSupabaseUser()
  const dropdownItems = [
    {
      label: 'Initiateur',
      avatar: {
        src: 'https://avatars.githubusercontent.com/u/739984?v=4',
      },
    },
    [
      {
        label: 'Editer',
        icon: 'i-heroicons-pencil-square-20-solid',
        shortcuts: ['E'],
        click: () => {
          console.log('Editer nf with ID = ', current_nf_header.value.nf_header_id)
        },
      },
      {
        label: 'Apercu',
        icon: 'i-heroicons-document-duplicate-20-solid',
        shortcuts: ['A'],
        click: () => {
          console.log('Apercu clicked for ', current_nf_header.value.nf_header_id)
        },
      },
      {
        label: 'Historique',
        icon: 'i-heroicons-document-duplicate-20-solid',
        shortcuts: ['H'],
        click: () => {
          console.log('Historique clicked for ', current_nf_header.value.nf_header_id)
        },
      },
      {
        label: 'Annexes',
        icon: 'i-vscode-icons:file-type-pdf2',
        shortcuts: ['N'],
        click: () => {
          console.log('Annexes clicked for ', current_nf_header.value.nf_header_id)
          openAnnexes.value = !openAnnexes.value
        },
      },
    ],
    [
      {
        label: 'Annuler',
        icon: 'mingcute-close-circle-fill',
        shortcuts: ['⌘', 'D'],
        class: 'bg-red-500 text-white',
        click: () => {
          console.log('Annuler clicked for ', current_nf_header.value.nf_header_id)
        },
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
      rowClass: '',
      class: 'text-ellipsis',
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
  const { defaultStatutApprobation, defaultStatutPaiement, defaultStatutPlannification, defaultStatutProgammation } = useStoreNF()
  const steppersList = ref([
    { label: 'Header', key: 'header' },
    { label: 'Lines', key: 'lines' },
    { label: 'Resume', key: 'resume' },
    { label: 'Apercu', key: 'apercu' },
  ])
  const sort = ref({ column: 'id', direction: 'asc' as const })
  const input = ref<{ input: HTMLInputElement }>()
  const selectedColumns = ref(defaultColumns)
  const selectedStatusApprobation = ref([])
  const selectedStatusPaiement = ref([])
  const selectedStatusPlannification = ref([])
  const selectedStatusProgrammation = ref([])
  const openAnnexes = ref(false)
  const openApercu = ref(false)
  const headerCreated = ref(false)
  const beneficiaireModalOpen = ref(false)
  const toast = useToast()
  const openViewer = ref(false)
  const _loadingForm = ref(false)
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

  const isOpen3 = ref(false)
  const childHeader = ref(null)
  const selectedTab = ref(0)

  function onSelect(row) {
    console.log('onSelect ', row)
    current_nf_header.value = row
  }
  function onSubmitResult({ statut, data }) {
    if (statut === 'success') {
      current_nf_header.value = data
      headerCreated.value = true
      console.log(data)
      toast.add({
        icon: 'i-heroicons-check-circle',
        title: 'Congratulations !',
        description: 'Your note has been created !',
        color: 'green',
      })
    } else {
      headerCreated.value = false
      console.log(statut)
      toast.add({
        icon: 'i-heroicons-check-circle',
        title: 'Something went wrong !',
        description: 'Your note has not been created. ' + statut,
        color: 'red',
      })
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
      // console.log('The selected tab is: ' + items[selectedTab.value].key)
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
  function goNextTab() {
    console.log('Go next tab')
  }
  onMounted(() => {
    getEmployes()
  })
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow class="bg-slate-50 dark:bg-transparent">
      <UDashboardNavbar title="Note de frais" :badge="37">
        <template #right></template>
      </UDashboardNavbar>

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

          <div class="scrollbar h-full w-full grow">
            <StepperSlide v-model="selectedTab" :steppers="steppersList" />
            {{ current_nf_header }}
            <div class="flex flex-row space-x-4 p-0 h-full">
              <NfHeader v-if="steppersList[selectedTab].key === 'header'" ref="childHeader" @submit-result="onSubmitResult" />
              <NfLines v-else-if="steppersList[selectedTab].key === 'lines'" />
              <NfResume v-else-if="steppersList[selectedTab].key === 'resume'" />
              <NfApercu v-else-if="steppersList[selectedTab].key === 'apercu'" class="h-full" />

              <UCard :ui="{ base: 'w-[25%]' }">
                <template #header>
                  <p v-if="steppersList[selectedTab].key === 'header'">Annexes</p>
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
                  <div v-if="steppersList[selectedTab].key === 'header'">
                    <UInput id="file_annexe" type="file" size="2xs" icon="i-heroicons-folder" />
                  </div>
                  <UButton :loading="false" @click="uploadFile">Charger</UButton>
                </template>
              </UCard>
            </div>
          </div>

          <template #footer>
            <div class="flex flex-row-reverse">
              <UButton v-if="headerCreated" color="primary" variant="soft" icon="i-heroicons-arrow-long-right-solid" :trailing="false" @click="goNextTab">Suivant</UButton>
              <UButton v-else color="primary" variant="soft" icon="heroicons:document-plus-20-solid" :trailing="false" :loading="_loadingForm" @click="submitCurrentForm">Créer</UButton>
            </div>
          </template>
        </UCard>
      </USlideover>

      <UDashboardToolbar>
        <template #left>
          <USelectMenu
            v-model="selectedStatusApprobation"
            icon="i-heroicons-map-pin"
            placeholder="Statut approbation"
            :options="defaultStatutApprobation"
            multiple
            :ui-menu="{ option: { base: 'capitalize' } }"
          />
          <USelectMenu
            v-model="selectedStatusPaiement"
            icon="i-heroicons-map-pin"
            placeholder="Statut paiement"
            :options="defaultStatutPaiement"
            multiple
            :ui-menu="{ option: { base: 'capitalize' } }"
          />
          <USelectMenu
            v-model="selectedStatusPlannification"
            icon="i-heroicons-map-pin"
            placeholder="Statut plannification"
            :options="defaultStatutPlannification"
            multiple
            :ui-menu="{ option: { base: 'capitalize' } }"
          />
          <USelectMenu
            v-model="selectedStatusProgrammation"
            icon="i-heroicons-map-pin"
            placeholder="Statut programmation"
            :options="defaultStatutProgammation"
            multiple
            :ui-menu="{ option: { base: 'capitalize' } }"
          />
          <USelectMenu v-model="selectedColumns" icon="i-heroicons-adjustments-horizontal-solid" :options="defaultColumns" multiple class="hidden lg:block">
            <template #label>Display</template>
          </USelectMenu>
        </template>
        <template #right>
          <UButton label="Nouvelle note de frais" leading-icon="i-heroicons-plus" color="gray" @click="isOpen3 = true" />
        </template>
      </UDashboardToolbar>

      <UTable
        v-model:sort="sort"
        :rows="nf_headers"
        :columns="columns"
        sort-mode="manual"
        class="w-[97%] self-center rounded-sm border border-gray-200 bg-white dark:bg-transparent dark:border-gray-700 top-1"
        :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      >
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar v-bind="row.avatar" :alt="row.name" size="xs" />

            <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
          </div>
        </template>
        <template #description-data="{ row }">
          <span class="text-ellipsis overflow-hidden">
            {{ row.description }}
          </span>
        </template>
        <template #action-data="{ row }">
          <UDropdown :items="dropdownItems" :popper="{ placement: 'bottom-start' }" @click="onSelect(row)">
            <!-- {{ row }} -->
            <UButton color="white" icon="humbleicons:dots-horizontal" variant="solid" />
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

      <UDashboardModal v-model="openAnnexes" title="Liste des annexes" prevent-close>
        <ul class="space-y-2">
          <li v-for="(item, index) in 5" :key="index" @click="openViewer = !openViewer">
            <div class="flex flex-row h-14 bg-[#142240] rounded-md">
              <div class="flex items-center p-2">
                <UIcon name="i-lsicon:file-pdf-filled" class="w-5 h-5" />
              </div>
              <div class="flex flex-col content-center justify-center">
                <span class="flex text-sm">Titre {{ item }}</span>
                <span class="flex text-xs">Description {{ item }}</span>
              </div>
            </div>
          </li>
        </ul>
      </UDashboardModal>

      <UDashboardModal v-model="openViewer" title="Viewer" prevent-close>
        <!-- <iframe class="w-full h-auto" src="https://www.iris-france.org/wp-content/uploads/2021/04/Cycle-de-conf%C3%A9rence-Comprendre-le-monde.pdf" frameborder="0"></iframe> -->
        <VuePDF :pdf="pdf" />
      </UDashboardModal>
    </UDashboardPanel>
  </UDashboardPage>
</template>
