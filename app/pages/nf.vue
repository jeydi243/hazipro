<script lang="ts" setup>
import { z } from 'zod'
import type { User } from '~/types'
import type { FormSubmitEvent } from '#ui/types'

const supabase = useSupabase()
const countries = [{
  name: 'United States',
  value: 'US'
}, {
  name: 'Canada',
  value: 'CA',
  disabled: true
}, {
  name: 'Mexico',
  value: 'MX'
}]
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
const selected = ref<User[]>([])
const selectedColumns = ref(defaultColumns)
const selectedStatuses = ref([])
const selectedLocations = ref([])
const isNewUserModalOpen = ref(false)
const beneficiaireModalOpen = ref(false)
const submitingHeader = ref(false)
const form = ref()
const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))
const query = computed(() => ({ q: q.value, statuses: selectedStatuses.value, locations: selectedLocations.value, sort: sort.value.column, order: sort.value.direction }))
const { data: users, pending } = await useFetch<User[]>('/api/users', { query, default: () => [] })
const people = [
  { id: 1, label: 'Wade Cooper' },
  { id: 2, label: 'Arlene Mccoy' },
  { id: 3, label: 'Devon Webb' },
  { id: 4, label: 'Tom Cook' },
  { id: 5, label: 'Tanya Fox' },
  { id: 6, label: 'Hellen Schmidt' },
  { id: 7, label: 'Caroline Schultz' },
  { id: 8, label: 'Mason Heaney' },
  { id: 9, label: 'Claudie Smitham' },
  { id: 10, label: 'Emil Schaefer' }
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
  const index = selected.value.findIndex(item => item.id === row.id)
  if (index === -1) {
    selected.value.push(row)
  } else {
    selected.value.splice(index, 1)
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
  description: 'Make changes to your account here. Click save when you\'re done.'
}, {
  key: 'lines',
  label: 'Lines',
  description: 'Change your password here. After saving, you\'ll be logged out.'
}, {
  key: 'resume',
  label: 'Resume',
  description: 'Change your password here. After saving, you\'ll be logged out.'
}, {
  key: 'apercu',
  label: 'Apercu',
  description: 'Change your password here. After saving, you\'ll be logged out.'
}]

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
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Note de frais" :badge="users.length">
        <template #right>
          <UInput ref="input" v-model="q" icon="i-heroicons-funnel" autocomplete="off"
            placeholder="Filter note de frais..." class="hidden lg:block" @keydown.esc="$event.target.blur()">
            <template #trailing>
              <UKbd value="/" />
            </template>
          </UInput>

          <UButton label="Note de frais" leading-icon="i-heroicons-plus" color="gray"
            @click="isNewUserModalOpen = true" />
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <USelectMenu v-model="selectedStatuses" icon="i-heroicons-check-circle" placeholder="Status" multiple
            :options="defaultStatuses" :ui-menu="{ option: { base: 'capitalize' } }" />
          <USelectMenu v-model="selectedLocations" icon="i-heroicons-map-pin" placeholder="Location"
            :options="defaultLocations" multiple />
        </template>

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
      <UTable v-model="selected" v-model:sort="sort" :rows="users" :columns="columns" :loading="pending"
        sort-mode="manual" class="w-full" :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }" @select="onSelect">
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
          :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
          <template #header>
            <UButton color="gray" variant="ghost" size="sm" icon="i-heroicons-x-mark-20-solid"
              class="flex absolute end-5 top-5 z-10" square padded @click="isNewUserModalOpen = false" />

            Note de frais - Entete
          </template>

          <UForm ref="form" :schema="header_schema" :state="state" class="space-y-4 h-full" @submit="onSubmit">
            <UCard>
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
            <UCard>
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
            <UCard>
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
            <UCard>
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
