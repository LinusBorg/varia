declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

type nanoidFn = () => string
declare module 'nanoid/non-secure'
