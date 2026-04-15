import { createStore } from 'vuex'

export default function () {
  const Store = createStore({
    modules: {},
    strict: process.env.DEBUGGING
  })

  return Store
}
