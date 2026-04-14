import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  root: 'src',
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
        },
        {
          src: 'blog',
          dest: ''
        },
        {
          src: 'features/frases.js',
          dest: 'features'
        }
      ]
    })
  ]
})