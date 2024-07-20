<template>
  <UForm :validate="validate" :validate-on="['submit']" :state="state" class="space-y-4" @submit="submitNewLookup">
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" autofocus />
    </UFormGroup>

    <UFormGroup label="Code" name="code">
      <UInput v-model="state.code" type="text" />
    </UFormGroup>

    <UFormGroup label="Description" name="description">
      <!-- <UInput v-model="state.description" type="email" placeholder="john.doe@example.com" /> -->
      <UTextarea v-model="state.description" />
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton label="Annuler" color="red" variant="ghost" @click="emit('close')" />
      <UButton type="submit" :label="action" color="black" :loading='isLoadingBtn' />
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '#ui/types'
import type { Classe, Lookups } from '~/types'

const emit = defineEmits(['close'])
const props = defineProps({
  classe: {
    type: Object as PropType<Classe>,
    required: true
  },
  action: {
    type: String,
    required: true,
    default: 'Add'
  },
  lookups: {
    type: Object as PropType<Lookups>,
    required: false,
    default: null
  }
})
const isLoadingBtn = ref(false)
let state = reactive({
  id: null,
  name: undefined,
  code: undefined,
  description: undefined,
  classe_id: props.classe.id,
  parent_lookups_id: null
})
onBeforeMount(() => {
  if (props.lookups) {
    state.id = props.lookups.id
    state.code = props.lookups.code
    state.name = props.lookups.name
    state.description = props.lookups.description
  }
})
// https://ui.nuxt.com/components/form
const validate = (state: any): FormError[] => {
  const errors = []
  if (!state.name) errors.push({ path: 'name', message: 'Please enter a name.' })
  if (!state.code) errors.push({ path: 'code', message: 'Please enter an code.' })
  if (!state.description) errors.push({ path: 'description', message: 'Please enter an description.' })
  // if (!state.classe_id) errors.push({ path: 'classe_id', message: 'Please enter an classe_id.' })
  // if (!state.parent_lookups_id) errors.push({ path: 'classe_id', message: 'Please enter an classe_id.' })
  return errors
}

async function submitNewLookup(event: FormSubmitEvent<any>) {
  // console.log('Okay... %o', event.data);
  // let mybody = event.data
  // mybody.classe_id = props.classe.id
  // console.log('After Okay... %o', mybody);
  isLoadingBtn.value = true
  let response = null
  // send new classe
  try {
    if (props.action == 'Update') {
      response = await $fetch<Lookups>('http://127.0.0.1:4000/lookups', { method: 'PATCH', body: event.data })
    } else {
      response = await $fetch<Lookups>('http://127.0.0.1:4000/lookups', { method: 'POST', body: event.data })
    }
    console.log({ response });
    setTimeout(() => {
      isLoadingBtn.value = false
    }, 1000);
  } catch (error) {
    console.log('Error', error);
    isLoadingBtn.value = false
  }

  emit('close')
}
</script>
