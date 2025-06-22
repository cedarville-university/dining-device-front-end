import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/dining-device-front-end/registerPeriodicSync.js', {
      scope: '/dining-device-front-end/api',
    })
  })
}
