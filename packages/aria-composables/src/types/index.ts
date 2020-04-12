import { Ref } from 'vue'

export type MaybeRef<T = any> = T | Ref<T>

export interface FocusTrackerState {
  prevEl: Readonly<Ref<HTMLElement | null>>
  activeEl: Readonly<Ref<HTMLElement | null>>
  currentEl: Readonly<Ref<HTMLElement | null>>
  tabDirection: Readonly<Ref<'backward' | 'forward' | null>>
}

export interface useFocusGroupOptions {
  returnOnEscape?: boolean
  returnOnUnmount?: boolean
}
