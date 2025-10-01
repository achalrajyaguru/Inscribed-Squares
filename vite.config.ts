import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }): UserConfig => {
  return {
    plugins: [react()],
    // If deploying to GitHub Pages under a repo subpath, set base to repo name.
    // Vite will automatically use this when building for production.
    base: process.env.VITE_BASE || (mode === 'production' ? '/Inscribed-Squares/' : '/'),
  }
})
