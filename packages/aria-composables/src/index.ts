import { App } from 'vue'
import {
  focusTrackerKey,
  state as focusTracker,
} from './composables/focus-tracker'
import { tabDirection, tabDirectionKey } from './composables/tab-direction'

export * from './composables'
export * from './types'
export { useIdGenerator, applyFocus } from './utils'

export function install(app: App) {
  app.provide(focusTrackerKey, focusTracker)
  app.provide(tabDirectionKey, tabDirection)
}
