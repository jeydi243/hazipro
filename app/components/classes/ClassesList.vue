<script setup lang="ts">
// import { format, isToday } from 'date-fns'
import type { Classe } from '~/types'

const props = defineProps({
  modelValue: {
    type: Object as PropType<Classe | null>,
    default: null
  },
  classes: {
    type: Array as PropType<Classe[]>,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const mailsRefs = ref<Element[]>([])

const selectedClasse = computed({
  get() {
    return props.modelValue
  },
  set(value: Classe | null) {
    emit('update:modelValue', value)
  }
})

watch(selectedClasse, () => {
  if (!selectedClasse.value) {
    return
  }

  const ref = mailsRefs.value[selectedClasse.value.id]
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})

defineShortcuts({
  arrowdown: () => {
    const index = props.classes.findIndex(mail => mail.id === selectedClasse.value?.id)

    if (index === -1) {
      selectedClasse.value = props.classes[0]
    } else if (index < props.classes.length - 1) {
      selectedClasse.value = props.classes[index + 1]
    }
  },
  arrowup: () => {
    const index = props.classes.findIndex(mail => mail.id === selectedClasse.value?.id)

    if (index === -1) {
      selectedClasse.value = props.classes[props.classes.length - 1]
    } else if (index > 0) {
      selectedClasse.value = props.classes[index - 1]
    }
  }
})
</script>

<template>
  <UDashboardPanelContent class="p-0">
    <div v-for="(classe, index) in classes" :key="index" :ref="el => { mailsRefs[classe.id] = el as Element }">
      <div class="p-4 text-sm cursor-pointer border-l-2" :class="[
        classe.unread ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300',
        selectedClasse && selectedClasse.id === classe.id ? 'border-primary-500 dark:border-primary-400 bg-primary-100 dark:bg-primary-900/25' : 'border-white dark:border-gray-900 hover:border-primary-500/25 dark:hover:border-primary-400/25 hover:bg-primary-100/50 dark:hover:bg-primary-900/10'
      ]" @click="selectedClasse = classe">
        <!-- <div class="flex items-center justify-between" :class="[classe.unread && 'font-semibold']">
          <div class="flex items-center gap-3">
            {{ classe.name }}

            <UChip v-if="classe.unread" />
          </div>

          <span>{{ isToday(new Date(classe.date)) ? format(new Date(classe.date), 'HH:mm') : format(new
            Date(classe.date), 'dd MMM') }}</span>
        </div> -->
        <p class="text-gray-400 dark:text-white line-clamp-1 font-bold">
          {{ classe.name }}
        </p>
        <p :class="[classe.unread && 'font-semibold']">
          {{ classe.code }}
        </p>
      </div>

      <UDivider />
    </div>
  </UDashboardPanelContent>
</template>
