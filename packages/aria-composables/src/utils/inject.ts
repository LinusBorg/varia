import { InjectionKey, inject } from 'vue'
import { BaseAPI } from '../../../aria-widgets/src/types'
export function createInjector<API extends BaseAPI>(
  defaultKey: InjectionKey<API>,
  nameOfInjector: string
) {
  return function(key: InjectionKey<API> = defaultKey) {
    const api = inject(key)
    if (!api) {
      throw new Error(`injection now found when calling ${nameOfInjector}.
        Make sure to have called the matching use*() function before, or in a parent component`)
    }
    return api
  }
}
