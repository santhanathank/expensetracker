// Currency formatting utility
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

export const formatCurrencySimple = (amount: number): string => {
  return `₹${amount.toFixed(2)}`
}
