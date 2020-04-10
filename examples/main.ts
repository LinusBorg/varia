import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'

const app = createApp(App).mount('#app')

app.config.productionTip = false
