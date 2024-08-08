<script setup lang="ts">
import { z } from 'zod'
import type { FormError, FormSubmitEvent } from '#ui/types'

const state = reactive({
    crg_demandeur: undefined,
    org_id: undefined,
    beneficiaire_id: undefined,
    type_budget: undefined,
    categorie: undefined,
    description: undefined,
    date_creation: undefined,
    devise: undefined,
    nature_op: undefined,
    taux: undefined
})
const header_schema = z.object({
    crg_demandeur: z.string().email('Invalid email'),
    org_id: z.string().min(8, 'Must be at least 8 characters'),
    beneficiaire_id: z.number().min(100, 'Must be at least 0'),
    type_budget: z.number().min(100, 'Must be at least 0'),
    categorie: z.string().min(8, 'Must be at least 8 characters'),
    description: z.string().min(8, 'Must be at least 8 characters'),
    date_creation: z.date({ required_error: 'Date is required' }),
    devise: z.string().max(3, 'Must be 3 characters'),
    nature_op: z.number().min(100, 'Must be at least 0'),
    taux: z.number().min(100, 'Must be at least 0')
})
const form = ref()
const toast = useToast()
const fruit = ref()
const _orgs = [{ name: 'APR', value: 12 }]
const _natureOP = [{ name: 'Mission', value: 12 }]
const vegetables = ['Aubergine', 'Broccoli', 'Carrot', 'Courgette', 'Leek']
const isOpen = ref(false)
const _employes = [
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
const selectedEmp = ref([_employes[3]])
async function onSubmit(event: FormSubmitEvent<any>) {
    form.value.clear()
    console.log({ fff: form.value });
    console.log({ ooo: event.data });
    toast.add({ icon: 'i-heroicons-check-circle', title: event.data, color: 'red' })
    try {
        // const { data, error } = await supabase
        //     .from('nf_headers')
        //     .insert(form.value)
        //     .select()
        // ...
    } catch (err) {
        if (err.statusCode === 422) {
            form.value.setErrors(err.data.errors.map((err) => ({
                // Map validation errors to { path: string, message: string }
                message: err.message,
                path: err.path,
            })))
        }
    }
}
</script>

<template>
    <UCard :ui="{ base: 'w-[75%]' }">
        <UForm ref="form" :state="state" :schema="header_schema" class="flex flex-col" @submit="onSubmit">
            {{ state }}
            <div class="flex flex-col space-y-3 grow">
                <UCard class="flex flex-row w-full grow">
                    <div class="flex flex-row space-x-3 w-full grow">
                        <UFormGroup label="CRG" name="direction_demandeur" class="grow flex-auto w-[200px]">
                            <USelect option-attribute="name" class="grow" color="gray" variant="outline"
                                :options="_orgs" :model-value="state.crg_demandeur" />
                        </UFormGroup>
                        <UFormGroup label="Organisation" name="org_id" class="w-[200px]">
                            <USelect option-attribute="name" color="gray" variant="outline" :options="_orgs"
                                :model-value="state.org_id" />
                        </UFormGroup>
                        <UFormGroup label="Nature" name="nature" class=" w-[200px]">
                            <USelect option-attribute="name" color="gray" variant="outline" :options="_natureOP"
                                :model-value="state.nature_op" />
                        </UFormGroup>
                    </div>
                </UCard>
                <UCard>
                    <UFormGroup label="Beneficiaire" name="beneficiaire_id" class=" mb-2">
                        <UInput v-model="state.beneficiaire_id" />
                    </UFormGroup>
                    <UButton label="Open" @click="isOpen = true" />

                    <UModal v-model="isOpen" prevent-close :ui="{ wrapper: 'relative z-70' }">
                        <UCommandPalette v-model="selectedEmp" :autoselect="false"
                            :fuse="{ resultLimit: 6, fuseOptions: { threshold: 0.1 } }"
                            :groups="[{ key: 'people', commands: _employes }]" />
                    </UModal>
                </UCard>
                <UCard class="flex flex-row">
                    <UFormGroup label="Categorie" name="categorie" class="mb-2 ">
                        <UInput v-model="state.categorie" />
                    </UFormGroup>

                    <UFormGroup label="Nature NF" name="nature_op" class=" mb-2">
                        <UInput v-model="state.nature_op" />
                    </UFormGroup>
                </UCard>
                <UCard class="flex flex-row w-full">
                    <UFormGroup label="Description" name="description" class="mb-2">
                        <UTextarea v-model="state.description" class="w-full" />
                    </UFormGroup>
                </UCard>
                <div class="flex flex-row-reverse">
                    <UButton type="submit" variant="soft" icon="i-heroicons-arrow-long-right-solid" :trailing="false">
                        Suivant
                    </UButton>
                </div>
            </div>
        </UForm>
    </UCard>
</template>
