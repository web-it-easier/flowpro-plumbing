import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom', // Change to jsdom for Vue component testing
    include: [
      'utils/ai/__tests__/**/*.test.js',
      'components/__tests__/**/*.test.js',
      'components/admin/__tests__/**/*.test.js',
      'components/customer/__tests__/**/*.test.js',
      'components/common/__tests__/**/*.test.js'
    ],
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules/', '.nuxt/', '.output/']
    }
  }
})
