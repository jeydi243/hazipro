<script setup lang="ts">
import type { User } from '@supabase/supabase-js';

// import { format, isToday } from 'date-fns'

const props = defineProps({
  modelValue: {
    type: Object as PropType<User | null>,
    default: null
  },
  users: {
    type: Array as PropType<User[]>,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const mailsRefs = ref<Element[]>([])

const selectedUser = computed({
  get() {
    return props.modelValue
  },
  set(value: User | null) {
    emit('update:modelValue', value)
  }
})

watch(selectedUser, () => {
  if (!selectedUser.value) {
    return
  }

  const ref = mailsRefs.value[selectedUser.value.id]
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})

defineShortcuts({
  arrowdown: () => {
    const index = props.users.findIndex(mail => mail.id === selectedUser.value?.id)

    if (index === -1) {
      selectedUser.value = props.users[0]
    } else if (index < props.users.length - 1) {
      selectedUser.value = props.users[index + 1]
    }
  },
  arrowup: () => {
    const index = props.users.findIndex(mail => mail.id === selectedUser.value?.id)

    if (index === -1) {
      selectedUser.value = props.users[props.users.length - 1]
    } else if (index > 0) {
      selectedUser.value = props.users[index - 1]
    }
  }
})
</script>

<template>
  <UDashboardPanelContent class="p-0">
    <div v-for="(us, index) in props.users" :key="index" :ref="el => { mailsRefs[us.id] = el as Element }">
      <div class="p-4 text-sm cursor-pointer border-l-2" :class="[
        us.is_anonymous ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300',
        selectedUser && selectedUser.id === us.id ? 'border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-900/25' : 'border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10'
      ]" @click="selectedUser = us">
        <!-- <div class="flex items-center justify-between" :class="[User.unread && 'font-semibold']">
          <div class="flex items-center gap-3">
            {{ User.name }}

            <UChip v-if="User.unread" />
          </div>

          <span>{{ isToday(new Date(User.date)) ? format(new Date(User.date), 'HH:mm') : format(new
            Date(User.date), 'dd MMM') }}</span>
        </div> -->
        <p class="text-gray-400 dark:text-white line-clamp-1 font-bold">
          {{ us.user_metadata['first_name'] }} {{ us.user_metadata['last_name'] }}
        </p>
        <p :class="[us.is_anonymous && 'font-semibold']">
          {{ us.email }}
        </p>
      </div>

      <UDivider />
    </div>
  </UDashboardPanelContent>
</template>
