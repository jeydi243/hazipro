<script lang="ts" setup>
import { z } from 'zod'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'radix-vue'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import type { User } from '~/types'

// import type { FormSubmitEvent } from '#ui/types'




// import { Icon } from '@iconify/vue'

const supabase = useSupabase()

const defaultColumns = [{
  key: 'id',
  label: '#'
}, {
  key: 'name',
  label: 'Name',
  sortable: true
}, {
  key: 'email',
  label: 'Email',
  sortable: true
}, {
  key: 'location',
  label: 'Location'
}, {
  key: 'status',
  label: 'Status'
}
]
const nf_headers = ref([])
const employes = ref([])
async function getNf() {
  const { data } = await supabase.from('nf_headers').select()
  nf_headers.value = data
}
async function getEmployes() {
  const { data } = await supabase.from('employes').select()
  employes.value = data
}
onMounted(() => {
  getEmployes()
  getNf()
})

const q = ref('')
const sort = ref({ column: 'id', direction: 'asc' as const })
const input = ref<{ input: HTMLInputElement }>()
const selectedUser = ref<User[]>([])
const selectedColumns = ref(defaultColumns)
const selectedStatuses = ref([])
const selectedLocations = ref([])
const isNewUserModalOpen = ref(false)
const beneficiaireModalOpen = ref(false)
const submitingHeader = ref(false)
const isCommOpen = ref(false)
const _loadingForm = ref(false)
const form = ref()
const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))
const query = computed(() => ({ q: q.value, statuses: selectedStatuses.value, locations: selectedLocations.value, sort: sort.value.column, order: sort.value.direction }))
const { data: users } = await useFetch<User[]>('/api/users', { query, default: () => [] })
const people = [
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
const defaultDevise = [
  { id: 1, label: 'USD' },
  { id: 2, label: 'CDF' },
  { id: 3, label: 'ZAR' }
]
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

function onSelect(row: User) {
  const index = selectedUser.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selectedUser.value.push(row)
  } else {
    selectedUser.value.splice(index, 1)
  }
}

