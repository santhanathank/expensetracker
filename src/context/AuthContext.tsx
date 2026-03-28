import { createContext, useState, useEffect, ReactNode, useContext } from 'react'
import { authAPI } from '../api'

interface User {
  id: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  token: string | null
  register: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    if (token) {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'))
    }
    setLoading(false)
  }, [])

  const register = async (email: string, password: string) => {
    const response = await authAPI.register(email, password)
    const { token: newToken, user: newUser } = response.data
    
    localStorage.setItem('authToken', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    
    setToken(newToken)
    setUser(newUser)
  }

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password)
    const { token: newToken, user: newUser } = response.data
    
    localStorage.setItem('authToken', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
    
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
