import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectToDatabase, closeDatabase } from './db.js'
import authRoutes from './routes/auth.js'
import expenseRoutes from './routes/expenses.js'
import budgetRoutes from './routes/budgets.js'
import recurringRoutes from './routes/recurring.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Azure SQL Database Connection
let dbPool
connectToDatabase().then(pool => {
  dbPool = pool
  console.log('✅ All database tables verified and ready')
}).catch(err => {
  console.error('❌ Failed to connect to database:', err)
  process.exit(1)
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/recurring', recurringRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`   API Health Check: http://localhost:${PORT}/api/health`)
})
