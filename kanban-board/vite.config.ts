import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',  // Brug relative stier for at undgå 404 på deployment
  build: {
    outDir: 'dist'
  }
})
