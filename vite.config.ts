import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served at the root of the custom domain openinvest.involutionhell.com
// (public/CNAME). https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
})
