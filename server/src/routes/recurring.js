import express from 'express'
import { getPool } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'
import sql from 'mssql'
import { randomUUID } from 'crypto'

const router = express.Router()

router.use(authMiddleware)

// Get all recurring expenses
router.get('/', async (req, res) => {
  try {
    const pool = getPool()
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, req.userId)
      .query('SELECT id, userId, amount, category, frequency, description, startDate FROM recurringExpenses WHERE userId = @userId')

    res.json(result.recordset.map(rec => ({
      id: rec.id,
      userId: rec.userId,
      amount: rec.amount,
      category: rec.category,
      frequency: rec.frequency,
      description: rec.description,
      startDate: rec.startDate.toISOString().split('T')[0]
    })))
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recurring expenses', error: error.message })
  }
})

// Create recurring expense
router.post('/', async (req, res) => {
  try {
    const { description, amount, category, frequency, startDate } = req.body
    const recurringId = randomUUID()

    const pool = getPool()
    await pool.request()
      .input('id', sql.UniqueIdentifier, recurringId)
      .input('userId', sql.UniqueIdentifier, req.userId)
      .input('amount', sql.Decimal(10, 2), amount)
      .input('category', sql.NVarChar, category)
      .input('frequency', sql.NVarChar, frequency)
      .input('description', sql.NVarChar, description || '')
      .input('startDate', sql.Date, startDate)
      .query(`
        INSERT INTO recurringExpenses (id, userId, amount, category, frequency, description, startDate)
        VALUES (@id, @userId, @amount, @category, @frequency, @description, @startDate)
      `)

    res.status(201).json({
      id: recurringId,
      userId: req.userId,
      amount,
      category,
      frequency,
      description,
      startDate
    })
  } catch (error) {
    res.status(500).json({ message: 'Error creating recurring expense', error: error.message })
  }
})

// Delete recurring expense
router.delete('/:id', async (req, res) => {
  try {
    const pool = getPool()

    const checkResult = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .input('userId', sql.UniqueIdentifier, req.userId)
      .query('SELECT id FROM recurringExpenses WHERE id = @id AND userId = @userId')

    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Recurring expense not found' })
    }

    await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query('DELETE FROM recurringExpenses WHERE id = @id')

    res.json({ message: 'Recurring expense deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recurring expense', error: error.message })
  }
})

export default router
