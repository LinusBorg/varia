import { inject, provide, ref } from 'vue'
import { useDisclosure } from '../Disclosure'
import { PopoverAPIKey } from '../types'

export const popoverAPIKey = Symbol('popoverAPI') as PopoverAPIKey

export function usePopover({ skipProvide }: { skipProvide?: boolean } = {}) {
  const state = ref<boolean>(false)
  const triggerEl = ref<HTMLElement | undefined>()

  const disclosureAPI = useDisclosure(state, { skipProvide: true })

  const api = {
    ...disclosureAPI,
    triggerEl,
  }

  !skipProvide && provide(popoverAPIKey, api)

  return {
    ...disclosureAPI,
    ...api,
  }
}

export function injectPopoverAPI(key: PopoverAPIKey = popoverAPIKey) {
  const api = inject(key)
  if (!api) {
    throw new Error(
      'injectPopoverAPI(): usePopover() needs to be called in a parent component'
    )
  }
  return api
}