const header_schema = z.object({
  crg_demandeur: z.string().email('Invalid email'),
  org_id: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof header_schema>

const state = reactive({
  crg_demandeur: undefined,
  org_id: undefined,
  beneficiaire_id: undefined,
  type_budget: undefined,
  categorie: undefined,
  description: undefined,
  date_creation: undefined,
  devise: undefined,
  taux: undefined
})

defineShortcuts({
  '/': () => {
    input.value?.input?.focus()
  }
})
const items = [{
  key: 'header',
  label: 'Header',
  icon: 'i-heroicons-information-circle',
  description: 'Make changes to your account here. Click save when you\'re done.'
}, {
  key: 'lines',
  label: 'Lines',
  icon: 'i-heroicons-information-circle',
  description: 'Change your password here. After saving, you\'ll be logged out.'
}, {
  key: 'resume',
  label: 'Resume',
  icon: 'i-heroicons-information-circle',
  description: 'Change your password here. After saving, you\'ll be logged out.'
}, {
  key: 'apercu',
  icon: 'i-heroicons-information-circle',
  label: 'Apercu',
  description: 'Change your password here. After saving, you\'ll be logged out.'
}]
const isOpen = ref(false)
const isOpen2 = ref(false)
const isOpen3 = ref(false)
const _employes = [
  { id: 1, label: 'Wade Cooper', click: () => { isOpen.value = false } },
  { id: 2, label: 'Arlene Mccoy', click: () => { isOpen.value = false } },
  { id: 3, label: 'Devon Webb', click: () => { isOpen.value = false } },
  { id: 4, label: 'Tom Cook', click: () => { isOpen.value = false } },
  { id: 5, label: 'Tanya Fox', click: () => { isOpen.value = false } },
  { id: 6, label: 'Hellen Schmidt', click: () => { isOpen.value = false } },
  { id: 7, label: 'Caroline Schultz', click: () => { isOpen.value = false } },
  { id: 8, label: 'Mason Heaney', click: () => { isOpen.value = false } },
  { id: 9, label: 'Claudie Smitham', click: () => { isOpen.value = false } },
  { id: 10, label: 'Emil Schaefer', click: () => { isOpen.value = false } }
]
const selectedEmp = ref([_employes[3]])
const accountForm = reactive({ name: 'Benjamin', username: 'benjamincanac' })
const passwordForm = reactive({ currentPassword: '', newPassword: '' })

function onSubmit(form) {
  console.log('Submitted form:', form)
  form.value?.submit()
}
function onSelectBeneficiaire(option) {
  state.beneficiaire_id = option.id
  beneficiaireModalOpen.value = false
}
function onSelect2(option) {
  option.click()
  // if (option.click) {
  // } else if (option.to) {
  //   router.push(option.to)
  // } else if (option.href) {
  //   window.open(option.href, '_blank')
  // }
}

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Note de frais" :badge="users.length">
        <template #right>
          <UButton label="Note de frais 3" leading-icon="i-heroicons-plus" color="gray" @click="isOpen3 = true" />
          <USlideover v-model="isOpen3" :ui="{ width: 'min-w-[90%]' }" prevent-close>
            <UCard class="flex flex-col flex-1 overflow-y-auto"
              :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    Slideover
                  </h3>
                  <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                    @click="isOpen3 = false" />
                </div>
              </template>
              <div class="scrollbar">
                <UTabs :items="items" class="w-full">
                  <template #default="{ item, index, selected }">
                    <div class="flex items-center gap-2 relative truncate">
                      <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

                      <span class="truncate">{{ index + 1 }}. {{ item.label }}</span>

                      <span v-if="selected"
                        class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                    </div>
                  </template>
                  <template #item="{ item }">
                    <!-- {{ item }} -->
                    <div class="flex flex-row space-x-4 p-0">
                      <NfHeader v-if="item.key === 'header'" />
                      <NfLines v-else-if="item.key === 'lines'" />
                      <NfResume v-else-if="item.key === 'resume'" />
                      <NfApercu v-else-if="item.key === 'apercu'" />

                      <UCard :ui="{ base: 'w-[25%]' }">
                        test
                      </UCard>
                    </div>
                  </template>
                </UTabs>
              </div>

              <template #footer>
                <div class="flex flex-row-reverse">
                    <UButton type="submit" variant="soft" icon="i-heroicons-arrow-long-right-solid" :trailing="false" :loading="_loadingForm">
                        Suivant
                    </UButton>
                </div>
              </template>
            </UCard>
          </USlideover>
          <UButton label="Note de frais 2" leading-icon="i-heroicons-plus" color="gray" @click="isOpen2 = true" />
          <UModal v-model="isOpen2" fullscreen>
            <UCard :ui="{
              base: 'h-full flex flex-col',
              rounded: '',
              divide: 'divide-y divide-gray-100 dark:divide-gray-800',
              body: {
                base: 'grow'
              }
            }">
              <template #header>
                <div class="flex items-center justify-between sticky">
                  <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                    Modal
                  </h3>
                  <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                    @click="isOpen2 = false" />
                </div>
              </template>

              <UTabs :items="items" class="w-full">
                <template #default="{ item, index, selected }">
                  <div class="flex items-center gap-2 relative truncate sticky">
                    <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

                    <span class="truncate">{{ index + 1 }}. {{ item.label }}</span>

                    <span v-if="selected"
                      class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                  </div>
                </template>
                <template #item="{ item }">
                  <!-- {{ item }} -->
                  <div class="flex flex-row space-x-4 p-0">
                    <NfHeader v-if="item.key === 'header'" />
                    <NfLines v-else-if="item.key === 'lines'" />
                    <NfResume v-else-if="item.key === 'resume'" />
                    <NfApercu v-else-if="item.key === 'apercu'" />

                    <UCard :ui="{ base: 'w-[25%]' }">
                      test
                    </UCard>
                  </div>
                </template>
              </UTabs>
            </UCard>
          </UModal>
          <DialogRoot>
            <DialogTrigger class="">
              <UButton label="Note de frais" leading-icon="i-heroicons-plus" color="gray" />
            </DialogTrigger>
            <DialogPortal>
              <DialogOverlay
                class=" backdrop-blur-sm bg-white/20 data-[state=open]:animate-overlayShow fixed inset-0 z-30" />
              <DialogContent
                class="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] h-[90%] w-[90vw] max-w-[90%] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-gray-900 p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-[100] overflow-auto">
                <DialogTitle class="text-teal-200 m-0 text-[17px] font-semibold">
                  Note de frais
                </DialogTitle>
                <DialogDescription class="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                  Create new employe expense
                </DialogDescription>
                <UTabs :items="items" class="w-full">
                  <template #default="{ item, index, selected }">
                    <div class="flex items-center gap-2 relative truncate">
                      <UIcon :name="item.icon" class="w-4 h-4 flex-shrink-0" />

                      <span class="truncate">{{ index + 1 }}. {{ item.label }}</span>

                      <span v-if="selected"
                        class="absolute -right-4 w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                    </div>
                  </template>
                  <template #item="{ item }">
                    <!-- {{ item }} -->
                    <div class="flex flex-row space-x-4 p-0">
                      <NfHeader v-if="item.key === 'header'" />
                      <NfLines v-else-if="item.key === 'lines'" />
                      <NfResume v-else-if="item.key === 'resume'" />
                      <NfApercu v-else-if="item.key === 'apercu'" />

                      <UCard :ui="{ base: 'w-[25%]' }">
                        test
                      </UCard>
                    </div>
                  </template>
                </UTabs>

                <div class="mt-[25px] flex justify-end">
                  <DialogClose as-child>
                    <button
                      class="bg-green4 text-green11 hover:bg-green5 focus:shadow-green7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none focus:shadow-[0_0_0_2px] focus:outline-none">
                      Save changes
                    </button>
                  </DialogClose>
                </div>
                <DialogClose
                  class="text-white  hover:bg-white focus:shadow-green7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                  aria-label="Close">
                  <UIcon name="solar-close-circle-line-duotone:x" class="text-white" />
                </DialogClose>
              </DialogContent>
            </DialogPortal>
          </DialogRoot>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <USelectMenu v-model="selectedStatuses" icon="i-heroicons-check-circle" placeholder="Status" multiple
            :options="defaultStatuses" :ui-menu="{ option: { base: 'capitalize' } }" />
          <USelectMenu v-model="selectedLocations" icon="i-heroicons-map-pin" placeholder="Location"
            :options="defaultLocations" multiple />
        </template>
        {{ selectedEmp }}
        <template #right>
          <USelectMenu v-model="selectedColumns" icon="i-heroicons-adjustments-horizontal-solid"
            :options="defaultColumns" multiple class="hidden lg:block">
            <template #label>
              Display
            </template>
          </USelectMenu>
        </template>
      </UDashboardToolbar>
      There is {{ employes.length }} employes

      <UTable v-model="selectedUser" v-model:sort="sort" :rows="users" :columns="columns" sort-mode="manual"
        class="w-full" :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }" @select="onSelect">
        <template #name-data="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar v-bind="row.avatar" :alt="row.name" size="xs" />

            <span class="text-gray-900 dark:text-white font-medium">{{ row.name }}</span>
          </div>
        </template>

        <template #status-data="{ row }">
          <UBadge :label="row.status"
            :color="row.status === 'subscribed' ? 'green' : row.status === 'bounced' ? 'orange' : 'red'"
            variant="subtle" class="capitalize" />
        </template>
      </UTable>
      <USlideover v-model="isNewUserModalOpen" :ui="{ width: 'w-[700px]' }" size="md" prevent-close>
        <UCard class="flex flex-col flex-1"
          :ui="{ body: { base: 'flex-1', padding: 'px-1 py-1 sm:px-3' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark-20-solid"
              class="flex absolute end-5 top-5 z-10" square padded @click="isNewUserModalOpen = false" />

            Note de frais - Entete
          </template>

          <UForm ref="form" :schema="header_schema" :state="state" class="space-y-2 h-full " @submit="onSubmit">
            <UCard :ui="{
              body: {
                base: '',
                background: '',
                padding: 'px-1 py-1 sm:px-3'
              }
            }">
              <UFormGroup label="Direction demandeur" name="crg_demandeur">
                <UInput v-model="state.crg_demandeur" />
              </UFormGroup>

              <UFormGroup label="Organisation" name="org_id">
                <UInput v-model="state.org_id" type="text" />
              </UFormGroup>
              <UFormGroup label="Type Budget" name="type_budget">
                <UInput v-model="state.type_budget" type="text" autocomplete="off" />
              </UFormGroup>
              <UFormGroup label="Categorie" name="categorie">
                <UInput v-model="state.categorie" type="text" />
              </UFormGroup>
            </UCard>
            <UCard :ui="{
              body: {
                base: '',
                background: '',
                padding: 'px-1 py-1 sm:px-3'
              }
            }">
              <UFormGroup label="Date" name="date_creation">
                <input id="date_creation" v-model="state.date_creation" name="date_creation" type="date">
              </UFormGroup>
              <UFormGroup label="Devise" name="devise">
                <USelect v-model="state.devise" :options="defaultDevise" />
              </UFormGroup>
              <UFormGroup label="Taux" name="taux">
                <UInput v-model="state.taux" type="text" />
              </UFormGroup>
            </UCard>
            <UCard :ui="{
              body: {
                base: '',
                background: '',
                padding: 'px-1 py-1 sm:px-3'
              }
            }">
              <UFormGroup label="Bénéficiaire" name="beneficiaire_id">
                <UModal v-model="beneficiaireModalOpen" title="Select beneficiaire">
                  <UCommandPalette v-model="state.beneficiaire_id" :autoselect="false"
                    :groups="[{ key: 'people', commands: people }]"
                    :fuse="{ resultLimit: 6, fuseOptions: { threshold: 0.1 } }"
                    @update:model-value="onSelectBeneficiaire" />
                </UModal>
                <USelect v-model="state.beneficiaire_id" :options="people" @click="beneficiaireModalOpen = true" />
              </UFormGroup>
            </UCard>
            <UCard :ui="{
              body: {
                base: '',
                background: '',
                padding: 'px-1 py-1 sm:px-3'
              }
            }">
              <UFormGroup label="Description" name="description">
                <!-- <UInput v-model="state.beneficiaire_id" type="number" /> -->
                <UTextarea v-model="state.description" color="primary" />
              </UFormGroup>
            </UCard>
          </UForm>

          <template #footer>
            <div class="flex flex-row justify-end">
              <UButton :loading="submitingHeader" @click="form.submit()">
                Soumettre
              </UButton>
            </div>
          </template>
        </UCard>
      </USlideover>
    </UDashboardPanel>
  </UDashboardPage>
</template>
