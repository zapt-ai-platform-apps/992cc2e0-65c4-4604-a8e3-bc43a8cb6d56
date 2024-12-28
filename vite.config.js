import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidSVG from 'vite-plugin-solid-svg';

export default defineConfig({
  plugins: [solidPlugin(), solidSVG()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
  optimizeDeps: {
    exclude: ['drizzle-orm', 'postgres'] // Add any server-only dependencies here
  }
});