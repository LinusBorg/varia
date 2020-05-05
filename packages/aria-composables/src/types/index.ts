import { Ref } from 'vue'

export type TemplRef<El = HTMLElement> = Ref<El | undefined>
export type MaybeRef<T = any> = T | Ref<T>

export interface FocusTrackerState {
  prevEl: Readonly<Ref<HTMLElement | undefined>>
  activeEl: Readonly<Ref<HTMLElement | undefined>>
  currentEl: Readonly<Ref<HTMLElement | undefined>>
}

export interface useFocusGroupOptions {
  returnOnEscape?: boolean
  returnOnUnmount?: boolean
}
