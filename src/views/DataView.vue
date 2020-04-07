<template>
  <div class="data-view">
    <div class="page-title">
      {{ $t(`leftbar.${activeTab}`) }}
      <div style="float: right" @keyup.enter.native="searchChild">
        <el-input
          v-if="activeTab !== 'clients'"
          v-model="searchValue"
          class="input-radius"
          size="large"
          style="float: right;padding-left: 20px"
          :disabled="$store.state.loading"
          :placeholder="searchPlaceholder"
          @change="searchView = false"
          @keyup.enter.native="searchChild">
          <i slot="suffix" :class="[iconStatus, 'el-input__icon']" @click="searchChild"></i>
        </el-input>

        <el-select
          v-if="activeTab !== 'topics'"
          v-model="nodeName"
          class="select-radius"
          :placeholder="$t('select.placeholder')"
          :disabled="$store.state.loading"
          @change="loadChild(true)">
          <el-option
            v-for="item in nodes"
            :key="item.node"
            :label="item.node"
            :value="item.node">
          </el-option>
        </el-select>
      </div>
    </div>

    <el-card
      v-if="activeTab === 'clients'"
      class="el-card--self search-card">
      <el-form
        ref="clientFFuzzyParams"
        :model="clientFFuzzyParams"
        label-position="left"
        label-width="110px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('clients.clientId')">
              <el-input
                type="text"
                size="small"
                v-model="clientFFuzzyParams._like_clientid">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('clients.username')">
              <el-input
                type="text"
                size="small"
                v-model="clientFFuzzyParams._like_username">
              </el-input>
            </el-form-item>
          </el-col>

          <template v-if="showMoreQuery">
            <el-col :span="8">
              <el-form-item :label="$t('clients.ipAddr')">
                <el-input
                  type="text"
                  size="small"
                  v-model="clientFFuzzyParams.ip_address">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('clients.connected')">
                <el-select v-model="clientFFuzzyParams.conn_state">
                  <el-option value="connected"></el-option>
                  <el-option value="disconnected"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('clients.createdAt')">
                <el-row class="form-item-row">
                  <el-col :span="8">
                    <el-select v-model="clientFFuzzyParams.comparator" class="comparator">
                      <el-option label=">=" value="_gte"></el-option>
                      <el-option label="<=" value="_lte"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="16">
                    <el-date-picker
                      v-model="clientFFuzzyParams._connected_at"
                      class="datatime"
                      type="datetime"
                      value-format="timestamp">
                    </el-date-picker>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('clients.protoName')">
                <el-input
                  type="text"
                  size="small"
                  v-model="clientFFuzzyParams.proto_name">
                </el-input>
              </el-form-item>
            </el-col>
          </template>

          <span class="col-oper">
            <el-button
              size="small"
              type="primary"
              plain
              @click="clientQuerySearch">
              {{ $t('oper.search') }}
            </el-button>
            <el-button
              size="small"
              plain
              @click="resetClientQuerySearch">
              {{ $t('oper.reset') }}
            </el-button>
            <a href="javascript:;" class="show-more" @click="showMoreQuery = !showMoreQuery">
              {{ showMoreQuery ? $t('oper.collapse') : $t('oper.expand') }}
              <i :class="showMoreQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
            </a>
          </span>
        </el-row>
      </el-form>
    </el-card>

    <!-- clients -->
    <el-table v-show="activeTab==='clients'" v-loading="$store.state.loading" border :data="clients">
      <el-table-column prop="clientid" :label="$t('clients.clientId')" width="160px" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <a
            href="javascript:;"
            @click="$router.push({ path: `/clients/${encodeURIComponent(row.clientid)}` })">
            {{ row.clientid }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="username" min-width="100px" :label="$t('clients.username')" show-overflow-tooltip></el-table-column>
      <el-table-column prop="ip_address" :label="$t('clients.ipAddr')" min-width="140px" show-overflow-tooltip>
        <template slot-scope="{ row }">
          {{ row.ip_address }}:{{ row.port }}
        </template>
      </el-table-column>
      <el-table-column prop="keepalive" min-width="100px" :label="$t('clients.keepalive')"></el-table-column>
      <el-table-column prop="expiry_interval" min-width="150px" :label="$t('clients.expiryInterval')"></el-table-column>
      <el-table-column prop="subscriptions_cnt" min-width="160px" :label="$t('clients.subscriptionsCount')"></el-table-column>
      <el-table-column prop="connected" min-width="140px" :label="$t('clients.connected')">
        <template slot-scope="{ row }">
          <span :class="[row.connected ? 'connected' : 'disconnected', 'status-circle']"></span>
          {{ row.connected ? $t('websocket.connected') : $t('websocket.disconnected') }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" :label="$t('clients.createdAt')" min-width="160px"></el-table-column>
      <el-table-column fixed="right" width="120px" :label="$t('oper.oper')">
        <template slot-scope="{ row, $index, _self }">
          <el-popover
           :ref="`popover-${$index}`"
           placement="right"
           trigger="click">
            <p>{{ row.connected ? $t('oper.confirmKickOut') : $t('oper.confirmCleanSession') }}</p>
            <div style="text-align: right">
              <el-button
                size="mini"
                type="text"
                class="cache-btn"
                @click="_self.$refs[`popover-${$index}`].doClose()">
                {{ $t('oper.cancel') }}
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleDisconnect(row, $index, _self)">
                {{ $t('oper.confirm') }}
              </el-button>
            </div>
            <el-button
              slot="reference"
              size="mini"
              type="danger"
              plain>
              {{ row.connected ? $t('clients.kickOut') : $t('websocket.cleanSession') }}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!-- topics -->
    <el-table v-show="activeTab==='topics'" v-loading="$store.state.loading" border :data="topics">
      <el-table-column prop="topic" :label="$t('topics.topic')"></el-table-column>
      <el-table-column prop="node" :label="$t('topics.node')"></el-table-column>
    </el-table>

    <!-- subscriptions -->
    <el-table v-show="activeTab==='subscriptions'" v-loading="$store.state.loading" border :data="subscriptions">
      <el-table-column v-if="cluster" prop="node" min-width="160" :label="$t('clients.node')">
      </el-table-column>
      <el-table-column prop="clientid" :label="$t('subscriptions.clientId')"></el-table-column>
      <el-table-column prop="topic" :label="$t('subscriptions.topic')"></el-table-column>
      <el-table-column prop="qos" :label="$t('subscriptions.qoS')"></el-table-column>
    </el-table>

    <!-- pagination -->
    <el-pagination
      v-if="count > 10"
      background
      small
      layout="total, sizes, prev, pager, next"
      :page-sizes="[10, 50, 100, 300, 500]"
      :current-page.sync="params._page"
      :page-size="params._limit"
      :total="count"
      @size-change="handleSizeChange"
      @current-change="loadChild">
    </el-pagination>
    <div v-if="count === -1" class="custom-pagination">
      <a :class="['prev', params._page === 1 ? 'disabled' : '']" href="javascript:;" @click="handlePrevClick">
        <i class="el-icon-arrow-left"></i>
      </a>
      <a :class="['next', hasnext ? '' : 'disabled']" href="javascript:;" @click="handleNextClick">
        <i class="el-icon-arrow-right"></i>
      </a>
    </div>
  </div>
</template>


<script>
/* eslint-disable camelcase */
import {
  Pagination, Input, Select, Option, Table, TableColumn, DatePicker,
} from 'element-ui'
import { mapActions } from 'vuex'

export default {
  name: 'data-view',
  components: {
    'el-pagination': Pagination,
    'el-input': Input,
    'el-select': Select,
    'el-option': Option,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-date-picker': DatePicker,
  },
  data() {
    return {
      searchView: false,
      cluster: false,
      popoverVisible: false,
      count: 0,
      hasnext: false,
      params: {
        _page: 1,
        _limit: 10,
      },
      nodeName: '',
      nodes: [],
      activeTab: 'clients',
      searchKey: '',
      searchValue: '',
      searchPlaceholder: this.$t('clients.clientId'),
      clients: [],
      clientFFuzzyParams: {
        comparator: '_gte',
      },
      topics: [],
      subscriptions: [],
      showMoreQuery: false,
    }
  },
  watch: {
    $route: 'init',
    activeTab() {
      this.clientFFuzzyParams = {
        comparator: '_gte',
      }
    },
  },
  computed: {
    iconStatus() {
      return this.searchView ? 'el-icon-close' : 'el-icon-search'
    },
  },
  methods: {
    ...mapActions(['CURRENT_NODE']),
    // set global nodeName without
    stashNode() {
      this.cluster = this.nodeName === 'cluster'
      if (this.cluster) {
        return
      }
      this.CURRENT_NODE(this.nodeName)
    },
    // get path
    init() {
      this.activeTab = this.$route.path.split('/')[1]
      this.params._page = 1
      switch (this.activeTab) {
        case 'topics':
          this.searchPlaceholder = 'Topic'
          break
        default:
          this.searchPlaceholder = this.$t('clients.clientId')
          break
      }
      this.loadData()
    },
    loadData() {
      this.searchValue = ''
      // set default of select
      this.$httpGet('/nodes').then((response) => {
        const currentNode = this.$store.state.nodeName || response.data[0].node
        this.nodeName = this.cluster ? 'cluster' : currentNode
        this.nodes = response.data
        this.loadChild()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    loadChild(reload = false, queryParams = null) {
      this.stashNode()
      this.searchView = false
      this.searchValue = ''
      // load child with the page asc
      if (reload === true) {
        this.params._page = 1
      }
      if (!this.nodeName && this.activeTab !== 'topics') {
        return
      }
      let url = `/nodes/${this.nodeName}/${this.activeTab}`
      // cluster
      if (this.activeTab === 'topics' || this.cluster) {
        url = this.activeTab === 'topics' ? 'routes' : this.activeTab
      }
      let params = {}
      if (queryParams) {
        params = {
          ...queryParams,
          ...this.params,
        }
      } else {
        params = {
          ...this.params,
        }
      }
      this.$httpGet(url, params).then((response) => {
        this[this.activeTab] = response.data.items
        this.count = response.data.meta.count || 0
        this.hasnext = response.data.meta.hasnext
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    searchChild() {
      // click clear button
      if (this.searchView) {
        this.loadChild()
        return
      }
      if (!this.searchValue) {
        this.loadData()
        return
      }
      let requestURL = `/nodes/${this.nodeName}/${this.activeTab}/${encodeURIComponent(this.searchValue)}`
      if (this.activeTab === 'topics' || this.cluster) {
        const url = this.activeTab === 'topics' ? 'routes' : this.activeTab
        requestURL = `/${url}/${encodeURIComponent(this.searchValue)}`
      }
      this.$httpGet(requestURL).then((response) => {
        // reset page
        this.count = 0
        this.params = {
          _page: 1,
          _limit: 10,
        }
        this.searchView = true
        this[this.activeTab] = response.data
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    handleSizeChange(val) {
      this.params._limit = val
      this.loadChild(true)
    },
    handlePrevClick() {
      if (this.params._page === 1) {
        return
      }
      this.params._page -= 1
      const params = this.genQueryParams(this.clientFFuzzyParams)
      this.loadChild(false, params)
    },
    handleNextClick() {
      if (!this.hasnext) {
        return
      }
      this.params._page += 1
      const params = this.genQueryParams(this.clientFFuzzyParams)
      this.loadChild(false, params)
    },
    handleDisconnect(row, index, self) {
      this.$httpDelete(`/clients/${encodeURIComponent(row.clientid)}`).then(() => {
        this.loadData()
        // Close popover
        self.$refs[`popover-${index}`].doClose()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    genQueryParams(params) {
      const {
        _like_clientid, _like_username, ip_address, conn_state, proto_name, comparator, _connected_at,
      } = params
      const newParams = {
        _like_clientid,
        _like_username,
        ip_address,
        conn_state,
        proto_name,
      }
      if (_connected_at) {
        const connectedAtKey = `${comparator}_connected_at`
        newParams[connectedAtKey] = Math.floor(_connected_at / 1000)
      }
      return newParams
    },
    clientQuerySearch() {
      const params = this.genQueryParams(this.clientFFuzzyParams)
      this.loadChild(true, params)
    },
    resetClientQuerySearch() {
      this.clientFFuzzyParams = {
        comparator: '>=',
      }
      this.init()
    },
  },
  created() {
    this.init()
  },
}
</script>


<style lang="scss">
.data-view {
  .el-table {
    margin-top: 24px;
  }

  .el-row {
    margin-top: 20px;
  }

  .el-input {
    width: 240px;
  }

  .search-btn {
    margin-left: 8px
  }

  .el-breadcrumb {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .el-pagination .el-select .el-input .el-input__inner {
    height: 22px;
  }

  .el-select .el-input .el-select__caret {
    line-height: 12px;
  }

  .search-card {
    margin-top: 24px;
    border: none;
    .el-card__body {
      padding: 5px 12px;
    }
   .el-input, .el-select {
      width: 100%;
    }
    .col-oper {
      float: right;
      position: relative;
      top: 1px;
      .show-more {
        margin: 0px 10px;
        font-size: 12px;
      }
      margin-bottom: 10px;
    }
    .form-item-row {
      margin-top: 0px;
     .el-select.comparator .el-input--medium .el-input__inner {
        border-radius: 4px 0 0 4px;
      }
      .datatime.el-input .el-input__inner {
        border-radius: 0 4px 4px 0;
      }
    }
    .el-select .el-input .el-select__caret {
      line-height: 36px;
    }
  }

  .custom-pagination {
    text-align: right;
    margin-top: 10px;
    a {
      color: #606266;
      &:hover {
        color: #42d885;
      }
    }
    a.disabled {
      color: #C0C4CC;
      cursor: not-allowed;
    }
  }
}
</style>
