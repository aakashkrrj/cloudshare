import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Proxy API calls in dev to avoid CORS with hosted backend
      '/api/v1.0': {
        target: 'https://cloud-share-api-render.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
