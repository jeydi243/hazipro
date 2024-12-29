import { defineStore } from 'pinia'

export const useBudget = defineStore('budget', {
  state: () => ({
    total: 0,
    budgets: [] as { description: string; amount: number }[],
  }),
  getters: {
    remainingBudget: state => state.budgets
  },
  actions: {
    init() {
      this.budgets = []
    },
  },
})
