import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __API_URL__: JSON.stringify(
      process.env.VITE_API_URL || 'https://expense-tracker-api-dhfac2daecgxbags.centralindia-01.azurewebsites.net'
    )
  }
})
