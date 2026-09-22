<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
    collapsed?: boolean
}>()

const parametresStore = useParametresStore()
const organisations = computed(() => parametresStore.organisations)
const selectedOrganisation = ref<string | null>(null)

const items = computed<DropdownMenuItem[][]>(() => {
    const orgs: DropdownMenuItem[] = organisations.value.map(org => ({
        label: org.nom,
        avatar: { src: undefined, alt: org.nom },
        onSelect() {
            selectedOrganisation.value = org.id
        },
    }))

    return [
        orgs.length ? orgs : [{ type: 'label', label: 'Aucune organisation' }],
        [{
            label: 'Gérer les organisations',
            icon: 'i-lucide-cog',
            to: '/settings/organisations',
        }],
    ]
})

const selected = computed(() => {
    const org = organisations.value.find(o => o.id === selectedOrganisation.value) ?? organisations.value[0]
    return org
        ? { label: org.nom, avatar: { src: undefined, alt: org.nom } }
        : { label: 'Hazipro', avatar: { src: undefined, alt: 'Hazipro' } }
})
</script>

<template>
    <UDropdownMenu :items="items" :content="{ align: 'center', collisionPadding: 12 }"
                   :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }">
        <UButton v-bind="{
                     ...selected,
                     label: collapsed ? undefined : selected.label,
                     trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
                 }" color="neutral" variant="ghost" block :square="collapsed" class="data-[state=open]:bg-(--ui-bg-elevated)"
                 :class="[!collapsed && 'py-2']" :ui="{
                     trailingIcon: 'text-(--ui-text-dimmed)'
                 }" />
    </UDropdownMenu>
</template>
