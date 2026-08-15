import { defineStore } from 'pinia'
import type { STKHeader, STKLine, STKLineDetail, Stock } from '~/types'

export const useStockStore = defineStore('stock', () => {
  const supabase = useSupabaseClient()
  const headers = ref<STKHeader[]>([])
  const stockData = ref<Stock[]>([])
  const loading = ref(false)

  async function fetchHeaders() {
    loading.value = true
    const { data, error } = await supabase
      .from('stk_trx_headers')
      .select('id, date_trx, numero_commande, numero_livraison, numero_document, statut, type, in_organisation:in_organisation_id(id, nom, code), out_organisation:out_organisation_id(id, nom, code), fournisseur:fournisseurs(id, nom)')
    if (error) throw error
    if (data) headers.value = data as unknown as STKHeader[]
    loading.value = false
    return headers.value
  }

  async function createHeader(data: Partial<STKHeader>) {
    const { data: created, error } = await supabase.from('stk_trx_headers').insert(data as any).select('id, date_trx, numero_commande, numero_livraison, numero_document, statut, type')
    if (error) throw error
    if (created) headers.value.unshift(created[0] as unknown as STKHeader)
    return created[0]
  }

  async function updateHeader(id: string, data: Partial<STKHeader>) {
    const { data: updated, error } = await supabase.from('stk_trx_headers').update(data as any).eq('id', id).select('id, date_trx, numero_commande, numero_livraison, numero_document, statut, type')
    if (error) throw error
    if (updated) {
      const idx = headers.value.findIndex(h => h.id === id)
      if (idx !== -1) headers.value[idx] = updated[0] as unknown as STKHeader
    }
    return updated?.[0]
  }

  async function removeHeader(id: string) {
    const { error } = await supabase.from('stk_trx_headers').delete().eq('id', id)
    if (error) throw error
    headers.value = headers.value.filter(h => h.id !== id)
  }

  async function fetchLines(headerId: string) {
    const { data, error } = await supabase
      .from('stk_trx_lines')
      .select('id, header_id, article_id, quantite_trx, prix_unitaire, numero_lot, article:article_id(id, nom, code)')
      .eq('header_id', headerId)
    if (error) throw error
    return data as unknown as STKLine[]
  }

  async function createLine(data: any) {
    const { data: created, error } = await supabase.from('stk_trx_lines').insert(data).select('id, header_id, article_id, quantite_trx, prix_unitaire, numero_lot')
    if (error) throw error
    return created?.[0]
  }

  async function removeLine(id: string) {
    const { error } = await supabase.from('stk_trx_lines').delete().eq('id', id)
    if (error) throw error
  }

  async function fetchLineDetails(lineId: string) {
    const { data, error } = await supabase.from('stk_trx_details').select('id, line_id, numero_serie, date_trx, statut').eq('line_id', lineId)
    if (error) throw error
    return data as unknown as STKLineDetail[]
  }

  async function createLineDetail(data: any) {
    const { data: created, error } = await supabase.from('stk_trx_details').insert(data)
    if (error) throw error
    return created
  }

  async function removeLineDetail(id: string) {
    const { error } = await supabase.from('stk_trx_details').delete().eq('id', id)
    if (error) throw error
  }

  async function fetchLinesDetails(lineIds: string[]) {
    const { data, error } = await supabase.from('stk_trx_lines_details').select('id, line_id').in('line_id', lineIds)
    if (error) throw error
    return data
  }

  async function createLinesDetails(data: any[]) {
    const { data: created, error } = await supabase.from('stk_trx_lines_details').insert(data as any).select('id, line_id')
    if (error) throw error
    return created
  }

  async function fetchStockData() {
    loading.value = true
    const { data, error } = await supabase
      .from('stk_data')
      .select('id, quantite, numero_lot, statut, date_trx, article:article_id(id, nom, code), organisation:organisation_id(id, nom, code), location:location_id(id, nom, code)')
    if (error) throw error
    if (data) stockData.value = data as unknown as Stock[]
    loading.value = false
    return stockData.value
  }

  async function executeStockUpdate(headerId: string) {
    const { data, error } = await supabase.rpc('stock_update', { p_stk_header_id: headerId } as any)
    if (error) throw error
    return data
  }

  function subscribeToRealtime(table: string, onChange: () => void): () => void {
    const channel = supabase
      .channel(`${table}_realtime`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, onChange)
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }

  return {
    headers, stockData, loading,
    fetchHeaders, createHeader, updateHeader, removeHeader,
    fetchLines, createLine, removeLine,
    fetchLineDetails, createLineDetail, removeLineDetail,
    fetchLinesDetails, createLinesDetails,
    fetchStockData, executeStockUpdate, subscribeToRealtime,
  }
})
