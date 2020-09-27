import Axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'

import store from '../store'
import lang from '../common/lang'

const i18nLanguage = ['zh', 'en'].includes(localStorage.language)
  ? localStorage.language
  : window.EMQX_DASHBOARD_CONFIG.lang || 'en'
const { httpCode } = lang[i18nLanguage] || lang.en

NProgress.configure({ showSpinner: false })

let timer = 0

const authInstance = Axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  baseURL: '/api',
  timeout: 10 * 1000,
})
const getRefreshToken = async () => {
  const user = JSON.parse(localStorage.getItem('user')) || {}
  if (user.token && user.refreshToken) {
    const { username, userId, remember, ...tokenBody } = user
    try {
      const res = await authInstance.post('/token', {
        ...tokenBody
      })
      const refreshUser = {
        username,
        userId,
        remember,
        token: res.data.token,
        refreshToken: tokenBody.refreshToken,
      }
      localStorage.setItem('user', JSON.stringify(refreshUser))
      return refreshUser.token
    } catch (error) {
      setTimeout(() => {
        window.location.replace('/web/login?auth=expired')
      }, 500)
      return Promise.reject(error)
    }
  }
  return false
}

const currentNode = JSON.parse(localStorage.getItem('currentNode')) || {}
const nodeID = currentNode.id
const baseURL = `/api/nano/${nodeID}`
const baseInstance = Axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  baseURL,
  timeout: 10 * 1000,
})
// Add auth headers
baseInstance.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('user')) || {}
    config.headers.Authorization = user.token
    config.params = config.params || {}
    NProgress.start()
    timer = setTimeout(() => {
      store.dispatch('LOADING', true)
    }, 100)
    return config
  },
  error => {
    console.warn('Request Error: ', error)
    store.dispatch('LOADING', false)
  },
)

function handleModuleErrorMessage(error) {
  if (error.message === 'module_not_loaded') {
    return
  }
  Message.error(error.message)
}
async function handleError(error) {
  console.error(error)
  NProgress.done()
  clearTimeout(timer)
  store.dispatch('LOADING', false)
  const status = error.response && error.response.status
  const { data } = error.response
  const originalRequest = error.config
  if (error.response && error.response.data.message) {
    error.message = error.response.data.message
  }
  const isExpired = status === 401 && data.indexOf('token is expired by') !== -1 && !originalRequest._retry
  if (isExpired) {
    originalRequest._retry = true
    await getRefreshToken()
    originalRequest.url = originalRequest.url.replace(baseURL, '')
    return baseInstance(originalRequest)
  } else if (status === 404) {
    error.message = 'URL Not Found'
  } else {
    handleModuleErrorMessage(error)
  }
  return Promise.reject(error.message)
}

// Response interceptors
baseInstance.interceptors.response.use(response => {
  let res = {}
  let error = ''
  if (response.data.token) {
    return response
  }
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

export default baseInstance
