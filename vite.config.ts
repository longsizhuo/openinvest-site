import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project Pages base. Switch to '/' if a custom domain (CNAME) is added later.
// https://vite.dev/config/
export default defineConfig({
  base: '/openinvest-site/',
  plugins: [react()],
})
