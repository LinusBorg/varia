import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import '@varia/widgets/dist/index.css'
import './assets/tailwind.css'

createApp(App)
  .use(router)
  .mount('#app')
