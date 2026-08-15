import { defineStore } from 'pinia'

export const useParametresStore = defineStore('parametres', () => {
  const owner_id = ref<string | null>(null)

  const lookupsStore = useLookupsStore()
  const clientsStore = useClientsStore()
  const profilsStore = useProfilsStore()
  const articlesStore = useArticlesStore()
  const facturesStore = useFacturesStore()
  const organisationsStore = useOrganisationsStore()
  const beneficiairesStore = useBeneficiairesStore()

  function setOwnerID(id: string) {
    owner_id.value = id
  }

  async function init() {
    const results = await Promise.allSettled([
      lookupsStore.fetchAll(),
      owner_id.value ? organisationsStore.fetchAll(owner_id.value) : Promise.resolve(),
      owner_id.value ? articlesStore.fetchAll(owner_id.value) : Promise.resolve(),
      owner_id.value ? clientsStore.fetchAll(owner_id.value) : Promise.resolve(),
      owner_id.value ? facturesStore.fetchAll(owner_id.value) : Promise.resolve(),
      owner_id.value ? profilsStore.fetchAll(owner_id.value) : Promise.resolve(),
      owner_id.value ? beneficiairesStore.fetchAll(owner_id.value) : Promise.resolve()
    ])

    const errors = results.filter(r => r.status === 'rejected').map(r => (r as PromiseRejectedResult).reason)
    if (errors.length > 0) console.error('[Store] Erreurs init:', errors)

    return { error: errors.length > 0 ? errors : null, loading: false }
  }

  const lookups = computed(() => lookupsStore.lookups)
  const classes = computed(() => lookupsStore.classes)
  const organisations = computed(() => organisationsStore.items)
  const articles = computed(() => articlesStore.items)
  const clients = computed(() => clientsStore.items)
  const invoiceHeaders = computed(() => facturesStore.items)
  const profils = computed(() => profilsStore.items)

  const getClasseById = computed(() => (id: string) => classes.value.find(c => c.id === id)?.nom)
  const getLookupsById = computed(() => (id: string) => lookups.value.find(l => l.id == id)?.nom)

  const getTypeFactures = computed(() => lookupsStore.getTypeFactures.value)
  const getTypeAvoirs = computed(() => lookupsStore.getTypeAvoirs.value)
  const getModePaiement = computed(() => lookupsStore.getModePaiement.value)
  const getConditionPaiement = computed(() => lookupsStore.getConditionPaiement.value)
  const getDevise = computed(() => lookupsStore.getDevise.value)
  const getTypeClient = computed(() => lookupsStore.getTypeClient.value)
  const getTypeArticles = computed(() => lookupsStore.getTypeArticles.value)
  const getTypeOrganisations = computed(() => lookupsStore.getTypeOrganisations.value)
  const getGroupeTaxation = computed(() => lookupsStore.getGroupeTaxation.value)
  const getEmplacements = computed(() => organisationsStore.getEmplacements.value)

  const getClasseItems = computed(() => classes.value.map(c => ({ label: c.nom, id: c.id })))

  return {
    owner_id,
    lookups, classes, organisations, articles, clients, invoiceHeaders, profils,
    init, setOwnerID,
    getClasseById, getLookupsById, getClasseItems,
    getTypeFactures, getTypeAvoirs, getModePaiement, getConditionPaiement,
    getDevise, getTypeClient, getTypeArticles, getTypeOrganisations, getGroupeTaxation,
    getEmplacements,
  }
})
