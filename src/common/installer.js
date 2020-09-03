import JSONInput from '~/components/JSONInput'
import DataTable from '~/components/DataTable'

import API from './api'

export default Vue => {
  Vue.prototype.$httpGet = (url, params = {}) => {
    // fix IE cache application/json response
    params._ = Date.now()
    return API.get(url, { params })
  }
  Vue.component(JSONInput.name, JSONInput)
  Vue.component(DataTable.name, DataTable)

  Vue.prototype.$httpPost = API.post
  Vue.prototype.$httpPut = API.put
  Vue.prototype.$httpDelete = API.delete
  Vue.prototype.$axios = API
  Vue.prototype.$env = window.EMQX_DASHBOARD_CONFIG || {}
}
