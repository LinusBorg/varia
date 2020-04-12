import nanoid from 'nanoid/non-secure'

export function useIdGenerator(seed?: string) {
  const idMap: { [key: string]: string } = {}

  return (name: string) => {
    if (name && idMap[name]) return idMap[name]

    const _id = nanoid()
    const id = seed ? `${seed}_${_id}` : _id
    if (name) {
      idMap[name] = id
    }
    return id
  }
}
