import { fileURLToPath, resolve, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appRoot = env.VITE_APP_ROOT

  return {
    plugins: [
      vue(),
      tailwindcss(),
      vueDevTools(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'generateSW',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        },
        manifest: {
          id: 'dining-device-frontet',
          name: 'Dining Device Menu Viewer',
          short_name: 'Menu Viewer',
          description: 'Application used to display menu data for the dining hall.',
          theme_color: '#003865',
          background_color: '#ffffff',
          display: 'fullscreen',
          scope: appRoot,
          start_url: appRoot + 'kiosk',
          lang: 'en',
          orientation: 'any',
          display_override: [
            'fullscreen',
            'minimal-ui',
            'standalone',
            'browser',
            'window-controls-overlay',
          ],
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
            {
              src: appRoot + 'icons/large-icon-558x558.png',
              sizes: '558x558',
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
    base: process.env.NODE_ENV === 'production' ? appRoot : '/',
  }
})
