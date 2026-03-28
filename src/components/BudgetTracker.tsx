import { useState } from 'react'
import { Budget, Expense } from '../types'
import { formatCurrencySimple } from '../utils/currency'
import './BudgetTracker.css'

interface BudgetTrackerProps {
  budgets: Budget[]
  expenses: Expense[]
  onAddBudget?: (budget: Omit<Budget, 'id'>) => void
  onDeleteBudget?: (id: string) => void
  isFullPage?: boolean
}

export default function BudgetTracker({ budgets, expenses, onAddBudget, onDeleteBudget, isFullPage = false }: BudgetTrackerProps) {
  const [category, setCategory] = useState('')
  const [limit, setLimit] = useState('')

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault()
    if (!onAddBudget || !category || !limit) return

    const now = new Date()
    onAddBudget({
      category,
      limit: parseFloat(limit),
      month: now.getMonth() + 1,        // 1-12
      year: now.getFullYear()
    })

    setCategory('')
    setLimit('')
  }

  const categoryExpenses = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Education', 'Other']

  return (
    <div className={`budget-tracker ${isFullPage ? 'full-page' : ''}`}>
      <h2>{isFullPage ? '🎯 Budget Management' : '🎯 Budget Overview'}</h2>

      {onAddBudget && isFullPage && (
        <form onSubmit={handleAddBudget} className="budget-form">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="limit">Monthly Limit (₹)</label>
            <input
              type="number"
              id="limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <button type="submit">Add Budget</button>
        </form>
      )}

      {budgets.length === 0 ? (
        <div className="no-budgets">
          <p>No budgets set yet. {isFullPage ? 'Add one above!' : ''}</p>
        </div>
      ) : (
        <div className="budgets-list">
          {budgets.map(budget => {
            const spent = categoryExpenses[budget.category] || 0
            const remaining = budget.limit - spent
            const percentage = (spent / budget.limit) * 100
            const status = percentage > 100 ? 'exceeded' : percentage > 80 ? 'at-risk' : 'on-track'

            return (
              <div key={budget.id} className={`budget-item ${status}`}>
                <div className="budget-header">
                  <h3>{budget.category}</h3>
                  {onDeleteBudget && isFullPage && (
                    <button onClick={() => onDeleteBudget(budget.id)} className="btn-delete">🗑️</button>
                  )}
                </div>

                <div className="budget-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
                  </div>
                  <div className="progress-text">
                    <span>{formatCurrencySimple(spent)} / {formatCurrencySimple(budget.limit)}</span>
                    <span className={`percentage ${status}`}>{percentage.toFixed(0)}%</span>
                  </div>
                </div>

                <div className="budget-details">
                  {remaining > 0 ? (
                    <span className="remaining">💚 {formatCurrencySimple(remaining)} remaining</span>
                  ) : (
                    <span className="exceeded">❌ {formatCurrencySimple(Math.abs(remaining))} over budget</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
