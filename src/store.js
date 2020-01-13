import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function safeParse(jsonText) {
  try {
    return JSON.parse(jsonText)
  } catch (e) {
    return null
  }
}

const state = {
  loading: false,
  user: safeParse(sessionStorage.getItem('user')) || safeParse(localStorage.getItem('user')) || {},
  nodeName: '',
}

// login & logout
const USER_LOGIN = 'USER_LOGIN'
// ajax state
const LOADING = 'LOADING'
// current node name in cluster
const CURRENT_NODE = 'CURRENT_NODE'

const actions = {
  [USER_LOGIN]({ commit }, payload) {
    if (payload.isLogOut) {
      sessionStorage.removeItem('user')
      localStorage.removeItem('user')
      commit(USER_LOGIN, payload)
      return
    }
    if (payload.remember) {
      localStorage.setItem('user', JSON.stringify(payload.user))
    } else {
      sessionStorage.setItem('user', JSON.stringify(payload.user))
    }
    commit(USER_LOGIN, payload)
  },
  [CURRENT_NODE]({ commit }, nodeName) {
    commit(CURRENT_NODE, nodeName)
  },
  [LOADING]({ commit }, loading = false) {
    commit(LOADING, loading)
  },
}

const mutations = {
  [USER_LOGIN](state, payload) {
    if (payload.isLogOut) {
      Vue.set(state, 'user', {})
    } else {
      Vue.set(state, 'user', payload.user)
    }
  },
  [CURRENT_NODE](state, nodeName) {
    Vue.set(state, 'nodeName', nodeName)
  },
  [LOADING](state, loading) {
    state.loading = loading
  },
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  actions,
  mutations,
})
