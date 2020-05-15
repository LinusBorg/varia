import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
// Views
import Home from '../views/Home.vue'
import ButtonsView from '../views/Buttons.vue'
import TabsView from '../views/Tabs.vue'
import PopoversView from '../views/Popovers.vue'
import DisclosuresView from '../views/Disclosures.vue'
import AccordionsView from '../views/Accordions.vue'
import FocusTrapsView from '../views/FocusTraps.vue'
import Announcer from '../views/Announcer.vue'

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
    name: 'Popovers',
    component: PopoversView,
  },
  {
    path: '/focustraps',
    name: 'FocusTraps',
    component: FocusTrapsView,
  },
  {
    path: '/announcer',
    name: 'Announcer',
    component: Announcer,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.afterEach(to => {
  const name = to.meta?.title ?? to.name
  document.title = `Varia Components - ${name}`
  // TODO: Implement announcer
})

export default router
