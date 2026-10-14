import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset URLs, so the build works from any path (or straight from disk).
  base: './',
  plugins: [react()],
})
