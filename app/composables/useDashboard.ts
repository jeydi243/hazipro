let shortcutsInitialized = false

export function useDashboard() {
    const route = useRoute()
    const router = useRouter()

    const isNotificationsSlideoverOpen = useState('dashboard-notifications-open', () => false)

    if (!shortcutsInitialized) {
        shortcutsInitialized = true
        defineShortcuts({
            'g-h': () => router.push('/'),
            'g-s': () => router.push('/settings'),
            'n': () => isNotificationsSlideoverOpen.value = !isNotificationsSlideoverOpen.value
        })

        watch(() => route.fullPath, () => {
            isNotificationsSlideoverOpen.value = false
        })
    }

    return {
        isNotificationsSlideoverOpen
    }
}
