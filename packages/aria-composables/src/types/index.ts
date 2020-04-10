import { Ref } from 'vue'
export type MaybeRef<T> = Ref<T> | T

export interface useFocusGroupOptions {
  returnOnEscape?: boolean
  returnOnUnmount?: boolean
}
