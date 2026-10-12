import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const codespaceName = process.env.VITE_CODESPACE_NAME ?? process.env.CODESPACE_NAME ?? '';

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_CODESPACE_NAME': JSON.stringify(codespaceName),
  },
  server: { port: 5173 },
  test: { environment: 'jsdom' },
});
