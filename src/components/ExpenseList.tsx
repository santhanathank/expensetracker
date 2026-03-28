import { useState } from 'react'
import { Expense } from '../types'
import { formatCurrencySimple } from '../utils/currency'
import './ExpenseList.css'

interface ExpenseListProps {
  expenses: Expense[]
  onDeleteExpense: (id: string) => void
  onUpdateExpense: (id: string, expense: Omit<Expense, 'id'>) => void
}

export default function ExpenseList({ expenses, onDeleteExpense, onUpdateExpense }: ExpenseListProps) {
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'category'>('date')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Omit<Expense, 'id'> | null>(null)

  const categories = ['all', ...new Set(expenses.map(e => e.category))]

  let sortedExpenses = [...expenses]

  // Filter by category
  if (filterCategory !== 'all') {
    sortedExpenses = sortedExpenses.filter(e => e.category === filterCategory)
  }

  // Sort
  if (sortBy === 'date') {
    sortedExpenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } else if (sortBy === 'amount') {
    sortedExpenses.sort((a, b) => b.amount - a.amount)
  } else if (sortBy === 'category') {
    sortedExpenses.sort((a, b) => a.category.localeCompare(b.category))
  }

  const totalExpense = sortedExpenses.reduce((sum, e) => sum + e.amount, 0)

  const handleEdit = (expense: Expense) => {
    setEditingId(expense.id)
    setEditData({ ...expense })
  }

  const handleSaveEdit = (id: string) => {
    if (editData) {
      onUpdateExpense(id, editData)
      setEditingId(null)
      setEditData(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData(null)
  }

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      'Food': '🍔',
      'Transport': '🚗',
      'Entertainment': '🎬',
      'Utilities': '💡',
      'Health': '⚕️',
      'Shopping': '🛍️',
      'Education': '📚',
      'Other': '📌'
    }
    return emojiMap[category] || '📌'
  }

  return (
    <div className="expense-list">
      <h2>📋 Expense History</h2>

      <div className="controls">
        <div className="control-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
            <option value="date">Date (Newest)</option>
            <option value="amount">Amount (Highest)</option>
            <option value="category">Category</option>
          </select>
        </div>

        <div className="control-group">
          <label>Filter by:</label>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {sortedExpenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses yet. Add one to get started! 👉</p>
        </div>
      ) : (
        <>
          <div className="total-summary">
            <strong>Total: {formatCurrencySimple(totalExpense)}</strong>
          </div>

          <div className="expenses-table">
            {sortedExpenses.map(expense => (
              <div key={expense.id} className={`expense-item ${editingId === expense.id ? 'editing' : ''}`}>
                {editingId === expense.id && editData ? (
                  <div className="edit-form">
                    <input 
                      type="text"
                      value={editData.description}
                      onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    />
                    <input 
                      type="number"
                      step="0.01"
                      value={editData.amount}
                      onChange={(e) => setEditData({ ...editData, amount: parseFloat(e.target.value) })}
                    />
                    <input 
                      type="date"
                      value={editData.date}
                      onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                    />
                    <div className="edit-buttons">
                      <button onClick={() => handleSaveEdit(expense.id)} className="btn-save">Save</button>
                      <button onClick={handleCancel} className="btn-cancel">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="expense-content">
                    <div className="expense-info">
                      <div className="expense-header">
                        <span className="emoji">{getCategoryEmoji(expense.category)}</span>
                        <div className="description">
                          <strong>{expense.description}</strong>
                          <small>{new Date(expense.date).toLocaleDateString()}</small>
                        </div>
                      </div>
                      <span className="category-badge">{expense.category}</span>
                    </div>
                    <div className="expense-actions">
                      <span className="amount">{formatCurrencySimple(expense.amount)}</span>
                      <button onClick={() => handleEdit(expense)} className="btn-edit">✏️</button>
                      <button onClick={() => onDeleteExpense(expense.id)} className="btn-delete">🗑️</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
