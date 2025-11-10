import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { setupI18n } from './i18n'
import router from './router'
import { createPinia } from 'pinia'

;(async () => {
    const i18n = await setupI18n()
    const pinia = createPinia()
    createApp(App).use(i18n).use(pinia).use(router).mount('#app')
})()
