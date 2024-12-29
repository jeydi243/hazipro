<script setup lang="ts">
// import { format, isToday } from 'date-fns'
import type { Organisation } from '~/types'

const props = defineProps({
  modelValue: {
    type: Object as PropType<Organisation | null>,
    default: null
  },
  orgs: {
    type: Array as PropType<Organisation[]>,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const mailsRefs = ref<Element[]>([])

const selectedOrg = computed({
  get() {
    return props.modelValue
  },
  set(value: Organisation | null) {
    emit('update:modelValue', value)
  }
})

watch(selectedOrg, () => {
  if (!selectedOrg.value) {
    return
  }

  const ref = mailsRefs.value[selectedOrg.value.id]
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})

defineShortcuts({
  arrowdown: () => {
    const index = props.orgs.findIndex(mail => mail.id === selectedOrg.value?.id)

    if (index === -1) {
      selectedOrg.value = props.orgs[0]
    } else if (index < props.orgs.length - 1) {
      selectedOrg.value = props.orgs[index + 1]
    }
  },
  arrowup: () => {
    const index = props.orgs.findIndex(mail => mail.id === selectedOrg.value?.id)

    if (index === -1) {
      selectedOrg.value = props.orgs[props.orgs.length - 1]
    } else if (index > 0) {
      selectedOrg.value = props.orgs[index - 1]
    }
  }
})
</script>

<template>
  <UDashboardPanelContent class="p-0">
    <div v-for="(org, index) in orgs" :key="index" :ref="el => { mailsRefs[org.id] = el as Element }">
      <div class="p-4 text-sm cursor-pointer border-l-2" :class="[
        org.statut ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300',
        selectedOrg && selectedOrg.id === org.id ? 'border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-900/25' : 'border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10'
      ]" @click="selectedOrg = org">
        <!-- <div class="flex items-center justify-between" :class="[classe.unread && 'font-semibold']">
          <div class="flex items-center gap-3">
            {{ classe.name }}

            <UChip v-if="classe.unread" />
          </div>

          <span>{{ isToday(new Date(classe.date)) ? format(new Date(classe.date), 'HH:mm') : format(new
            Date(classe.date), 'dd MMM') }}</span>
        </div> -->
        <p class="text-gray-400 dark:text-white line-clamp-1 font-bold">
          {{ org.name }}
        </p>
        <p :class="[org.statut && 'font-semibold']">
          {{ org.code }}
        </p>
      </div>

      <UDivider />
    </div>
  </UDashboardPanelContent>
</template>
