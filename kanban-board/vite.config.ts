import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // Sørger for korrekt base-path
  server: {
    port: 5173, // Kan være valgfrit
  }
})
