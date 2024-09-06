<script setup lang="ts">
import { z } from 'zod'
import { ref } from 'vue'
import { format } from 'date-fns'
import {
    DateFormatter,
    type DateValue,
    getLocalTimeZone,
} from '@internationalized/date'
import { CalendarIcon } from '@radix-icons/vue'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import type { FormError, FormSubmitEvent } from '#ui/types'



const df = new DateFormatter('en-US', {
    dateStyle: 'long',
})

const value = ref<DateValue>()
const form = ref()
const toast = useToast()
const _orgs = [{ name: 'APR', value: 14 }]
const _categories = [{ name: 'Employé', value: 13 }]
const _devises = [{ name: 'USD', value: 1 }, { name: 'CDF', value: 2 }, { name: 'ZAR', value: 3 }]
const isCommOpen = ref(false)
const _natureOP = [{ name: 'Mission', value: 12 }]
const _cr = [{ name: 'SUE', value: 18 }]
const state = reactive({
    crg_demandeur: undefined,
    org_id: undefined,
    cr_id: undefined,
    beneficiaire_id: undefined,
    type_budget: undefined,
    categorie: undefined,
    description: undefined,
    date_creation: undefined,
    devise: undefined,
    nature_op: undefined,
    taux: undefined,
    payment_group_id: undefined
})
const header_schema = z.object({
    crg_demandeur: z.number().min(1, 'Le crg demandeur doit etre un ID'),
    org_id: z.number().min(1, 'Must be at least a number'),
    beneficiaire_id: z.number().min(100, 'Must be at least 1'),
    type_budget: z.number().min(1, 'Must be at least 1'),
    categorie: z.number().min(8, 'Must be at least 8 characters'),
    description: z.string().min(2, 'Must be at least 8 characters'),
    // date_creation: z.date({ required_error: 'Date is  required' }),
    devise: z.string().max(3, 'Must be 3 characters'),
    nature_op: z.number().min(1, 'Must be at least 1'),
    taux: z.number().min(1, 'Must be at least 1'),
    date_creation: z.custom<DateValue>(() => true),
})


const _employes = [
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
const selectedEmp = ref(_employes[3])
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
function onSelectBeneficiaire(option) {
    state.beneficiaire_id = option.id
    option.click()
}
</script>

<template>
    <UCard :ui="{ base: 'w-[75%]' }">
        <UForm ref="form" :state="state" :schema="header_schema" class="flex flex-col" @submit="onSubmit">
            {{ state }}
            <div class="flex flex-col space-y-3 grow">
                <UCard class="flex flex-row w-full grow">
                    <div class="flex flex-row space-x-3 w-full grow">
                        <UFormGroup label="CRG" name="direction_demandeur" class="grow flex-auto min-w-[200px]">
                            <USelect option-attribute="name" class="min-w[50%]" color="gray" variant="outline"
                                :options="_orgs" :model-value="state.crg_demandeur" />
                        </UFormGroup>
                        <UFormGroup label="CR" name="cr" class=" w-[200px]">
                            <USelect option-attribute="cr" color="gray" variant="outline" :options="_cr"
                                :model-value="state.cr_id" />
                        </UFormGroup>
                        <UFormGroup label="1er Approbateur" name="org_id" class="w-[200px]">
                            <USelect option-attribute="name" color="gray" variant="outline" :options="_orgs"
                                :model-value="state.org_id" />
                        </UFormGroup>
                        <UFormGroup label="Categorie" name="categorie" class="mb-2 w-[200px]">
                            <USelect option-attribute="name" color="gray" variant="outline" :options="_categories"
                                :model-value="state.categorie" />
                        </UFormGroup>
                        <UFormGroup label="Nature NF" name="nature" class=" w-[200px]">
                            <USelect option-attribute="name" color="gray" variant="outline" :options="_natureOP"
                                :model-value="state.nature_op" />
                        </UFormGroup>
                    </div>
                </UCard>
                <UCard>
                    <UFormGroup label="Beneficiaire" name="beneficiaire_id" class=" mb-2">
                        <UButton icon="i-heroicons-user-circle-16-solid" :label="selectedEmp.label" class="w-[50%]"
                            variant="solid" @click="isCommOpen = true" />
                        <UModal v-model="isCommOpen">
                            <UCommandPalette v-model="selectedEmp" nullable
                                :groups="[{ key: 'people', commands: _employes }]"
                                @update:model-value="onSelectBeneficiaire" />
                        </UModal>
                    </UFormGroup>
                </UCard>
                <UCard class="w-full">
                    <div class="flex flex-row space-x-3 w-full grow">
                        <UFormGroup label="Devise" name="devise" class=" w-[200px]">
                            <USelect option-attribute="name" color="gray" variant="outline" :options="_devises"
                                :model-value="state.devise" />
                        </UFormGroup>
                        <UFormGroup label="Taux de change" name="taux_change" class="w-[200px] z-0">
                            <UInput placeholder="2875" icon="i-heroicons-currency-dollar-solid" />
                        </UFormGroup>
                        <UFormGroup label="Date de création" name="date_creation" class="w-[200px]">
                            <Popover>
                                <PopoverTrigger as-child>
                                    <Button variant="outline" :class="cn(
                                        'w-[280px] justify-start text-left font-normal',
                                        !state.date_creation && 'text-muted-foreground'
                                    )">
                                        <CalendarIcon class="mr-2 h-4 w-4" />
                                        {{ state.date_creation ?
                                            df.format(state.date_creation.toDate(getLocalTimeZone())) :
                                            "Choisissez une date" }}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent class="w-auto p-0">
                                    <Calendar v-model="state.date_creation" initial-focus />
                                </PopoverContent>
                            </Popover>
                        </UFormGroup>
                    </div>
                </UCard>
                <UCard class="flex flex-row min-w-full">
                    <div class="min-w-full">
                        <UFormGroup size="lg" label="Description" name="description" class="mb-2 min-w-full ">
                            <UTextarea v-model="state.description" class="w-full" />
                        </UFormGroup>
                    </div>
                </UCard>
                <!-- <div class="flex flex-row-reverse">
                    <UButton type="submit" variant="soft" icon="i-heroicons-arrow-long-right-solid" :trailing="false">
                        Suivant
                    </UButton>
                </div> -->
            </div>
        </UForm>
    </UCard>
</template>
