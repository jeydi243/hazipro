import { defineStore } from 'pinia'

export const useBudget = defineStore('budget', {
  state: () => ({
    total: 0,
    budgets: [] as { description: string; amount: number }[],
  }),
  getters: {
    remainingBudget: state => state.total - state.expenses.reduce((sum, expense) => sum + expense.amount, 0),
  },
  actions: {
    init() {
      this.budgets = []
    },
  },
})
