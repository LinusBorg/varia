import Vue, { VueConstructor } from 'vue'
import VueRouter from 'vue-router'
import ListboxPage from '../views/ListboxPage.vue'
import TabsPage from '../views/TabsPage.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'listbox',
    component: ListboxPage as VueConstructor<Vue>,
  },
  {
    path: '/tabs',
    name: 'tabs',
    component: TabsPage as VueConstructor<Vue>,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
