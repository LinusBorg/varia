import { inject, provide, ref } from 'vue'
import { useDisclosure } from '../Disclosure'
import { PopoverAPIKey } from '../types'
import { TemplRef } from 'vue-aria-composables'
import { createInjector } from '../utils/inject'

export const popoverAPIKey = Symbol('popoverAPI') as PopoverAPIKey

export function usePopover({ skipProvide }: { skipProvide?: boolean } = {}) {
  const state = ref<boolean>(false)
  const triggerEl: TemplRef = ref()
  const contentEl: TemplRef = ref()

  const disclosureAPI = useDisclosure(state, { skipProvide: true })

  const api = {
    ...disclosureAPI,
    elements: {
      triggerEl,
      contentEl,
    },
  }

  !skipProvide && provide(popoverAPIKey, api)

  return {
    ...disclosureAPI,
    ...api,
  }
}

export const injectPopoverAPI = createInjector(
  popoverAPIKey,
  `injectPopoverAPI()`
)
