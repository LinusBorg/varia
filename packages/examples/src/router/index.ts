import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ButtonsView from '../views/Buttons.vue'
import DisclosuresView from '../views/Disclosures.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    component: Home,
  },
  {
    path: '/buttons',
    name: 'Buttons',
    component: ButtonsView,
  },
  {
    path: '/disclosures',
    name: 'Disclosures',
    component: DisclosuresView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
