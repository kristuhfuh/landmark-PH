import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import contentSavePlugin from './vite-plugin-content.js'

export default defineConfig({
  plugins: [
    react(),
    contentSavePlugin({ filePath: 'src/content.json' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
})
