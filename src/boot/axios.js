import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
})

export { axios }
