<script lang="ts" setup>
import type { User } from '~/types'
import { supabase } from '~/utils/supabase';

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
}]
const nf_headers = ref([])
async function getCountries() {
  const { data } = await supabase.from('nf_headers').select()
  nf_headers.value = data
}
const q = ref('')
const sort = ref({ column: 'id', direction: 'asc' as const })
const input = ref<{ input: HTMLInputElement }>()
const selected = ref<User[]>([])
const selectedColumns = ref(defaultColumns)
const selectedStatuses = ref([])
const selectedLocations = ref([])
const isNewUserModalOpen = ref(false)

const columns = computed(() => defaultColumns.filter(column => selectedColumns.value.includes(column)))

const query = computed(() => ({ q: q.value, statuses: selectedStatuses.value, locations: selectedLocations.value, sort: sort.value.column, order: sort.value.direction }))

const { data: users, pending } = await useFetch<User[]>('/api/users', { query, default: () => [] })

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

      <UDashboardModal v-model="isNewUserModalOpen" title="New user" description="Add a new note de frais"
        :ui="{ width: 'w-[90%]' }">
        <UTabs :items="items" class="w-full">
          <template #item="{ item }">
            <UCard @submit.prevent="() => onSubmit(item.key === 'header' ? accountForm : passwordForm)">
              <template #header>
                <p class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                  {{ item.label }}
                </p>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {{ item.description }}
                </p>
              </template>

              <div v-if="item.key === 'account'" class="space-y-3">
                <UFormGroup label="Name" name="name">
                  <UInput v-model="accountForm.name" />
                </UFormGroup>
                <UFormGroup label="Username" name="username">
                  <UInput v-model="accountForm.username" />
                </UFormGroup>
              </div>
              <div v-else-if="item.key === 'password'" class="space-y-3">
                <UFormGroup label="Current Password" name="current" required>
                  <UInput v-model="passwordForm.currentPassword" type="password" required />
                </UFormGroup>
                <UFormGroup label="New Password" name="new" required>
                  <UInput v-model="passwordForm.newPassword" type="password" required />
                </UFormGroup>
              </div>

              <template #footer>
                <UButton type="submit" color="black">
                  Save {{ item.key === 'account' ? 'account' : 'password' }}
                </UButton>
              </template>
            </UCard>
          </template>
        </UTabs>
      </UDashboardModal>

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
    </UDashboardPanel>
  </UDashboardPage>
</template>
