import './assets/main.css'
import './registerPeriodicSync.js'

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import { router } from './router'
import { registerSW } from 'virtual:pwa-register'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')

registerSW({
  immediate: true,
  onRegisteredSW: (swScriptUrl, registration) => {
    registration &&
      setInterval(
        () => {
          registration.update()
        },
        60 * 60 * 1000,
      )
  },
})
