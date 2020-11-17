import Vue from 'vue'
import { sync } from 'vuex-router-sync'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import ElementLocale from 'element-ui/lib/locale'

import App from './App'
import router from './router'
import store from './store'
import './assets/common.scss'
import lang from './common/lang'
import Mount from './common/installer'
import { initThemes } from './common/themes'
import filter from './common/filter'

Vue.config.productionTip = false
Vue.use(VueI18n)
Vue.use(ElementUI)
Vue.prototype.$ELEMENT = { size: 'medium' }

Vue.use(Mount)

Object.keys(filter).forEach(name => {
  Vue.filter(name, filter[name])
})

const i18n = new VueI18n({
  locale: window.localStorage.language || window.EMQX_DASHBOARD_CONFIG.lang || 'en',
  messages: lang,
})

ElementLocale.i18n((key, value) => i18n.t(key, value))
Vue.prototype.$t = (key, value) => i18n.t(key, value)

initThemes()

sync(store, router)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>',
})
