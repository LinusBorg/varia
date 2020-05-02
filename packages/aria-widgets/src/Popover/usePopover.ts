import { Ref, InjectionKey, inject, provide, ref } from 'vue'
import { useDisclosure, DisclosureAPI } from '../Disclosure'

export interface PopoverAPI extends DisclosureAPI {
  triggerEl: Ref<HTMLElement | undefined>
}

export type PopoverAPIKey = InjectionKey<PopoverAPI>

export const popoverAPIKey = Symbol('popoverAPI') as PopoverAPIKey

export type PopoverOptions = typeof defaultOptions

const defaultOptions = {
  position: 'auto',
  flip: true,
  autofocus: true,
}

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
