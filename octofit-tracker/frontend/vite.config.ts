import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // O navegador acessa a origem Vite; as requisições da API são encaminhadas ao Express.
  server: { port: 3000, proxy: { '/api': 'http://localhost:8000' } },
  test: { environment: 'jsdom' },
});
