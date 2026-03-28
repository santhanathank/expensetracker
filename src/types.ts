export interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
  notes?: string
}

export interface Budget {
  id: string
  category: string
  limit: number
  month: number
  year?: number
}

export interface RecurringExpense {
  id: string
  description: string
  amount: number
  category: string
  frequency: 'weekly' | 'monthly' | 'yearly'
  startDate: string
  endDate?: string
}

export type Category = 'Food' | 'Transport' | 'Entertainment' | 'Utilities' | 'Health' | 'Shopping' | 'Education' | 'Other'
