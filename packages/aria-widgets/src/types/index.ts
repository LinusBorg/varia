import { Ref, InjectionKey } from 'vue'
import { ArrowNavigation, TemplRefType, TemplRef } from 'vue-aria-composables'
import { Options as PopperOptions } from '@popperjs/core'

/**
 * Base Interfaces for the composite widgets APIs
 * Those are usually provided by a wrapper component to children
 */
type OptionsBase = Record<string, any>

export interface BaseAPI<Options extends OptionsBase = Record<string, any>> {
  generateId?: (name: string) => string
  state?: StateAPIBase
  arrowNav?: ArrowNavigation
  elements?: ElementsAPI
  options?: Options
  // [key: string]: any
}

export type StateAPIBase = BooleanStateAPI | SingleStateAPI | SetStateAPI

export interface BooleanStateAPI {
  selected: Ref<boolean>
  select?: () => void
  unselect?: () => void
  toggle?: () => void
}
export interface SingleStateAPI<Item = string> {
  selected: Ref<Item>
  select: (item: Item) => void
  unselect?: () => void
}

export interface SetStateAPI<Item = string> {
  selected: Set<Item>
  select: (item: Item) => void
  unselect: (item: Item) => void
}

export interface ElementsAPI<El = TemplRefType> {
  triggerEl: Ref<El>
  contentEl: Ref<El>
}

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
 * Listbox
 */

export type ListBoxOptions = {
  multiple?: boolean
}

export interface ListBoxAPI<Item> {
  genId: (name: string) => string
  selected: Set<Item>
  select: (item: Item) => void
  deselect: (item: Item) => void
  arrowNavAPI: ArrowNavigation
}

export type ListBoxAPIKey<Item = any> = InjectionKey<ListBoxAPI<Item>>

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
  closeOnBlur: boolean
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
 * Teleport
 */
export interface TeleportProps extends Record<string, any> {
  tag: string
}
