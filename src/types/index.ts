import { VueConstructor } from 'vue'
import { Ref } from '@vue/composition-api'
export type MaybeRef<T> = Ref<T> | T

export interface ComponentInstance extends InstanceType<VueConstructor> {}

export type FocusableElements = Array<
  HTMLElement | InstanceType<VueConstructor>
>
export type TemplateRefs = Ref<FocusableElements>

export interface useFocusGroupOptions {
  returnOnEscape?: boolean
  returnOnUnmount?: boolean
  integrateWithParentGroup?: boolean
  includeChildComponents?: boolean
}
