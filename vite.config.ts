import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy()],
  base: '/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  resolve: {
    alias: {
      '@services': path.resolve(__dirname, 'src/services'),
    },
  },
});
