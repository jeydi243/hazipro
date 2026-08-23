<script setup lang="ts">
    const route = useRoute()
    const toast = useToast()

    const open = useLocalStorage('dashboard-sidebar-open', true)

    const links = [
        [{
            label: 'Home',
            icon: 'i-lucide-house',
            to: '/',
            onSelect: () => {
                open.value = false
            }
        },
        {
            label: 'Note de frais',
            icon: 'duo-icons:id-card',
            to: '/nf',
            onSelect: () => {
                open.value = false
            }
        },
        {
            label: 'OP - Fournisseur',
            icon: 'i-lucide-file-text',
            to: '/op',
            onSelect: () => {
                open.value = false
            }
        },
        {
            label: 'Bénéficiaires',
            icon: 'duo-icons:user',
            to: '/beneficiaires',
            onSelect: () => {
                open.value = false
            }
        },
        {
            label: 'Workflow & Task',
            to: '/workflow',
            icon: 'hugeicons:workflow-circle-05',
            defaultOpen: true,
            children: [{
                label: 'Workflow & Task',
                icon: 'solar:settings-bold-duotone',
                to: '/workflow',
                exact: true,
                onSelect: () => {
                    open.value = false
                }
            },
            {
                label: 'Tiers',
                to: '/settings/tiers',
                icon: 'solar:card-transfer-bold-duotone',
                onSelect: () => {
                    open.value = false
                }
            },
           
            {
                label: 'Fournisseurs',
                to: '/settings/fournisseurs',
                icon: 'solar:users-group-two-rounded-line-duotone',
                onSelect: () => {
                    open.value = false
                }
            }
            ]
        },
        {
            label: 'Parametres',
            to: '/settings',
            icon: 'i-lucide-settings',
            defaultOpen: true,
            children: [{
                label: 'Parametres',
                icon: 'solar:settings-bold-duotone',
                to: '/settings',
                exact: true,
                onSelect: () => {
                    open.value = false
                }
            }, {
                label: 'Classes & Lookups',
                to: '/settings/lookups',
                icon: 'solar:card-transfer-bold-duotone',
                onSelect: () => {
                    open.value = false
                }
            }, {
                label: 'Organisations',
                to: '/settings/organisations',
                icon: 'solar:card-transfer-bold-duotone',
                onSelect: () => {
                    open.value = false
                }
            },
            {
                label: 'Grille tarifaire',
                to: '/settings/tarifaire',
                icon: 'solar:tag-price-bold-duotone',
                onSelect: () => {
                    open.value = false
                }
            },
            {
                label: 'Utilisateurs',
                to: '/settings/users',
                icon: 'solar:users-group-two-rounded-line-duotone',
                onSelect: () => {
                    open.value = false
                }
            },
            {
                label: 'Roles',
                to: '/settings/roles',
                icon: 'solar:user-id-bold-duotone',
                onSelect: () => {
                    open.value = false
                }
            },
            {
                label: 'Articles',
                to: '/settings/articles',
                icon: 'solar:layers-minimalistic-bold-duotone',
                onSelect: () => {
                    open.value = false
                }
            },
            {
                label: 'Clients',
                to: '/settings/clients',
                icon: 'solar:users-group-two-rounded-bold-duotone',
                onSelect: () => {
                    open.value = false
                }
            }
            ]
        },

        ]
    ]

    const groups = computed(() => [{
        id: 'links',
        label: 'Go to',
        items: links.flat()
    }, {
        id: 'code',
        label: 'Code',
        items: [{
            id: 'source',
            label: 'View page source',
            icon: 'i-simple-icons-github',
            to: `https://github.com/nuxt-ui-pro/dashboard/blob/main/app/pages${route.path === '/' ? '/index' : route.path}.vue`,
            target: '_blank'
        }]
    }])

    onMounted(async () => {
        const cookie = useCookie('cookie-consent')
        if (cookie.value === 'accepted') {
            return
        }
    })
</script>

<template>
    <UDashboardGroup as="div">
        <UDashboardSearch :groups="groups" />

        <UDashboardSidebar v-model:open="open" :default-size="15" :min-size="15" mode="modal" collapsible resizable
            class="bg-(--ui-bg-elevated)/25" :ui="{ footer: 'lg:border-t lg:border-(--ui-border)' }">
            <template #header="{ collapsed }">
                <TeamsMenu :collapsed="collapsed" />
            </template>
            <template #default="{ collapsed }">
                <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

                <UNavigationMenu highlight highlight-color="primary" :collapsed="collapsed" :items="links[0]"
                    orientation="vertical" />

                <UNavigationMenu :collapsed="collapsed" :items="links[1]" orientation="vertical" class="mt-auto" />
            </template>

            <template #footer="{ collapsed }">
                <UserMenu :collapsed="collapsed" />
            </template>
        </UDashboardSidebar>

        <slot />

        <NotificationsSlideover />
    </UDashboardGroup>
</template>
