import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // The browser only talks to the Vite origin; Vite forwards /api to the private Express port.
  server: { port: 5173, proxy: { '/api': 'http://localhost:8000' } },
  test: { environment: 'jsdom' },
});
