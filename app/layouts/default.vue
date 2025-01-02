<script setup lang="ts">
  const route = useRoute()
  const appConfig = useAppConfig()
  const { isHelpSlideoverOpen } = useDashboard()

  const links = [
    {
      id: 'home',
      label: 'Home',
      icon: 'i-heroicons-home',
      to: '/',
      tooltip: {
        text: 'Home',
        shortcuts: ['G', 'H'],
      },
    },
    {
      id: 'note_frais',
      label: 'Note de frais',
      icon: 'i-heroicons-user-group',
      to: '/nf',
      tooltip: {
        text: 'Note de frais',
        shortcuts: ['G', 'U'],
      },
    },
    {
      id: 'tresorerie',
      label: 'Tresorerie',
      to: '/tresorerie',
      defaultOpen: false,
      icon: 'i-fluent:money-calculator-24-regular',
      children: [
        {
          label: 'Caisse Transaction',
          to: '/tresorerie/caisse_transaction',
          exact: true,
        },
        {
          label: 'Banque transaction',
          to: '/tresorerie/banque_transaction',
        },
        {
          label: 'Transfert de fond',
          to: '/tresorerie/transfert_fond',
        },
      ],
      tooltip: {
        text: 'Tresorerie',
        shortcuts: ['G', 'T'],
      },
    },
    {
      id: 'planification_paiements',
      label: 'Planification des paiements',
      defaultOpen: false,
      to: '/planification_paiements',
      icon: 'i-uil:schedule',
      children: [
        {
          label: 'Plan de decaissement',
          to: '/planification_paiements/plan_decaissement',
          exact: true,
        },
        {
          label: 'Programmation de paiement',
          to: '/planification_paiements/programmation_paiement',
        },
      ],
      tooltip: {
        text: 'Planification des paiements',
        shortcuts: ['H', 'T'],
      },
    },
    {
      id: 'parametres',
      label: 'Parametres',
      to: '/parametres',
      icon: 'i-heroicons-cog-8-tooth',
      defaultOpen: false,
      children: [
        {
          label: 'General',
          to: '/parametres',
          exact: true,
        },
        {
          label: 'Lookups',
          to: '/parametres/lookups',
        },
        {
          label: 'Users',
          to: '/parametres/users',
        },
        {
          label: 'Frais',
          to: '/parametres/frais',
        },
        {
          label: 'Béneficiaires',
          to: '/parametres/beneficiaires',
        },
        {
          label: 'Organisations',
          to: '/parametres/orgs',
        },
        {
          label: 'Budgets',
          to: '/parametres/budgets',
        },
        {
          label: "Matrice d'approbation",
          to: '/parametres/matrice_approbation',
        },
      ],
      tooltip: {
        text: 'Settings',
        shortcuts: ['G', 'S'],
      },
    },
    {
      id: 'workflows_tasks',
      label: 'Workflows & Tasks',
      defaultOpen: false,
      to: '/wft',
      icon: 'i-octicon:workflow-16',
      children: [
        {
          label: 'Worflows',
          to: '/wft',
          exact: true,
        },
        {
          label: 'Tasks',
          to: '/wft/tasks',
        },
      ],
      tooltip: {
        text: 'workflows_tasks',
        shortcuts: ['G', 'S'],
      },
    },
    {
      id: 'inbox',
      label: 'Inbox',
      icon: 'i-heroicons-inbox',
      to: '/inbox',
      badge: '4',
      tooltip: {
        text: 'Inbox',
        shortcuts: ['G', 'I'],
      },
    },
  ]

  const footerLinks = [
    {
      label: 'Invite people',
      icon: 'i-heroicons-plus',
      to: '/parametres/users',
    },
    {
      label: 'Help & Support',
      icon: 'i-heroicons-question-mark-circle',
      click: () => (isHelpSlideoverOpen.value = true),
    },
  ]

  const groups = [
    {
      key: 'links',
      label: 'Go to',
      commands: links.map(link => ({ ...link, shortcuts: link.tooltip?.shortcuts })),
    },
    {
      key: 'code',
      label: 'Code',
      commands: [
        {
          id: 'source',
          label: 'View page source',
          icon: 'i-simple-icons-github',
          click: () => {
            window.open(`https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${route.path === '/' ? '/index' : route.path}.vue`, '_blank')
          },
        },
      ],
    },
  ]

  const defaultColors = ref(['green', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet'].map(color => ({ label: color, chip: color, click: () => (appConfig.ui.primary = color) })))
  const colors = computed(() => defaultColors.value.map(color => ({ ...color, active: appConfig.ui.primary === color.label })))
</script>

<template>
  <UDashboardLayout>
    <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
      <UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
        <template #left>
          <TeamsDropdown />
        </template>
      </UDashboardNavbar>

      <UDashboardSidebar>
        <template #header>
          <UDashboardSearchButton />
        </template>

        <UDashboardSidebarLinks :links="links" />

        <UDivider />

        <UDashboardSidebarLinks :links="[{ label: 'Colors', defaultOpen: false, draggable: true, children: colors }]" @update:links="colors => (defaultColors = colors)" />

        <div class="flex-1" />

        <UDashboardSidebarLinks :links="footerLinks" />

        <UDivider class="sticky bottom-0" />

        <template #footer>
          <!-- ~/components/UserDropdown.vue -->
          <UserDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>

    <slot />

    <!-- ~/components/HelpSlideover.vue -->
    <HelpSlideover />
    <!-- ~/components/NotificationsSlideover.vue -->
    <NotificationsSlideover />

    <ClientOnly>
      <LazyUDashboardSearch :groups="groups" />
    </ClientOnly>
  </UDashboardLayout>
</template>
