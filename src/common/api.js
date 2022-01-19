import Axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'

import router from '../router'
import store from '../store'
import lang from '../common/lang'

const i18nLanguage = ['zh', 'en'].includes(localStorage.language)
  ? localStorage.language
  : window.EMQX_DASHBOARD_CONFIG.lang || 'en'
const { httpCode } = lang[i18nLanguage] || lang.en

NProgress.configure({ showSpinner: false })

Object.assign(Axios.defaults, {
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  baseURL: '/api/v4',
  timeout: 10 * 1000,
})

let timer = 0

// Add auth headers
Axios.interceptors.request.use(
  (config) => {
    if (store.state.user.username) {
      config.auth = {
        username: store.state.user.username,
        password: store.state.user.password,
      }
    } else {
      router.push({ path: '/login', query: { to: router.fullPath } })
    }
    NProgress.start()
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      store.dispatch('LOADING', true)
    }, 100)
    return config
  },
  (error) => {
    console.warn('Request Error: ', error)
    store.dispatch('LOADING', false)
  },
)

function handleErrorMessage(error) {
  if (error.message === 'module_not_loaded') {
    return
  }
  Message.error(error.message)
}

function handleError(error) {
  console.error(error)
  NProgress.done()
  clearTimeout(timer)
  store.dispatch('LOADING', false)
  const status = error.response && error.response.status
  if (error.response && error.response.data.message) {
    error.message = error.response.data.message
  }
  if (status === 401) {
    store.dispatch('USER_LOGIN', { isLogOut: true })
    router.push({ path: '/login', query: { to: router.fullPath } })
  } else if (status === 404) {
    error.message = 'URL Not Found'
  } else {
    handleErrorMessage(error)
  }
  return Promise.reject(error.message)
}

// Response interceptors
Axios.interceptors.response.use((response) => {
  let res = {}
  let error = ''
  if (typeof response.data === 'object') {
    const { status } = response
    const { code, meta, message } = response.data
    let { data } = response.data
    if (code !== 0) {
      error = httpCode[code] || message
    }
    // pagination
    if (meta) {
      data = { items: data, meta }
    }
    res = { data, status }
  }
  NProgress.done()
  clearTimeout(timer)
  timer = 0
  store.dispatch('LOADING', false)
  if (error) {
    const dataError = new Error(error)
    handleError(dataError)
    throw dataError
  }
  return res
}, handleError)

export default Axios
