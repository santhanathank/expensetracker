import { Expense } from '../types'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrencySimple } from '../utils/currency'
import './ExpenseChart.css'

interface ExpenseChartProps {
  expenses: Expense[]
}

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  // Prepare category data for pie chart
  const categoryData = expenses.reduce((acc, expense) => {
    const existing = acc.find(item => item.name === expense.category)
    if (existing) {
      existing.value += expense.amount
    } else {
      acc.push({ name: expense.category, value: expense.amount })
    }
    return acc
  }, [] as Array<{ name: string; value: number }>)

  // Prepare daily data for bar chart
  const dailyData = expenses.reduce((acc, expense) => {
    const date = new Date(expense.date).toLocaleDateString()
    const existing = acc.find(item => item.date === date)
    if (existing) {
      existing.amount += expense.amount
    } else {
      acc.push({ date, amount: expense.amount })
    }
    return acc
  }, [] as Array<{ date: string; amount: number }>)

  dailyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a', '#fee140', '#30cfd0']

  return (
    <div className="expense-chart">
      <h2>📊 Expense Analysis</h2>

      {expenses.length === 0 ? (
        <div className="no-data">
          <p>No expenses to visualize yet</p>
        </div>
      ) : (
        <>
          <div className="charts-container">
            <div className="chart-wrapper">
              <h3>By Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-wrapper">
              <h3>Daily Expenses</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
                  <Bar dataKey="amount" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="category-summary">
            <h3>Category Breakdown</h3>
            <div className="summary-list">
              {categoryData.map((item, index) => (
                <div key={item.name} className="summary-item">
                  <div className="summary-label">
                    <span className="color-dot" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span>{item.name}</span>
                  </div>
                  <span className="summary-amount">{formatCurrencySimple(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
