import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react-datepicker',
      'react-day-picker',
      'uuid',
      'xlsx',
      '@react-oauth/google',
      'framer-motion',
      'lucide-react',
      'papaparse',
      'pdfjs-dist',
      'react-dropzone',
      'react-hook-form',
      'sonner',
      'zod'
    ]
  }
});
