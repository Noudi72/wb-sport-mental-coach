import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // SPA Mode - alle Routes werden auf index.html gemappt
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  // Für Development: History API Fallback
  server: {
    historyApiFallback: true,
  },
});
