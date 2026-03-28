import express from 'express'
import { getPool } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'
import sql from 'mssql'
import { randomUUID } from 'crypto'

const router = express.Router()

router.use(authMiddleware)

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, req.userId)
      .query('SELECT id, userId, amount, category, description, date FROM expenses WHERE userId = @userId ORDER BY date DESC')

    res.json(result.recordset.map(exp => ({
      id: exp.id,
      userId: exp.userId,
      amount: exp.amount,
      category: exp.category,
      description: exp.description,
      date: exp.date.toISOString().split('T')[0]
    })))
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error: error.message })
  }
})

// Create expense
router.post('/', async (req, res) => {
  try {
    const { description, amount, category, date } = req.body
    const expenseId = randomUUID()

    const pool = getPool()
    await pool.request()
      .input('id', sql.UniqueIdentifier, expenseId)
      .input('userId', sql.UniqueIdentifier, req.userId)
      .input('amount', sql.Decimal(10, 2), amount)
      .input('category', sql.NVarChar, category)
      .input('description', sql.NVarChar, description || '')
      .input('date', sql.Date, date)
      .query(`
        INSERT INTO expenses (id, userId, amount, category, description, date)
        VALUES (@id, @userId, @amount, @category, @description, @date)
      `)

    res.status(201).json({
      id: expenseId,
      userId: req.userId,
      amount,
      category,
      description,
      date
    })
  } catch (error) {
    res.status(500).json({ message: 'Error creating expense', error: error.message })
  }
})

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const { description, amount, category, date } = req.body
    const pool = getPool()

    const checkResult = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .input('userId', sql.UniqueIdentifier, req.userId)
      .query('SELECT id FROM expenses WHERE id = @id AND userId = @userId')

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .input('amount', sql.Decimal(10, 2), amount)
      .input('category', sql.NVarChar, category)
      .input('description', sql.NVarChar, description || '')
      .input('date', sql.Date, date)
      .query(`
        UPDATE expenses
        SET amount = @amount, category = @category, description = @description, date = @date
        WHERE id = @id
      `)

    res.json({
      id: req.params.id,
      userId: req.userId,
      amount,
      category,
      description,
      date
    })
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error: error.message })
  }
})

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()

    const checkResult = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .input('userId', sql.UniqueIdentifier, req.userId)
      .query('SELECT id FROM expenses WHERE id = @id AND userId = @userId')

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query('DELETE FROM expenses WHERE id = @id')

    res.json({ message: 'Expense deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error: error.message })
  }
})

export default router
