import { defineConfig } from 'vite'


export default defineConfig({
  root: 'src',
  server: {
    port: 3000,
    // middlewareMode: true,
    open: '/pages/programacion.html',
  },
  build: {
    outDir: 'dist',
  }
})