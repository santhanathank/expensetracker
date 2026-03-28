import mongoose from 'mongoose'

const recurringExpenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const RecurringExpense = mongoose.model('RecurringExpense', recurringExpenseSchema)
