import { useContext } from 'react'
import './App.css'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import { AuthContext } from './context/AuthContext'

function App() {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    return <div>Error: Auth context not available</div>
  }

  const { user, token } = authContext

  // If not authenticated, show login
  if (!token || !user) {
    return <Auth />
  }

  // If authenticated, show dashboard
  return <Dashboard />
}

export default App
