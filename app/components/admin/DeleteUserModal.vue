<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })
const props = defineProps<{
  userEmail: string | null
  loading: boolean
}>()

const emit = defineEmits<{
  confirm: []
}>()
</script>

<template>
  <UModal v-model:open="open" title="Confirmation"
    :description="`Êtes-vous sûr de vouloir supprimer ${props.userEmail || 'cet utilisateur'} ? Cette action est irréversible.`">
    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Annuler" color="neutral" variant="ghost" @click="open = false" :disabled="props.loading" />
        <UButton label="Supprimer définitivement" color="error" :loading="props.loading" @click="emit('confirm')" />
      </div>
    </template>
  </UModal>
</template>
