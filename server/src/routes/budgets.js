import express from 'express'
import { getPool } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'
import sql from 'mssql'
import { randomUUID } from 'crypto'

const router = express.Router()

router.use(authMiddleware)

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, req.userId)
      .query('SELECT id, userId, category, limit, month, year FROM budgets WHERE userId = @userId')

    res.json(result.recordset)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budgets', error: error.message })
  }
})

// Create budget
router.post('/', async (req, res) => {
  try {
    const { category, limit, month, year } = req.body
    const budgetId = randomUUID()

    const pool = getPool()
    await pool.request()
      .input('id', sql.UniqueIdentifier, budgetId)
      .input('userId', sql.UniqueIdentifier, req.userId)
      .input('category', sql.NVarChar, category)
      .input('limit', sql.Decimal(10, 2), limit)
      .input('month', sql.Int, month)
      .input('year', sql.Int, year || new Date().getFullYear())
      .query(`
        INSERT INTO budgets (id, userId, category, limit, month, year)
        VALUES (@id, @userId, @category, @limit, @month, @year)
      `)

    res.status(201).json({
      id: budgetId,
      userId: req.userId,
      category,
      limit,
      month,
      year: year || new Date().getFullYear()
    })
  } catch (error) {
    res.status(500).json({ message: 'Error creating budget', error: error.message })
  }
})

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()

    const checkResult = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .input('userId', sql.UniqueIdentifier, req.userId)
      .query('SELECT id FROM budgets WHERE id = @id AND userId = @userId')

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Budget not found' })
    }

    await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query('DELETE FROM budgets WHERE id = @id')

    res.json({ message: 'Budget deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting budget', error: error.message })
  }
})

export default router
