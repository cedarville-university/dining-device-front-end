import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      manifest: {
        name: 'Dining Devive Menu Viewer',
        short_name: 'Menu Viewer',
        description: 'This application will be used to display menu data for the dining hall.',
        theme_color: '#003865',
        background_color: '#ffffff',
        display: 'fullscreen',
        id: '/',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/apple-touch-icon-57x57.png',
            sizes: '57x57',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-60x60.png',
            sizes: '60x60',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-72x72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-76x76.png',
            sizes: '76x76',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-114x114.png',
            sizes: '114x114',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-120x120.png',
            sizes: '120x120',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-144x144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/icons/apple-touch-icon-152x152.png',
            sizes: '152x152',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base:
    process.env.NODE_ENV === 'production'
      ? '/dining-device-front-end/' // Replace with your repo name
      : '/',
})
