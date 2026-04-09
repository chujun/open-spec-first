import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    exclude: ['e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['src/data/**', 'src/types/**'],
    },
  },
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
