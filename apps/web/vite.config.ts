import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import mkcert from 'vite-plugin-mkcert';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig, type Plugin } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        id: '/',
        short_name: 'The Last of Guss',
        name: 'The Last of Guss',
        start_url: '.',
        display: 'standalone',
        theme_color: '#00ff00',
        background_color: '#0a0a0a',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '16x16',
            type: 'image/x-icon',
          },
          {
            src: 'favicon-16x16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: 'favicon-32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: 'favicon-96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: 'favicon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 25 * 1024 * 1024, // 25MB
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        suppressWarnings: true,
        type: 'module',
      },
    }),
    tsconfigPaths(),
    mkcert(),
  ] as Plugin[],
  server: {
    open: true,
    https: {},
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.tsx'],
    css: true,
  },
});
