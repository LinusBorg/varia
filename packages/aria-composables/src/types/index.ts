import { Ref, ComponentPublicInstance } from 'vue'
export type MaybeRef<T> = Ref<T> | T

export interface ComponentInstance extends ComponentPublicInstance {}

export type FocusableElements = Array<HTMLElement | ComponentInstance>
export type TemplateRefs = Ref<FocusableElements>

export interface useFocusGroupOptions {
  returnOnEscape?: boolean
  returnOnUnmount?: boolean
  integrateWithParentGroup?: boolean
  includeChildComponents?: boolean
}
