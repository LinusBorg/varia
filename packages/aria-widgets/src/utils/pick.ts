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
