import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { install as plugin } from '@varia/widgets'
import '@varia/widgets/dist/index.css'
import './assets/tailwind.css'
createApp(App)
  .use(router)
  .use(plugin)
  .mount('#app')
