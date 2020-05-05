import { Ref, ComputedRef } from 'vue'

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
  orientation: 'horizontal' | 'vertical'
  loop?: boolean
  startOnFirstSelected?: boolean
  autoSelect?: boolean
}
export interface ArrowNavigation {
  id: TemplRef
  attributes: ComputedRef<{
    'aria-descendant': string
    id: string
  }>
  select: (el: HTMLElement) => void
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

export type TabDirection = ComputedRef<'forward' | 'backward' | undefined>
