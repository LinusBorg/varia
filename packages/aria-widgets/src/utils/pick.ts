import { computed, reactive, Ref } from 'vue'
// Logic derrived from https://github.com/jonschlinkert/object.omit,
// simplified and typed by this project
export function omit<O extends object, K extends keyof O>(
  obj: O,
  props: K[]
): Omit<O, K> {
  var keys = Object.keys(obj) as K[]
  var res: Partial<Omit<O, K>> = {}

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var val = obj[key]

    if (!props || props.indexOf(key) === -1) {
      // @ts-ignore
      res[key] = val
    }
  }
  return res as Omit<O, K>
}

export function computedOmit<O extends object, K extends keyof O>(
  obj: O,
  keys: K[]
): Ref<Omit<O, K>> {
  let newObj: Partial<O> = reactive({})
  return computed(() => {
    Object.assign(newObj, obj)
    for (let key of keys) {
      delete newObj[key]
    }
    return newObj as Omit<O, K>
  })
}

// Logic derrived from https://github.com/jonschlinkert/object.pick,
// simplified and typed by this project
export function pick<O extends object, K extends keyof O>(
  obj: O,
  keys: K[]
): Pick<O, K> {
  var res: Partial<Pick<O, K>> = {}

  var len = keys.length
  var idx = -1

  while (++idx < len) {
    var key = keys[idx]
    if (key in obj) {
      res[key] = obj[key]
    }
  }
  return res as Pick<O, K>
}

export function computedPick<O extends object, K extends keyof O>(
  obj: O,
  keys: K[]
): Ref<Pick<O, K>> {
  const newObj: Partial<O> = reactive({})
  return computed(() => {
    //TODO: This seems inefficient....
    for (let key of Object.keys(newObj)) {
      delete newObj[key as keyof typeof newObj]
    }
    for (let key of keys) {
      newObj[key] = obj[key]
    }
    return newObj as Pick<O, K>
  })
}
