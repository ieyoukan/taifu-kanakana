import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { host: true, port: 5173 },
  build: {
    assetsInlineLimit: 0,
    chunkSizeWarningLimit: 900,
  },
})
