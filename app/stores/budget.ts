import { defineStore } from 'pinia'

export const useStoreBudget = defineStore('budget', {
  state: () => ({
    total: 0,
    budgets: [] as { description: string; amount: number }[],
  }),
  getters: {
    budgets: state => state.budgets
  },
  actions: {
    init() {
      this.budgets = []
    },
  },
})
