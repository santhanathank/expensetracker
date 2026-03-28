import { Expense, Budget, RecurringExpense } from '../types'
import { formatCurrencySimple } from '../utils/currency'
import './MonthlySummary.css'

interface MonthlySummaryProps {
  expenses: Expense[]
  budgets: Budget[]
  recurringExpenses: RecurringExpense[]
}

export default function MonthlySummary({ expenses, budgets, recurringExpenses }: MonthlySummaryProps) {
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0)
  const categoryExpenses = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0)
  const budgetStatus = {
    onTrack: 0,
    atRisk: 0,
    exceeded: 0,
  }

  budgets.forEach(budget => {
    const spent = categoryExpenses[budget.category] || 0
    const percentage = (spent / budget.limit) * 100

    if (percentage > 100) {
      budgetStatus.exceeded++
    } else if (percentage > 80) {
      budgetStatus.atRisk++
    } else {
      budgetStatus.onTrack++
    }
  })

  const highestCategory = Object.entries(categoryExpenses).sort((a, b) => b[1] - a[1])[0]

  const totalMonthlyRecurring = recurringExpenses
    .filter(expense => expense.frequency === 'monthly')
    .reduce((sum, e) => sum + e.amount, 0)

  return (
    <div className="monthly-summary">
      <h2>📈 Monthly Summary</h2>

      <div className="summary-cards">
        <div className="summary-card total">
          <div className="card-header">Total Spent</div>
          <div className="card-value">{formatCurrencySimple(totalExpense)}</div>
          <div className="card-subtitle">{expenses.length} transactions</div>
        </div>

        <div className="summary-card budget">
          <div className="card-header">Total Budget</div>
          <div className="card-value">{formatCurrencySimple(totalBudget)}</div>
          <div className="card-subtitle">Allocated</div>
        </div>

        <div className="summary-card remaining">
          <div className="card-header">Remaining</div>
          <div className={`card-value ${totalExpense > totalBudget ? 'alert' : ''}`}>
            {formatCurrencySimple(Math.max(0, totalBudget - totalExpense))}
          </div>
          <div className="card-subtitle">
            {totalBudget === 0 ? 'No budget set' : totalExpense > totalBudget ? 'Over budget!' : 'Available'}
          </div>
        </div>

        <div className="summary-card average">
          <div className="card-header">Average Daily</div>
          <div className="card-value">
            {formatCurrencySimple(expenses.length > 0 ? (totalExpense / 30) : 0)}
          </div>
          <div className="card-subtitle">of month</div>
        </div>

        <div className="summary-card recurring">
          <div className="card-header">Monthly Recurring</div>
          <div className="card-value">{formatCurrencySimple(totalMonthlyRecurring)}</div>
          <div className="card-subtitle">{recurringExpenses.filter(e => e.frequency === 'monthly').length} expenses</div>
        </div>
      </div>

      {highestCategory && (
        <div className="highest-expense">
          <h3>Highest Spending Category</h3>
          <div className="highest-category">
            <span>{highestCategory[0]}</span>
            <span className="amount">{formatCurrencySimple(highestCategory[1])}</span>
          </div>
        </div>
      )}

      {budgets.length > 0 && (
        <div className="budget-status">
          <h3>Budget Status</h3>
          <div className="status-cards">
            <div className="status-item on-track">
              <span className="status-icon">✅</span>
              <div>
                <div className="status-count">{budgetStatus.onTrack}</div>
                <div className="status-label">On Track</div>
              </div>
            </div>
            <div className="status-item at-risk">
              <span className="status-icon">⚠️</span>
              <div>
                <div className="status-count">{budgetStatus.atRisk}</div>
                <div className="status-label">At Risk</div>
              </div>
            </div>
            <div className="status-item exceeded">
              <span className="status-icon">❌</span>
              <div>
                <div className="status-count">{budgetStatus.exceeded}</div>
                <div className="status-label">Exceeded</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
