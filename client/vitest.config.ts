import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/unit/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/api/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'tests/e2e/**/*'
    ],
    // Test execution configuration.
    testTimeout: 10000, // 10s
    hookTimeout: 10000, // 10s
    teardownTimeout: 5000, // 5s
    
    // Coverage configuration.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '.next/',
        'prisma/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/coverage/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    
    // Parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: true,
        maxThreads: 4,
        minThreads: 1
      }
    },
    
    // Test isolation
    isolate: true,
    
  },
  
  // TypeScript and module resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@/components': resolve(__dirname, './components'),
      '@/lib': resolve(__dirname, './lib'),
      '@/app': resolve(__dirname, './app'),
      '@/types': resolve(__dirname, './types'),
      '@/contexts': resolve(__dirname, './contexts'),
      '@/prisma': resolve(__dirname, './prisma')
    }
  },
  
  // Define global variables for tests
  define: {
    'process.env.NODE_ENV': '"test"'
  },
  
  // ESBuild configuration for TypeScript
  esbuild: {
    target: 'node18'
  }
})