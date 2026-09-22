<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

defineProps<{
    collapsed?: boolean
}>()

const colorMode = useColorMode()
const auth = useAuth()

const displayName = computed(() => {
    const fullName = auth.user.value?.user_metadata?.full_name
    return (typeof fullName === 'string' && fullName) || auth.user.value?.email || 'Utilisateur'
})

const avatarSrc = computed(() => {
    const src = auth.user.value?.user_metadata?.avatar_url
    return typeof src === 'string' ? src : undefined
})

const items = computed<DropdownMenuItem[][]>(() => ([
    [{
        type: 'label',
        label: displayName.value,
        avatar: { src: avatarSrc.value, alt: displayName.value },
    }],
    [{
        label: 'Profil',
        icon: 'i-lucide-user',
        to: '/profile',
    }, {
        label: 'Paramètres',
        icon: 'i-lucide-settings',
        to: '/settings',
    }],
    [{
        label: 'Apparence',
        icon: 'i-lucide-sun-moon',
        children: [{
            label: 'Clair',
            icon: 'i-lucide-sun',
            type: 'checkbox',
            checked: colorMode.value === 'light',
            onSelect(e: Event) {
                e.preventDefault()
                colorMode.preference = 'light'
            },
        }, {
            label: 'Sombre',
            icon: 'i-lucide-moon',
            type: 'checkbox',
            checked: colorMode.value === 'dark',
            onSelect(e: Event) {
                e.preventDefault()
                colorMode.preference = 'dark'
            },
        }],
    }],
    [{
        label: 'Se déconnecter',
        icon: 'i-lucide-log-out',
        onSelect(e: Event) {
            e.preventDefault()
            isLogoutModalOpen.value = true
        },
    }],
]))

const isLogoutModalOpen = ref(false)

function handleLogout() {
    isLogoutModalOpen.value = false
    auth.logout()
}
</script>

<template>
    <UDropdownMenu :items="items" :content="{ align: 'center', collisionPadding: 12 }"
                   :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }">
        <UButton v-bind="{
            label: collapsed ? undefined : displayName,
            avatar: avatarSrc ? { src: avatarSrc, alt: displayName } : undefined,
            trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down'
        }" color="neutral" variant="ghost" block :square="collapsed" class="data-[state=open]:bg-(--ui-bg-elevated)" :ui="{
            trailingIcon: 'text-(--ui-text-dimmed)'
        }" />

        <UModal v-model:open="isLogoutModalOpen" title="Confirmation"
                description="Êtes-vous sûr de vouloir vous déconnecter ?" :ui="{ content: 'max-w-sm' }">
            <template #footer>
                <UButton label="Annuler" color="neutral" variant="ghost" @click="isLogoutModalOpen = false" />
                <UButton label="Se déconnecter" color="error" @click="handleLogout" />
            </template>
        </UModal>
    </UDropdownMenu>
</template>
