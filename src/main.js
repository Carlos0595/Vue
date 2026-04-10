import { createApp } from 'vue'
import './styles.css'
import 'country-flag-icons/3x2/flags.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const pinia = createPinia();

createApp(App).use(router).use(pinia).mount('#app')
