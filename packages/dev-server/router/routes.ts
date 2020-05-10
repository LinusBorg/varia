// Views
import Home from '../views/Home.vue'
import ButtonsView from '../views/Buttons.vue'
import { RouteRecordRaw } from 'vue-router'
import DisclosuresView from '../views/Disclosures.vue'

export const routes: RouteRecordRaw[] = [
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
