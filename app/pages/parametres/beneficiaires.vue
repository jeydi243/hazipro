<script setup lang="ts">
import type { Classe, Lookups } from '~/types'

let lookupsResults = ref<Lookups[] | []>([]);
const isNewLookupsModalOpen = ref(false)
const actionToSubmit = ref('Add')
const isNewClasseModalOpen = ref(false)
const selectedTab = ref(0)
const selectedClasse = ref<Classe | null>(null)
const selectedLookups = ref<Lookups | null>(null)

const { data: beneficiaires, refresh } = await useFetch<Classe[]>('http://127.0.0.1:4000/beneficiaires', { default: () => [] })

// Filter beneficiaires based on the selected tab
const filteredBeneficiaires = computed(() => {
    if (selectedTab.value === 1) {
        return beneficiaires.value.filter(mail => !!mail.unread)
    }

    return beneficiaires.value
})

const lookupsColumns = [
    {
        key: 'code',
        label: 'Code',
        sortable: true
    }, {
        key: 'description',
        label: 'Description'
    }, {
        key: 'actions',
        label: 'Actions'
    }]

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
        console.log({ response });
        toast.add({ title: 'Delete lookups ' + lookups.name, description: `${response}`, timeout: 5000 })
        setTimeout(() => {
            // isLoadingBtn.value = false
        }, 1000);
    } catch (error) {
        console.log('Error', error);
        // isLoadingBtn.value = false
    }
}

const items = (row: Lookups) => [
    [{
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-20-solid',
        click: () => editLookups(row)
    }], [{
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        click: () => deleteLookups(row)
    }]
]
const isMailPanelOpen = computed({
    get() {
        return !!selectedClasse.value
    },
    set(value: boolean) {
        if (!value) {
            selectedClasse.value = null
        }
    }
})

function modalClasseClosed() {
    isNewClasseModalOpen.value = false;
    refresh();
    fetchLookups(selectedClasse.value.id)
}

function modalLookupsClosed() {
    isNewLookupsModalOpen.value = false;
    fetchLookups(selectedClasse.value.id)
}

async function fetchLookups(id: string = 'default') {
    try {
        lookupsResults.value = await $fetch<Lookups[]>('http://127.0.0.1:4000/lookups/byclasse', { method: 'GET', params: { classe_id: id } })
        // lookupsResults.value = data.value
    } catch (error) {
        console.log('Error', error);
    }
}

// Reset selected mail if it's not in the filtered mails
watch(filteredBeneficiaires, () => {
    if (!filteredBeneficiaires.value.find(mail => mail.id === selectedClasse.value?.id)) {
        selectedClasse.value = null
    }
})

watch(selectedClasse, () => {
    console.log('Selected class ID = %s', selectedClasse.value.id);
    selectedLookups.value = null
    fetchLookups(selectedClasse.value.id).then(() => console.log('Lookups fetched executed %s', selectedClasse.value.id));
})

</script>

<template>
    <UDashboardPage>
        <UDashboardPanel id="inbox" :width="400" :resizable="{ min: 300, max: 500 }">
            <UDashboardNavbar title="Beneficiaires" :badge="filteredBeneficiaires.length">
                <template #right>
                    <UButton icon="i-heroicons-plus-16-solid" color="teal" variant="ghost"
                        @click="isNewClasseModalOpen = true" />
                </template>
            </UDashboardNavbar>
            <BeneficiairesList v-model="selectedClasse" :beneficiaires="filteredBeneficiaires" />
        </UDashboardPanel>

        <UDashboardPanel v-model="isMailPanelOpen" collapsible grow side="right">
            <template v-if="selectedClasse">
                <UDashboardNavbar>
                    <template #toggle>
                        <UDashboardNavbarToggle icon="i-heroicons-x-mark" />
                        <UDivider orientation="vertical" class="mx-1.5 lg:hidden" />
                    </template>

                    <template #left>
                        <UTooltip text="Move to junk">
                            <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost"
                                @click="fetchLookups(selectedClasse.id)" />
                        </UTooltip>
                    </template>

                    <template #right>
                        <UButton icon="i-heroicons-plus-16-solid" label="Ajouter" color="teal" variant="solid"
                            @click="isNewLookupsModalOpen = true" />
                    </template>
                </UDashboardNavbar>

                <!-- <BeneficiairesMail :classe="selectedClasse" /> -->
                <UCard :ui="{
                    base: 'm-2',
                    divide: 'divide-y divide-gray-200 dark:divide-gray-700',
                    header: {
                        base: '',
                        background: '',
                        padding: 'py-3 px-3'
                    }
                }">
                    <template #header>
                        Informations de la classe
                    </template>
                </UCard>
                <UCard :ui="{
                    base: 'm-2',
                    divide: 'divide-y divide-gray-200 dark:divide-gray-700',
                    header: {
                        base: '',
                        background: '',
                        padding: 'px-1'
                    },
                    body: {
                        base: '',
                        background: '',
                        padding: 'px-1'
                    }
                }">
                    <template #header>
                        <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
                            Lookups
                        </h2>
                    </template>

                    <UTable :rows="lookupsResults" :columns="lookupsColumns"
                        class="m-2 border border-separate rounded-md">
                        <template #actions-data="{ row }">
                            <UDropdown :items="items(row)">
                                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
                            </UDropdown>
                        </template>
                    </UTable>
                    <!-- <template #footer>
                        classe id {{ selectedClasse.id }}
                    </template> -->
                </UCard>
            </template>
            <div v-else class="flex-1 hidden lg:flex items-center justify-center">
                <UIcon name="i-heroicons-inbox" class="w-32 h-32 text-gray-400 dark:text-gray-500" />
            </div>
        </UDashboardPanel>
        <UDashboardModal v-model="isNewLookupsModalOpen" :title="`${actionToSubmit} un Lookups`"
            :description="`${actionToSubmit} un lookups de la classe ${selectedClasse?.code}`"
            :ui="{ width: 'sm:max-w-md' }">
            <!-- ~/components/users/UsersForm.vue -->
            <BeneficiairesLookupsForm :classe="selectedClasse" :action='actionToSubmit' :lookups="selectedLookups"
                @close="modalLookupsClosed" />
        </UDashboardModal>
        <UDashboardModal v-model="isNewClasseModalOpen" title="Bénéficiaires" description="Ajouter un bénéficiaire"
            :ui="{ width: 'sm:max-w-md' }">
            <!-- ~/components/users/UsersForm.vue -->
            <BeneficiairesForm @close="modalClasseClosed" />
        </UDashboardModal>
    </UDashboardPage>
</template>
