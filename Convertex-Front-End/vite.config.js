import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcssVite from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcssVite()
  ],
})

