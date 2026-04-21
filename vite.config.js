import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  server: {
    port: 3000,
    open: '/',
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'pages',
          dest: ''
        }
      ]
    })
  ]
})