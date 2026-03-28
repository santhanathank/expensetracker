import { useState, useEffect, useContext } from 'react'
import AddExpense from './AddExpense'
import ExpenseList from './ExpenseList'
import ExpenseChart from './ExpenseChart'
import MonthlySummary from './MonthlySummary'
import BudgetTracker from './BudgetTracker'
import RecurringExpenses from './RecurringExpenses'
import { AuthContext } from '../context/AuthContext'
import { Expense, Budget, RecurringExpense } from '../types'
import { expensesAPI, budgetsAPI, recurringAPI } from '../api'

function Dashboard() {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    return <div>Error: Auth context not available</div>
  }

  const { user, logout } = authContext

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpense[]>([])
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'budget' | 'recurring'>('dashboard')
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7))

  // Load data from API on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [expensesRes, budgetsRes, recurringRes] = await Promise.all([
          expensesAPI.getAll(),
          budgetsAPI.getAll(),
          recurringAPI.getAll()
        ])

        setExpenses(expensesRes.data)
        setBudgets(budgetsRes.data)
        setRecurringExpenses(recurringRes.data)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }

    loadData()
  }, [])

  // Add new expense
  const handleAddExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const response = await expensesAPI.create(expense)
      setExpenses([...expenses, { ...response.data, id: response.data._id || response.data.id }])
    } catch (error) {
      console.error('Error adding expense:', error)
    }
  }

  // Delete expense
  const handleDeleteExpense = async (id: string) => {
    try {
      await expensesAPI.delete(id)
      setExpenses(expenses.filter(e => e.id !== id))
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }

  // Update expense
  const handleUpdateExpense = async (id: string, updatedExpense: Omit<Expense, 'id'>) => {
    try {
      await expensesAPI.update(id, updatedExpense)
      setExpenses(expenses.map(e => e.id === id ? { ...updatedExpense, id } : e))
    } catch (error) {
      console.error('Error updating expense:', error)
    }
  }

  // Add budget
  const handleAddBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      if (!budget.category || !budget.limit || !budget.month) {
        console.error('Missing required budget fields:', budget)
        return
      }
      
      const response = await budgetsAPI.create(budget)
      const newBudget = {
        ...response.data,
        id: response.data.id || response.data._id
      }
      setBudgets([...budgets, newBudget])
    } catch (error) {
      console.error('Error adding budget:', error)
    }
  }

  // Delete budget
  const handleDeleteBudget = async (id: string) => {
    try {
      await budgetsAPI.delete(id)
      setBudgets(budgets.filter(b => b.id !== id))
    } catch (error) {
      console.error('Error deleting budget:', error)
    }
  }

  // Add recurring expense
  const handleAddRecurring = async (expense: Omit<RecurringExpense, 'id'>) => {
    try {
      const response = await recurringAPI.create(expense)
      setRecurringExpenses([...recurringExpenses, { ...response.data, id: response.data._id || response.data.id }])
    } catch (error) {
      console.error('Error adding recurring expense:', error)
    }
  }

  // Delete recurring expense
  const handleDeleteRecurring = async (id: string) => {
    try {
      await recurringAPI.delete(id)
      setRecurringExpenses(recurringExpenses.filter(e => e.id !== id))
    } catch (error) {
      console.error('Error deleting recurring expense:', error)
    }
  }

  // Get expenses for the selected month
  const monthExpenses = expenses.filter(e => e.date.startsWith(month))

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <h1>💰 Expense Tracker</h1>
            <p className="subtitle">Manage your monthly expenses effectively</p>
          </div>
          <div className="header-user">
            <span>{user?.email}</span>
            <button onClick={logout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>

      <nav className="tabs-nav">
        <button 
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab-button ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          📝 Expenses
        </button>
        <button 
          className={`tab-button ${activeTab === 'budget' ? 'active' : ''}`}
          onClick={() => setActiveTab('budget')}
        >
          🎯 Budget
        </button>
        <button 
          className={`tab-button ${activeTab === 'recurring' ? 'active' : ''}`}
          onClick={() => setActiveTab('recurring')}
        >
          🔄 Recurring
        </button>
      </nav>

      <div className="app-container">
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <div className="month-selector">
              <label htmlFor="month">Select Month:</label>
              <input 
                type="month" 
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
            <div className="dashboard-grid">
              <div className="dashboard-section">
                <MonthlySummary expenses={monthExpenses} budgets={budgets} recurringExpenses={recurringExpenses} />
              </div>
              <div className="dashboard-section">
                <ExpenseChart expenses={monthExpenses} />
              </div>
              <div className="dashboard-section">
                <BudgetTracker budgets={budgets} expenses={monthExpenses} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="tab-content">
            <div className="expenses-grid">
              <div className="add-section">
                <AddExpense onAddExpense={handleAddExpense} />
              </div>
              <div className="list-section">
                <ExpenseList 
                  expenses={monthExpenses}
                  onDeleteExpense={handleDeleteExpense}
                  onUpdateExpense={handleUpdateExpense}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'budget' && (
          <div className="tab-content">
            <BudgetTracker 
              budgets={budgets}
              expenses={monthExpenses}
              onAddBudget={handleAddBudget}
              onDeleteBudget={handleDeleteBudget}
              isFullPage={true}
            />
          </div>
        )}

        {activeTab === 'recurring' && (
          <div className="tab-content">
            <RecurringExpenses 
              recurringExpenses={recurringExpenses}
              onAddRecurring={handleAddRecurring}
              onDeleteRecurring={handleDeleteRecurring}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
