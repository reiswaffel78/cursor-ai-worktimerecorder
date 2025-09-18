import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Entry point configuration
  root: './src',
  publicDir: '../public',
  
  // Build configuration for VS Code WebView
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: true,
    
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html')
      },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  
  // Development server configuration
  server: {
    port: 3000,
    host: 'localhost',
    strictPort: true,
    cors: true
  },
  
  // Path resolution for monorepo
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@core': resolve(__dirname, '../core/src'),
      '@extension': resolve(__dirname, '../extension/src')
    }
  },
  
  // Define environment variables
  define: {
    __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },
  
  // CSS configuration
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    }
  },
  
  // Optimize dependencies for better dev experience
  optimizeDeps: {
    include: ['react', 'react-dom', 'zustand', 'chart.js', 'react-chartjs-2']
  }
});
