import { fileURLToPath, resolve, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appRoot = env.VITE_APP_ROOT
  const apiUrl = env.VITE_API_URL

  return {
    plugins: [
      vue(),
      tailwindcss(),
      vueDevTools(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'generateSW',
        workbox: {
          importScripts: [appRoot + 'registerPeriodicSync.js'],
          runtimeCaching: [
            {
              handler: 'NetworkOnly',
              urlPattern: new RegExp(apiUrl),
              method: 'GET',
              options: {
                backgroundSync: {
                  name: 'fetch-pioneer-menu',
                  options: {
                    maxRetentionTime: 6 * 60 * 60 * 1000, // every 6 hours
                  },
                },
              },
            },
          ],
        },
        manifest: {
          name: 'Dining Devive Menu Viewer',
          short_name: 'Menu Viewer',
          description: 'This application will be used to display menu data for the dining hall.',
          theme_color: '#003865',
          background_color: '#ffffff',
          display: 'fullscreen',
          scope: appRoot,
          start_url: appRoot,
          icons: [
            {
              src: appRoot + 'icons/apple-touch-icon-57x57.png',
              sizes: '57x57',
              type: 'image/png',
            },
            {
              src: appRoot + 'icons/apple-touch-icon-60x60.png',
              sizes: '60x60',
              type: 'image/png',
            },
            {
              src: appRoot + 'icons/apple-touch-icon-72x72.png',
              sizes: '72x72',
              type: 'image/png',
            },
            {
              src: appRoot + 'icons/apple-touch-icon-76x76.png',
              sizes: '76x76',
              type: 'image/png',
            },
            {
              src: appRoot + 'icons/apple-touch-icon-114x114.png',
              sizes: '114x114',
              type: 'image/png',
            },
            {
              src: appRoot + 'icons/apple-touch-icon-120x120.png',
              sizes: '120x120',
              type: 'image/png',
            },
            {
              src: appRoot + 'icons/apple-touch-icon-144x144.png',
              sizes: '144x144',
              type: 'image/png',
            },
            {
              src: appRoot + 'icons/apple-touch-icon-152x152.png',
              sizes: '152x152',
              type: 'image/png',
            },
          ],
        },
        devOptions: {
          enabled: false,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    base: process.env.NODE_ENV === 'production' ? '/dining-device-front-end/' : '/',
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: (chunkFile) => {
            if (chunkFile.name === 'registerPeriodicSync') {
              return '[name].js'
            }
            return 'assets/[name]-[hash].js'
          },
          // entryFileNames: 'assets/[name].js', // Prevents hashing for entry files
          // chunkFileNames: 'assets/[name].js', // Prevents hashing for code-split chunks
          // assetFileNames: 'assets/[name].[ext]', // You can choose to hash other assets or not
          manualChunks: {
            registerPeriodicSync: ['./src/registerPeriodicSync.js'],
          },
        },
      },
    },
  }
})
