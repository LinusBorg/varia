import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ButtonsView from '../views/Buttons.vue'
import TabsView from '../views/Tabs.vue'
import PopoversView from '../views/Popovers.vue'
import DisclosuresView from '../views/Disclosures.vue'
import AccordionsView from '../views/Accordions.vue'
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
    path: '/tabs',
    name: 'Tabs',
    component: TabsView,
  },
  {
    path: '/disclosures',
    name: 'Disclosures',
    component: DisclosuresView,
  },
  {
    path: '/accordions',
    name: 'Accordions',
    component: AccordionsView,
  },
  {
    path: '/popovers',
    name: 'Popoverss',
    component: PopoversView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
