import cuid from 'cuid'

export const createId = cuid

export function createCachedIdFn(seed?: string) {
  const idMap: { [key: string]: string } = {}

  return (name: string) => {
    if (name && idMap[name]) return idMap[name]

    const _id = cuid()
    const id = seed ? `${seed}_${_id}` : _id
    if (name) {
      idMap[name] = id
    }
    return id
  }
}
