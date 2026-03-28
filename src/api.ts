import axios from 'axios'

// Get API URL from environment or use production backend
const API_URL = (
  import.meta.env.VITE_API_URL || 
  (typeof __API_URL__ !== 'undefined' ? __API_URL__ : '') ||
  'https://expense-tracker-api-dhfac2daecgxbags.centralindia-01.azurewebsites.net/api'
).replace(/\/api$/, '') + '/api'

console.log('API URL:', API_URL)

const api = axios.create({
  baseURL: API_URL
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authAPI = {
  register: (email: string, password: string) =>
    api.post('/auth/register', { email, password }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password })
}

export const expensesAPI = {
  getAll: () => api.get('/expenses'),
  create: (expense: any) => api.post('/expenses', expense),
  update: (id: string, expense: any) => api.put(`/expenses/${id}`, expense),
  delete: (id: string) => api.delete(`/expenses/${id}`)
}

export const budgetsAPI = {
  getAll: () => api.get('/budgets'),
  create: (budget: any) => api.post('/budgets', budget),
  delete: (id: string) => api.delete(`/budgets/${id}`)
}

export const recurringAPI = {
  getAll: () => api.get('/recurring'),
  create: (expense: any) => api.post('/recurring', expense),
  delete: (id: string) => api.delete(`/recurring/${id}`)
}

export default api
