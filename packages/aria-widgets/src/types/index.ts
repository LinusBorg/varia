import { Ref, InjectionKey } from 'vue'
import { TemplRef, ArrowNavigation } from 'vue-aria-composables'
import { Options as PopperOptions } from '@popperjs/core'
/**
 *  Tabbable
 */
export interface TabbableOptions {
  disabled?: boolean | undefined
  focusable?: boolean | undefined
  onClick?: <T extends any>(e: T) => any
  onMouseDown?: <T extends any>(e: T) => any
  [key: string]: any
}

/**
 * Clickable
 */
export interface ClickableOptions extends TabbableOptions {}

/**
 * Button Types
 */
export interface ButtonOptions extends ClickableOptions {}

/**
 * Tabs
 */
export interface TabsOptions {
  initialValue: string
  customName?: string
  orientation?: 'vertical' | 'horizontal'
  autoSelect?: boolean
  startOnFirstSelected?: boolean
  loop?: boolean
}

export interface TabsAPI {
  generateId: (name: string) => string
  selectedTab: Ref<string>
  select: (name: string, el: HTMLElement) => void
  autoSelect: boolean
  id: Ref<string>
  tabListAttributes: ArrowNavigation['attributes']
  tabListRef: TemplRef
}
export type TabsAPIKey = InjectionKey<TabsAPI>

/**
 * Disclosure
 */
export interface DisclosureAPI extends Record<string, any> {
  show: Ref<boolean>
  id: string
}
export type DisclosureAPIKey = InjectionKey<DisclosureAPI>

/**
 * Popover
 */
export interface PopoverContentOptions {
  returnFocusOnClose: boolean
  closeOnBlur: boolean
  closeOnEscape: boolean
  closeOnClickOutside: boolean
  focusOnOpen: boolean
  popperOptions?: PopperOptions
}

export interface PopoverAPI extends DisclosureAPI {
  triggerEl: Ref<HTMLElement | undefined>
}
export type PopoverAPIKey = InjectionKey<PopoverAPI>

export interface PopoverOptions {
  position?: string
  flip?: boolean
  autofocus?: boolean
}

/**
 * Teleport
 */
export interface TeleportProps extends Record<string, any> {
  tag: string
}
