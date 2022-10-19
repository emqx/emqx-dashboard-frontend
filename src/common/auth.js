import { createRandomString, parseJSONSafely, stringifyObjSafely } from './utils'
import AES from 'crypto-js/aes'
import encUTF8 from 'crypto-js/enc-utf8'

/**
 * key for set/get local storage
 */
const USER_INFO_KEY = 'uK'
const ENCRYPTION_KEY = 'LATRJJ04GW'

const getUserInfoKey = () => {
  return localStorage.getItem(USER_INFO_KEY)
}

const setUserInfoKey = () => {
  const uk = createRandomString(8)
  localStorage.setItem(USER_INFO_KEY, uk)
  return uk
}

const encryptSafely = (str, key) => {
  try {
    return AES.encrypt(str, key)
  } catch (error) {
    console.error(error)
    return str
  }
}

const decryptSafely = (str, key) => {
  try {
    const bytes = AES.decrypt(str, key)
    return bytes.toString(encUTF8)
  } catch (error) {
    console.error(error)
    return str
  }
}

/**
 * 1. generate uk
 * 2. set user info
 */
export const setUser = (user, remember) => {
  const uk = setUserInfoKey()
  const userInfo = encryptSafely(stringifyObjSafely(user), ENCRYPTION_KEY)
  if (remember) {
    localStorage.setItem(uk, userInfo)
  } else {
    sessionStorage.setItem(uk, userInfo)
  }
}

export const getUser = () => {
  const uk = getUserInfoKey()
  if (!uk) {
    return
  }
  const user = localStorage.getItem(uk) || sessionStorage.getItem(uk)
  if (!user) {
    return
  }
  const userInfoStr = decryptSafely(user, ENCRYPTION_KEY)
  const userInfo = parseJSONSafely(userInfoStr)
  return userInfo
}

export const removeUser = () => {
  const uk = getUserInfoKey()
  if (!uk) {
    return
  }
  localStorage.removeItem(uk)
  sessionStorage.removeItem(uk)

  localStorage.removeItem(USER_INFO_KEY)
  localStorage.removeItem(ENCRYPTION_KEY)
}
