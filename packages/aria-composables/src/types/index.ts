import { Ref } from 'vue'
export type MaybeRef<T = any> = T | Ref<T>

/**
 * Types for Template Refs
 */
export type TemplRefType<El = HTMLElement> = El | undefined
export type TemplRef<El = HTMLElement> = Ref<TemplRefType<El>>
export type MaybeTemplRef<El = HTMLElement> = MaybeRef<TemplRefType<El>>

// Options Interfaces

// ArrowNavigation
export interface ArrowNavigationOptions {
  orientation: 'horizontal' | 'vertical' | undefined
  loop: boolean
  startOnFirstSelected: boolean
  autoSelect: boolean
  virtual: boolean
}
export interface ArrowNavigation {
  hasFocus: Ref<boolean | undefined>
  elementIds: Set<string>
  currentActiveId: Ref<string>
  currentActiveElement: TemplRef
  virtual: Ref<boolean>
  select: (id: string) => void
  addIdToNavigation: (id: string, disabled: Ref<boolean | undefined>) => void
  wrapperElRef: TemplRef
}

export type ArrowKeyHandlers = {
  up?: (event: KeyboardEvent) => void
  down?: (event: KeyboardEvent) => void
  left?: (event: KeyboardEvent) => void
  right?: (event: KeyboardEvent) => void
}

// API Interfaces (For apis exposed via porvide/inject, usually)
export interface FocusTrackerAPI {
  prevEl: Readonly<Ref<HTMLElement | undefined>>
  activeEl: Readonly<Ref<HTMLElement | undefined>>
  currentEl: Readonly<Ref<HTMLElement | undefined>>
}

export type TabDirection = Ref<'forward' | 'backward' | undefined>

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
  selected: Ref<boolean | undefined>
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
  toggle: (item: Item) => void
}

export interface ElementsAPI<El = TemplRefType> {
  triggerEl: Ref<El>
  contentEl: Ref<El>
}
