<script setup lang="ts">
  import type { FormError, FormSubmitEvent } from '#ui/types'
  import type { Organisation } from '~/types'

  const emit = defineEmits(['close'])
  const isLoadingBtn = ref(false)
  const state = reactive({
    code: undefined,
    name: undefined,
    description: undefined,
    organisation_parent_id: undefined,
  })

  // https://ui.nuxt.com/components/form
  const validate = (state: any): FormError[] => {
    const errors = []
    if (!state.name) errors.push({ path: 'name', message: 'Please enter a name.' })
    if (!state.code) errors.push({ path: 'code', message: 'Please enter a code.' })
    if (!state.description) errors.push({ path: 'description', message: 'Please enter an description.' })
    return errors
  }

  async function onSubmit(event: FormSubmitEvent<any>) {
    isLoadingBtn.value = true
    console.log(event.data)
    // send new classe
    try {
      const { data, error } = await supabase.from('organisations').insert(event.data)
      isLoadingBtn.value = false
    } catch (error) {
      console.log('Error', error)
      isLoadingBtn.value = false
    }

    emit('close')
  }
</script>

<template>
  <UForm :validate="validate" :validate-on="['submit']" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" placeholder="NUXTUI" autofocus />
    </UFormGroup>

    <UFormGroup label="Code" name="name">
      <UInput v-model="state.code" placeholder="Code" autofocus />
    </UFormGroup>

    <UFormGroup label="Description" name="description">
      <!-- <UInput v-model="state.description" type="email" placeholder="john.doe@example.com" /> -->
      <UTextarea v-model="state.description" />
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton label="Annuler" color="red" variant="ghost" @click="emit('close')" />
      <UButton type="submit" label="Ajouter" color="black" :loading="isLoadingBtn" />
    </div>
  </UForm>
</template>
