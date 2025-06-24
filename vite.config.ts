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
          globPatterns: ['**/*.{js,css,html,ico,png,svg}', apiUrl + '*'],
          runtimeCaching: [
            {
              handler: 'NetworkFirst',
              urlPattern: new RegExp(apiUrl),
              method: 'GET',
              options: {
                backgroundSync: {
                  name: 'retry-pioneer-fetch',
                  options: {
                    maxRetentionTime: 24 * 60, // Retry for max of 24 hours (specified in minutes)
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
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    base: process.env.NODE_ENV === 'production' ? '/dining-device-front-end/' : '/',
    // build: {
    //   rollupOptions: {
    //     output: {
    //       chunkFileNames: (chunkFile) => {
    //         // if (chunkFile.name === 'registerPeriodicSync') {
    //         //   return '[name].js'
    //         // }
    //         return 'assets/[name]-[hash].js'
    //       },
    //       manualChunks: {
    //         registerPeriodicSync: ['./src/registerPeriodicSync.js'],
    //       },
    //     },
    //   },
    // },
  }
})
