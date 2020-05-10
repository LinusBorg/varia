import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  RouteRecord,
} from 'vue-router'
import { hot } from 'vite/hmr'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

// @ts-ignore
if (__DEV__) {
  let removeRoutes: Array<() => void> = []

  for (let route of routes) {
    removeRoutes.push(router.addRoute(route))
  }

  hot.accept('./routes.js', ({ routes }: { routes: RouteRecord[] }) => {
    for (let removeRoute of removeRoutes) removeRoute()
    removeRoutes = []
    for (let route of routes) {
      removeRoutes.push(router.addRoute(route))
    }
    router.replace('')
  })
}
