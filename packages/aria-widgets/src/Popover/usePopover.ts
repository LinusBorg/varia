import { Ref, provide, ref } from 'vue'
import { useDisclosure } from '../Disclosure'
import { PopoverAPIKey } from '../types'
import { TemplRef } from '@varia/composables'
import { createInjector } from '../utils/inject'

export const popoverAPIKey = Symbol('popoverAPI') as PopoverAPIKey

export function usePopover(
  state: Ref<boolean | undefined>,
  { skipProvide }: { skipProvide?: boolean } = {}
) {
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
