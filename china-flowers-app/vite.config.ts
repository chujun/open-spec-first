import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/china-flowers-3d-globe/' : '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  optimizeDeps: {
    include: ['three', 'three-globe'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/three-globe')) return 'three-globe'
          if (id.includes('node_modules/three')) return 'three'
        },
      },
    },
  },
})
