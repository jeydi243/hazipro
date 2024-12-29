<script setup lang="ts">
  import type { Organisation, Lookups } from '~/types'

  let lookupsResults = ref<Lookups[] | []>([])
  const orgStore = useOrg()
  const isNewLookupsModalOpen = ref(false)
  const actionToSubmit = ref('Add')
  const isNewOrganisationModalOpen = ref(false)
  const selectedTab = ref(0)
  const selectedOrganisation = ref<Organisation | null>(null)
  const selectedLookups = ref<Lookups | null>(null)
  const orgs = computed(() => orgStore.getListCrg)

  const filteredOrganisations = computed(() => {
    if (selectedTab.value === 1) {
      return orgs.value
    }

    return classes.value
  })

  const lookupsColumns = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'actions',
      label: 'Actions',
    },
  ]

  async function editLookups(row: Lookups) {
    actionToSubmit.value = 'Update'
    selectedLookups.value = row
    actionToSubmit.value = 'Add'
    isNewLookupsModalOpen.value = true
  }

  async function deleteLookups(lookups: Lookups) {
    const toast = useToast()
    try {
      const response = await $fetch<Lookups | object>('http://127.0.0.1:4000/lookups/' + lookups.id, { method: 'DELETE' })
      console.log({ response })
      toast.add({ title: 'Delete lookups ' + lookups.name, description: `${response}`, timeout: 5000 })
      setTimeout(() => {
        // isLoadingBtn.value = false
      }, 1000)
    } catch (error) {
      console.log('Error', error)
      // isLoadingBtn.value = false
    }
  }

  const items = (row: Lookups) => [
    [
      {
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => editLookups(row),
      },
    ],
    [
      {
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        click: () => deleteLookups(row),
      },
    ],
  ]
  const isMailPanelOpen = computed({
    get() {
      return !!selectedOrganisation.value
    },
    set(value: boolean) {
      if (!value) {
        selectedOrganisation.value = null
      }
    },
  })

  function modalOrganisationClosed() {
    isNewOrganisationModalOpen.value = false
    refresh()
    fetchLookups(selectedOrganisation.value.id)
  }

  function modalLookupsClosed() {
    isNewLookupsModalOpen.value = false
    fetchLookups(selectedOrganisation.value.id)
  }

  async function fetchLookups(id: string = 'default') {
    try {
      lookupsResults.value = await $fetch<Lookups[]>('http://127.0.0.1:4000/lookups/byclasse', { method: 'GET', params: { classe_id: id } })
      // lookupsResults.value = data.value
    } catch (error) {
      console.log('Error', error)
    }
  }

  // Reset selected mail if it's not in the filtered mails
  watch(filteredOrganisations, () => {
    if (!filteredOrganisations.value.find(mail => mail.id === selectedOrganisation.value?.id)) {
      selectedOrganisation.value = null
    }
  })

  watch(selectedOrganisation, () => {
    console.log('Selected class ID = %s', selectedOrganisation.value.id)
    selectedLookups.value = null
    fetchLookups(selectedOrganisation.value.id).then(() => console.log('Lookups fetched executed %s', selectedOrganisation.value.id))
  })
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel id="inbox" :width="400" :resizable="{ min: 300, max: 500 }">
      <UDashboardNavbar title="Organisations" :badge="filteredOrganisations.length">
        <template #right>
          <UButton icon="i-heroicons-plus-16-solid" color="teal" variant="ghost" @click="isNewOrganisationModalOpen = true" />
        </template>
      </UDashboardNavbar>
      <OrganisationsList v-model="selectedOrganisation" :classes="filteredOrganisations" />
    </UDashboardPanel>

    <UDashboardPanel v-model="isMailPanelOpen" collapsible grow side="right">
      <template v-if="selectedOrganisation">
        <UDashboardNavbar>
          <template #toggle>
            <UDashboardNavbarToggle icon="i-heroicons-x-mark" />
            <UDivider orientation="vertical" class="mx-1.5 lg:hidden" />
          </template>

          <template #left>
            <UTooltip text="Move to junk">
              <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" @click="fetchLookups(selectedOrganisation.id)" />
            </UTooltip>
          </template>

          <template #right>
            <UButton icon="i-heroicons-plus-16-solid" label="Ajouter" color="teal" variant="solid" @click="isNewLookupsModalOpen = true" />
          </template>
        </UDashboardNavbar>

        <!-- <OrganisationsMail :classe="selectedOrganisation" /> -->
        <UCard
          :ui="{
            base: 'm-2',
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: {
              base: '',
              background: '',
              padding: 'py-3 px-3',
            },
          }"
        >
          <template #header>Informations de la classe</template>
        </UCard>
        <UCard
          :ui="{
            base: 'm-2',
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: {
              base: '',
              background: '',
              padding: 'px-1',
            },
            body: {
              base: '',
              background: '',
              padding: 'px-1',
            },
          }"
        >
          <template #header>
            <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">Lookups</h2>
          </template>

          <UTable :rows="lookupsResults" :columns="lookupsColumns" class="m-2 border border-separate rounded-md">
            <template #actions-data="{ row }">
              <UDropdown :items="items(row)">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
              </UDropdown>
            </template>
          </UTable>
          <!-- <template #footer>
                        classe id {{ selectedOrganisation.id }}
                    </template> -->
        </UCard>
      </template>
      <div v-else class="flex-1 hidden lg:flex items-center justify-center">
        <UIcon name="i-heroicons-inbox" class="w-32 h-32 text-gray-400 dark:text-gray-500" />
      </div>
    </UDashboardPanel>
    <UDashboardModal
      v-model="isNewLookupsModalOpen"
      :title="`${actionToSubmit} un Lookups`"
      :description="`${actionToSubmit} un lookups de la classe ${selectedOrganisation?.code}`"
      :ui="{ width: 'sm:max-w-md' }"
    >
      <!-- ~/components/users/UsersForm.vue -->
      <OrganisationLookupsForm :classe="selectedOrganisation" :action="actionToSubmit" :lookups="selectedLookups" @close="modalLookupsClosed" />
    </UDashboardModal>
    <UDashboardModal v-model="isNewOrganisationModalOpen" title="Organisation" description="Ajouter une organisation" :ui="{ width: 'sm:max-w-md' }">
      <!-- ~/components/users/UsersForm.vue -->
      <OrganisationForm @close="modalOrganisationClosed" />
    </UDashboardModal>
  </UDashboardPage>
</template>
