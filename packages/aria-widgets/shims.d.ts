declare module 'object.pick' {
  export default function<O extends Object, K extends keyof O>(
    o: O,
    keys: K[]
  ): Pick<O, K>
}
declare module 'object.omit' {
  export default function<O extends Object, K extends keyof O>(
    o: O,
    keys: K[]
  ): Omit<O, K>
}
