import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:3003', // The back-end server (secure)
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false, // If using self-signed certificates, set this to false
      }
    }
  }
})