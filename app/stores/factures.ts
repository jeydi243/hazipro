import { defineStore } from 'pinia'
import type { Facture } from '~/types'

export const useFacturesStore = defineStore('factures', () => {
  const supabase = useSupabaseClient()
  const items = ref<Facture[]>([])
  const loading = ref(false)

  async function fetchAll(_ownerId?: string | null) {
    loading.value = true
    const { data, error } = await supabase.from('invoices').select('id, numero, date, owner_id, client_id, client:client_id(id, nom, code)')
    if (error) throw error
    if (data) items.value = data as unknown as Facture[]
    loading.value = false
    return items.value
  }

  async function create(data: Partial<Facture>) {
    const { data: created, error } = await supabase.from('invoices').insert(data).select('id, numero, date, owner_id, client_id')
    if (error) throw error
    if (created) items.value.unshift(created[0] as unknown as Facture)
    return created[0]
  }

  async function remove(id: string) {
    const { error } = await supabase.from('invoices').delete().eq('id', id)
    if (error) throw error
    items.value = items.value.filter(f => f.id !== id)
  }

  async function fetchLines(headerId: string) {
    const { data, error } = await supabase
      .from('invoices_lines')
      .select('id, invoice_id, article_id, article:article_id(id, nom, code)')
      .eq('invoice_id', headerId)
    if (error) throw error
    return data
  }

  async function removeLine(id: string) {
    const { error } = await supabase.from('invoices_lines').delete().eq('id', id)
    if (error) throw error
  }

  function subscribeToRealtime(onChange: () => void): () => void {
    const channel = supabase
      .channel('factures_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'factures' }, onChange)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }

  return { items, loading, fetchAll, create, remove, fetchLines, removeLine, subscribeToRealtime }
})
