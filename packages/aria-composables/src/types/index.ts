import { Ref } from 'vue'

export type MaybeRef<T> = Ref<T> | T

export interface FocusTrackerState<El extends HTMLElement> {
  prevEl: Readonly<Ref<El | null>>
  activeEl: Readonly<Ref<El | null>>
  currentEl: Readonly<Ref<El | null>>
  tabDirection: Readonly<Ref<'backward' | 'forward' | null>>
}

export interface useFocusGroupOptions {
  returnOnEscape?: boolean
  returnOnUnmount?: boolean
}
