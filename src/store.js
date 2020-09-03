import Vue from 'vue'
import Vuex from 'vuex'
import Package from '../package.json'
import newFeaturesMenu from './data_map/new_features_menu'

Vue.use(Vuex)

function safeParse(jsonText) {
  try {
    return JSON.parse(jsonText)
  } catch (e) {
    return null
  }
}

function getShowFeatOnLeftbar() {
  const currentShow = safeParse(localStorage.getItem('showFeatOnLeftbar'))
  function genData() {
    const data = {}
    newFeaturesMenu.forEach(key => {
      data[key] = true
    })
    const res = {
      version: Package.version,
      data,
    }
    localStorage.setItem('showFeatOnLeftbar', JSON.stringify(res))
    return res
  }
  if (!currentShow) {
    return genData()
  }
  if (currentShow.version !== Package.version) {
    localStorage.removeItem('showFeatOnLeftbar')
    return genData()
  }
  return currentShow
}

const state = {
  loading: false,
  user: safeParse(sessionStorage.getItem('user')) || safeParse(localStorage.getItem('user')) || {},
  nodeName: '',
  showFeatOnLeftbar: getShowFeatOnLeftbar(),
}

// login & logout
const USER_LOGIN = 'USER_LOGIN'
// ajax state
const LOADING = 'LOADING'
// current node name in cluster
const CURRENT_NODE = 'CURRENT_NODE'
// Cancel feature active on leftbar
const CANCEL_FEAT_ON_LEFTBAR = 'CANCEL_FEAT_ON_LEFTBAR'

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
  [CANCEL_FEAT_ON_LEFTBAR]({ commit }, routeName) {
    commit(CANCEL_FEAT_ON_LEFTBAR, routeName)
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
  [CANCEL_FEAT_ON_LEFTBAR](state, payload) {
    const $showFeatOnLeftbar = state.showFeatOnLeftbar
    const { data } = $showFeatOnLeftbar
    data[payload] = false
    Vue.set(state, 'showFeatOnLeftbar', $showFeatOnLeftbar)
    localStorage.setItem('showFeatOnLeftbar', JSON.stringify($showFeatOnLeftbar))
  },
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  actions,
  mutations,
})
