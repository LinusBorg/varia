import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { install as plugin } from 'vue-aria-widgets'
createApp(App)
  .use(router)
  .use(plugin)
  .mount('#app')
