import { defineStore } from 'pinia'
import type { Article, ArticleAffectation } from '~/types'

export const useArticlesStore = defineStore('articles', () => {
  const supabase = useSupabaseClient()
  const items = ref<Article[]>([])
  const loading = ref(false)

  async function fetchAll(ownerId?: string | null) {
    loading.value = true
    let query = supabase.from('articles').select('id, nom, code, description, owner_id, type_article_id, unite_conso_id, unite_stock_id, lookup:type_article_id(id, nom), unite_conso:unite_conso_id(id, nom), unite_stock:unite_stock_id(id, nom)')
    if (ownerId) query = query.eq('owner_id', ownerId)
    const { data, error } = await query
    if (error) throw error
    if (data) items.value = data as unknown as Article[]
    loading.value = false
    return items.value
  }

  async function create(data: Partial<Article>) {
    const { data: created, error } = await supabase.from('articles').insert(data).select('id, nom, code, description, owner_id, type_article_id, unite_conso_id, unite_stock_id')
    if (error) throw error
    if (created) items.value.unshift(created[0] as unknown as Article)
    return created[0]
  }

  async function update(id: string, data: Partial<Article>) {
    const { data: updated, error } = await supabase.from('articles').update(data).eq('id', id).select('id, nom, code, description, owner_id, type_article_id, unite_conso_id, unite_stock_id')
    if (error) throw error
    if (updated) {
      const idx = items.value.findIndex(a => a.id === id)
      if (idx !== -1) items.value[idx] = updated[0] as unknown as Article
    }
    return updated?.[0]
  }

  async function remove(id: string) {
    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) throw error
    items.value = items.value.filter(a => a.id !== id)
  }

  async function fetchArticleOrgs(articleId: string) {
    const { data, error } = await supabase
      .from('article_organisations')
      .select('id, article_id, organisation_id, organisation:organisations(id, nom, code)')
      .eq('article_id', articleId)
    if (error) throw error
    return data as unknown as ArticleAffectation[]
  }

  async function fetchAssignedOrgIds(articleId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('article_organisations')
      .select('organisation_id')
      .eq('article_id', articleId)
    if (error) throw error
    return (data || []).map((r: any) => r.organisation_id)
  }

  async function attachOrg(articleId: string, organisationId: string) {
    const { error } = await supabase.from('article_organisations').insert({ article_id: articleId, organisation_id: organisationId })
    if (error) throw error
  }

  async function detachOrg(id: string) {
    const { error } = await supabase.from('article_organisations').delete().eq('id', id)
    if (error) throw error
  }

  return { items, loading, fetchAll, create, update, remove, fetchArticleOrgs, fetchAssignedOrgIds, attachOrg, detachOrg }
})
