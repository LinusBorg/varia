import { Ref, InjectionKey } from 'vue'
import { ArrowNavigation, TemplRefType, TemplRef } from '@varia/composables'
import { Options as PopperOptions } from '@popperjs/core'

import {
  BaseAPI,
  SetStateAPI,
  SingleStateAPI,
  BooleanStateAPI,
} from '@varia/composables'

/**
 * Accordion
 */
export interface AccordionOptions {
  multiple?: boolean
  orientation?: 'horizontal' | 'vertical'
  customName?: string
  loop?: boolean
  [key: string]: any
}

export interface AccordionAPI extends BaseAPI {
  generateId: (n: string) => string
  state: SetStateAPI
  arrowNav: ArrowNavigation
  options: AccordionOptions
}

export type AccordionAPIKey = InjectionKey<AccordionAPI>

/**
 *  Tabbable
 */

export interface TabbableOptions {
  disabled?: boolean | undefined
  focusable?: boolean | undefined
  // onClick?: <T extends any>(e: T) => any
  // onMouseDown?: <T extends any>(e: T) => any
  [key: string]: any
}

/**
 * Clickable
 */
export interface ClickableOptions extends TabbableOptions {}

/**
 * Button
 */
export interface ButtonOptions extends ClickableOptions {}

/**
 * ToggleButton
 */
export interface ToggleButtonOptions extends ClickableOptions {
  modelValue?: boolean | undefined
}

/**
 * Listbox
 */

export type ListBoxOptions = {
  multiple: boolean
  orientation: 'horizontal' | 'vertical'
  virtual: boolean
  autoSelect: boolean
}

export interface ListBoxAPI extends BaseAPI {
  generateId: (name: string) => string
  state: SetStateAPI<any>
  arrowNav: ArrowNavigation
  options: ListBoxOptions
}

export type ListBoxAPIKey = InjectionKey<ListBoxAPI>

/**
 * Tabs
 */
export interface TabsOptions {
  customName?: string
  orientation?: 'vertical' | 'horizontal'
  autoSelect?: boolean
  startOnFirstSelected?: boolean
  loop?: boolean
  virtual?: boolean
}

export interface TabsAPI extends BaseAPI {
  generateId: (name: string) => string
  state: SingleStateAPI
  arrowNav: ArrowNavigation
  options: TabsOptions
}

export type TabsAPIKey = InjectionKey<TabsAPI>

/**
 * Disclosure
 */
export interface DisclosureOptions {
  skipProvide?: boolean
  customKey?: symbol | string
}

export interface DisclosureAPI extends BaseAPI {
  state: BooleanStateAPI
  options: {
    id: string
  }
}
export type DisclosureAPIKey = InjectionKey<DisclosureAPI>

/**
 * Popover
 */
export interface PopoverContentOptions {
  returnFocusOnClose: boolean
  closeOnEscape: boolean
  closeOnClickOutside: boolean
  focusOnOpen: boolean
  popperOptions?: PopperOptions
}

export interface PopoverAPI extends DisclosureAPI {
  elements: {
    triggerEl: TemplRef
    contentEl: TemplRef
  }
}
export type PopoverAPIKey = InjectionKey<PopoverAPI>

export interface PopoverOptions {
  position?: string
  flip?: boolean
  autofocus?: boolean
}

/**
 * FocusTrap
 */
export interface FocusTrapOptions {
  activateOnMount?: boolean
  modelValue?: boolean
  useInert?: boolean
  [key: string]: any
}

/**
 * Teleport
 */
export interface TeleportProps extends Record<string, any> {
  tag?: string
}

/**
 * Dialog
 */

export interface DialogOptions {
  modal?: boolean
}

export interface DialogAPI extends PopoverAPI {
  options: {
    id: string
  } & DialogOptions
}
export type DialogAPIKey = InjectionKey<DialogAPI>

export interface DialogContentOptions
  extends Omit<PopoverContentOptions, 'popperOptions'> {}
