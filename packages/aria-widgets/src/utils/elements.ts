export function isNativeTabbable(
  element: Element
): element is HTMLElement & { disabled: boolean } {
  return (
    element.tagName === 'BUTTON' ||
    element.tagName === 'INPUT' ||
    element.tagName === 'SELECT' ||
    element.tagName === 'TEXTAREA' ||
    element.tagName === 'A' ||
    element.tagName === 'AUDIO' ||
    element.tagName === 'VIDEO'
  )
}
