import { defineStore } from 'pinia'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import type { NF } from '~/types'

interface storeNF {
  user: User
  description: string
  baseUrl: string
  nf_headers: NF[]
  supabase: SupabaseClient | null | any
}

export const useStoreNF = defineStore('nf', {
  state: (): storeNF => ({
    user: null,
    nf_headers: [] as NF[],
    baseUrl: 'http://127.0.0.1:4000/v1',
    description: '',
    supabase: null,
  }),
  getters: {
    defaultStatutApprobation: state =>
      state.nf_headers.reduce((acc, nf) => {
        if (!acc.includes(nf.statut_approbation)) {
          acc.push(nf.statut_approbation)
        }
        return acc
      }, [] as string[]),
    defaultStatutPaiement: state =>
      state.nf_headers.reduce((acc, nf) => {
        if (!acc.includes(nf.statut_paiement)) {
          acc.push(nf.statut_paiement)
        }
        return acc
      }, [] as string[]),
    defaultStatutProgammation: state =>
      state.nf_headers.reduce((acc, nf) => {
        if (!acc.includes(nf.statut_programmation)) {
          acc.push(nf.statut_programmation)
        }
        return acc
      }, [] as string[]),
    defaultStatutPlannification: state =>
      state.nf_headers.reduce((acc, nf) => {
        if (!acc.includes(nf.statut_plannification)) {
          acc.push(nf.statut_plannification)
        }
        return acc
      }, [] as string[]),
  },
  actions: {
    async init() {
      this.supabase = useSupabaseClient()
    },
    async addNF(payload: any) {
      this.nf_headers.push(payload)
    },
    async getAllNF(filter?: any) {
      let query = this.supabase.from('nf_headers').select('*')
      if (filter) {
        for (const [key, value] of Object.entries(filter)) {
          console.log(`Key: ${key}, Value: ${value}`)
          if (Array.isArray(value)) query = query.in(key, value)
          if (value) query = query.eq(key, value)
        }
        const { data, error } = await query
        if (!error) this.nf_headers = data
        else return { error }
      }
      const { data, error } = await this.supabase.from('nf_headers').select('*')
      if (!error) this.nf_headers = data
      else return { error }
    },
  },
})
