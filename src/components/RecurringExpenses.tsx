import { useState } from 'react'
import { RecurringExpense } from '../types'
import { formatCurrencySimple } from '../utils/currency'
import './RecurringExpenses.css'

interface RecurringExpensesProps {
  recurringExpenses: RecurringExpense[]
  onAddRecurring: (expense: Omit<RecurringExpense, 'id'>) => void
  onDeleteRecurring: (id: string) => void
}

export default function RecurringExpenses({ recurringExpenses, onAddRecurring, onDeleteRecurring }: RecurringExpensesProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Other')
  const [frequency, setFrequency] = useState<'weekly' | 'monthly' | 'yearly'>('monthly')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!description || !amount || parseFloat(amount) <= 0) {
      alert('Please fill in all required fields')
      return
    }

    onAddRecurring({
      description,
      amount: parseFloat(amount),
      category,
      frequency,
      startDate,
    })

    setDescription('')
    setAmount('')
    setCategory('Other')
    setFrequency('monthly')
    setStartDate(new Date().toISOString().split('T')[0])
  }

  const getFrequencyEmoji = (freq: string) => {
    const emojiMap: Record<string, string> = {
      'weekly': '📅',
      'monthly': '📆',
      'yearly': '📋'
    }
    return emojiMap[freq] || '📌'
  }

  const totalMonthly = recurringExpenses
    .filter(expense => expense.frequency === 'monthly')
    .reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="recurring-expenses">
      <h2>🔄 Recurring Expenses</h2>

      <form onSubmit={handleSubmit} className="recurring-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Gym membership, Netflix"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (₹) *</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Health">Health</option>
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Education">Education</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="frequency">Frequency *</label>
            <select
              id="frequency"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as any)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group button-group">
            <button type="submit">Add Recurring Expense</button>
          </div>
        </div>
      </form>

      {recurringExpenses.length === 0 ? (
        <div className="no-recurring">
          <p>No recurring expenses set up yet</p>
        </div>
      ) : (
        <>
          <div className="recurring-summary">
            <div className="summary-item">
              <strong>Total Monthly Commitment:</strong>
              <span className="amount">{formatCurrencySimple(totalMonthly)}</span>
            </div>
          </div>

          <div className="recurring-list">
            {recurringExpenses.map(expense => (
              <div key={expense.id} className="recurring-item">
                <div className="recurring-header">
                  <div className="recurring-info">
                    <span className="emoji">{getFrequencyEmoji(expense.frequency)}</span>
                    <div className="info-text">
                      <strong>{expense.description}</strong>
                      <small>{expense.category} • {frequency === expense.frequency ? 'Starting ' : ''}
                        {new Date(expense.startDate).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                  <button onClick={() => onDeleteRecurring(expense.id)} className="btn-remove">🗑️</button>
                </div>

                <div className="recurring-details">
                  <span className="badge">{expense.frequency.charAt(0).toUpperCase() + expense.frequency.slice(1)}</span>
                  <span className="amount">{formatCurrencySimple(expense.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
