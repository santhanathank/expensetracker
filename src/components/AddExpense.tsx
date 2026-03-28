import { useState } from 'react'
import { Expense, Category } from '../types'
import './AddExpense.css'

const CATEGORIES: Category[] = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Education', 'Other']

interface AddExpenseProps {
  onAddExpense: (expense: Omit<Expense, 'id'>) => void
}

export default function AddExpense({ onAddExpense }: AddExpenseProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Other')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!description || !amount || parseFloat(amount) <= 0) {
      alert('Please fill in all required fields with valid values')
      return
    }

    onAddExpense({
      description,
      amount: parseFloat(amount),
      category,
      date,
      notes: notes || undefined,
    })

    // Reset form
    setDescription('')
    setAmount('')
    setCategory('Other')
    setDate(new Date().toISOString().split('T')[0])
    setNotes('')
  }

  return (
    <div className="add-expense">
      <h2>➕ Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Lunch, Gas, Movie"
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
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date *</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional notes..."
            rows={3}
          />
        </div>

        <button type="submit" className="btn-submit">Add Expense</button>
      </form>
    </div>
  )
}
