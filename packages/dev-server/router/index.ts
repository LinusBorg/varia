import { createRouter, createWebHistory, RouteRecord } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

// @ts-ignore
if (import.meta.hot) {
  let removeRoutes: Array<() => void> = []

  for (let route of routes) {
    removeRoutes.push(router.addRoute(route))
  }

  // @ts-ignore
  import.meta.hot.acceptDeps(
    './routes.js',
    ({ routes }: { routes: RouteRecord[] }) => {
      for (let removeRoute of removeRoutes) removeRoute()
      removeRoutes = []
      for (let route of routes) {
        removeRoutes.push(router.addRoute(route))
      }
      router.replace('')
    }
  )
}
