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

  const filteredOrganisations = computed(() => {
    if (selectedTab.value === 1) {
      return orgStore.getListCrg
    }

    return orgStore.getListCrg
  })

  const orgColumns = [
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
    // fetchLookups(selectedOrganisation.value.id)
  }

  function modalLookupsClosed() {
    isNewLookupsModalOpen.value = false
    // fetchLookups(selectedOrganisation.value.id)
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
    // fetchLookups(selectedOrganisation.value.id).then(() => console.log('Lookups fetched executed %s', selectedOrganisation.value.id))
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
      <OrganisationList v-model="selectedOrganisation" :orgs="orgStore.getOrgs" />
    </UDashboardPanel>

    <UDashboardPanel v-model="isMailPanelOpen" collapsible grow side="right">
      <template v-if="selectedOrganisation">
        <div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
          <ul class="flex flex-wrap -mb-px">
            <li class="me-2">
              <a href="#" class="inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Profile</a>
            </li>
            <li class="me-2">
              <a href="#" class="inline-block p-2 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500" aria-current="page">Dashboard</a>
            </li>
            <li class="me-2">
              <a href="#" class="inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Settings</a>
            </li>
            <li class="me-2">
              <a href="#" class="inline-block p-2 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">Contacts</a>
            </li>
            <li>
              <a class="inline-block p-2 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">Disabled</a>
            </li>
          </ul>
        </div>
        <UCard
          :ui="{
            base: 'm-2',
            divide: 'divide-y divide-gray-200 dark:divide-gray-700',
            header: {
              padding: 'px-1',
            },
            body: {
              padding: 'px-1',
            },
          }"
        >
          <template #header>
            <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">Lookups</h2>
          </template>

          <UTable :rows="lookupsResults" :columns="orgColumns" class="m-2 border border-separate rounded-md">
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
      <OrganisationForm :classe="selectedOrganisation" :action="actionToSubmit" :lookups="selectedLookups" @close="modalLookupsClosed" />
    </UDashboardModal>
    <UDashboardModal v-model="isNewOrganisationModalOpen" title="Organisation" description="Ajouter une organisation" :ui="{ width: 'sm:max-w-md' }">
      <!-- ~/components/users/UsersForm.vue -->
      <OrganisationForm @close="modalOrganisationClosed" />
    </UDashboardModal>
  </UDashboardPage>
</template>
