<template>
  <div class="data-view">
    <div class="page-title">
      {{ $t(`leftbar.${activeTab}`) }}
      <div style="float: right" @keyup.enter.native="searchChild">
        <el-select
          v-if="activeTab !== 'topics'"
          v-model="nodeName"
          class="select-radius"
          :placeholder="$t('select.placeholder')"
          :disabled="$store.state.loading"
          @change="loadChild(true)"
        >
          <el-option v-for="item in nodes" :key="item.node" :label="item.name || item.node" :value="item.node">
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- Fuzzy search card -->
    <el-card v-if="activeTab !== 'topics'" class="el-card--self search-card">
      <el-form ref="fuzzyParams" :model="fuzzyParams" label-position="left" label-width="110px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item :label="$t('clients.clientId')">
              <el-input type="text" size="small" v-model="fuzzyParams._like_clientid"> </el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="activeTab === 'clients'" :span="8">
            <el-form-item :label="$t('clients.username')">
              <el-input type="text" size="small" v-model="fuzzyParams._like_username"> </el-input>
            </el-form-item>
          </el-col>
          <el-col v-else-if="activeTab === 'subscriptions'" :span="8">
            <el-form-item :label="$t('topics.topic')">
              <el-row class="form-item-row">
                <el-col :span="9">
                  <el-select v-model="fuzzyParams.match" class="match">
                    <el-option label="filter" value="_match_topic"></el-option>
                    <el-option label="topic" value="topic"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="15">
                  <el-input type="text" size="small" v-model="fuzzyParams.topic"> </el-input>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>

          <template v-if="showMoreQuery">
            <template v-if="activeTab === 'clients'">
              <el-col :span="8">
                <el-form-item :label="$t('clients.ipAddr')">
                  <el-input type="text" size="small" v-model="fuzzyParams.ip_address"> </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('clients.connected')">
                  <el-select v-model="fuzzyParams.conn_state">
                    <el-option value="connected"></el-option>
                    <el-option value="disconnected"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('clients.createdAt')">
                  <el-row class="form-item-row">
                    <el-col :span="8">
                      <el-select v-model="fuzzyParams.comparator" class="comparator">
                        <el-option label=">=" value="_gte"></el-option>
                        <el-option label="<=" value="_lte"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="16">
                      <el-date-picker
                        v-model="fuzzyParams._created_at"
                        class="datatime"
                        type="datetime"
                        value-format="timestamp"
                      >
                      </el-date-picker>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('clients.protoName')">
                  <el-select v-model="fuzzyParams.proto_name">
                    <el-option v-for="name in protoNames" :key="name" :value="name"> </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </template>

            <template v-else-if="activeTab === 'subscriptions'">
              <el-col :span="8">
                <el-form-item label="QoS">
                  <el-select v-model="fuzzyParams.qos" clearable>
                    <el-option :value="0"></el-option>
                    <el-option :value="1"></el-option>
                    <el-option :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" class="col-share">
                <el-form-item :label="$t('subscriptions.share')">
                  <el-input type="text" size="small" v-model="fuzzyParams.share" placeholder="group_name"> </el-input>
                </el-form-item>
              </el-col>
            </template>
          </template>

          <span class="col-oper">
            <el-button size="small" type="primary" plain @click="clientQuerySearch">
              {{ $t('oper.search') }}
            </el-button>
            <el-button size="small" plain @click="resetClientQuerySearch">
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
    <el-table v-show="activeTab === 'clients'" v-loading="$store.state.loading" border :data="clients">
      <el-table-column prop="clientid" :label="$t('clients.clientId')" width="160px" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <a href="javascript:;" @click="$router.push({ path: `/clients/${encodeURIComponent(row.clientid)}` })">
            {{ row.clientid }}
          </a>
        </template>
      </el-table-column>
      <el-table-column
        prop="username"
        min-width="100px"
        :label="$t('clients.username')"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="ip_address" :label="$t('clients.ipAddr')" min-width="140px" show-overflow-tooltip>
        <template slot-scope="{ row }"> {{ row.ip_address }}:{{ row.port }} </template>
      </el-table-column>
      <el-table-column prop="keepalive" min-width="100px" :label="$t('clients.keepalive')"></el-table-column>
      <el-table-column prop="expiry_interval" min-width="150px" :label="$t('clients.expiryInterval')"></el-table-column>
      <el-table-column
        prop="subscriptions_cnt"
        min-width="160px"
        :label="$t('clients.subscriptionsCount')"
      ></el-table-column>
      <el-table-column prop="connected" min-width="140px" :label="$t('clients.connected')">
        <template slot-scope="{ row }">
          <span :class="[row.connected ? 'connected' : 'disconnected', 'status-circle']"></span>
          {{ row.connected ? $t('websocket.connected') : $t('websocket.disconnected') }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" :label="$t('clients.createdAt')" min-width="160px"></el-table-column>
      <el-table-column fixed="right" width="120px" :label="$t('oper.oper')">
        <template slot-scope="{ row, $index, _self }">
          <el-popover :ref="`popover-${$index}`" placement="right" trigger="click">
            <p>{{ row.connected ? $t('oper.confirmKickOut') : $t('oper.confirmCleanSession') }}</p>
            <div style="text-align: right">
              <el-button size="mini" type="text" class="cache-btn" @click="_self.$refs[`popover-${$index}`].doClose()">
                {{ $t('oper.cancel') }}
              </el-button>
              <el-button size="mini" type="success" @click="handleDisconnect(row, $index, _self)">
                {{ $t('oper.confirm') }}
              </el-button>
            </div>
            <el-button slot="reference" size="mini" type="danger" plain>
              {{ row.connected ? $t('clients.kickOut') : $t('websocket.cleanSession') }}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <!-- topics -->
    <el-table v-show="activeTab === 'topics'" v-loading="$store.state.loading" border :data="topics">
      <el-table-column prop="topic" :label="$t('topics.topic')"></el-table-column>
      <el-table-column prop="node" :label="$t('topics.node')"></el-table-column>
    </el-table>

    <!-- subscriptions -->
    <el-table v-show="activeTab === 'subscriptions'" v-loading="$store.state.loading" border :data="subscriptions">
      <el-table-column v-if="cluster" prop="node" min-width="160" :label="$t('clients.node')"> </el-table-column>
      <el-table-column prop="clientid" :label="$t('subscriptions.clientId')"></el-table-column>
      <el-table-column prop="topic" :label="$t('subscriptions.topic')"></el-table-column>
      <el-table-column prop="qos" :label="$t('subscriptions.qoS')"></el-table-column>
    </el-table>

    <div class="center-align">
      <!-- pagination -->
      <el-pagination
        v-if="count > 10"
        background
        layout="total, sizes, prev, pager, next"
        :page-sizes="[10, 50, 100, 300, 500]"
        :current-page.sync="params._page"
        :page-size="params._limit"
        :total="count"
        @size-change="handleSizeChange"
        @current-change="loadChild"
      >
      </el-pagination>
      <div v-if="count === -1 && (clients.length || subscriptions.length)" class="custom-pagination">
        <a :class="['prev', params._page === 1 ? 'disabled' : '']" href="javascript:;" @click="handlePrevClick">
          <i class="el-icon-arrow-left"></i>
          {{ $t('oper.prev') }}
        </a>
        <a :class="['next', hasnext ? '' : 'disabled']" href="javascript:;" @click="handleNextClick">
          {{ $t('oper.next') }}
          <i class="el-icon-arrow-right"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable camelcase */
// import { Pagination, Input, Select, Option, Table, TableColumn, DatePicker } from 'element-ui'
import { mapActions } from 'vuex'

export default {
  name: 'data-view',
  // components: {
  //   'el-pagination': Pagination,
  //   'el-input': Input,
  //   'el-select': Select,
  //   'el-option': Option,
  //   'el-table': Table,
  //   'el-table-column': TableColumn,
  //   'el-date-picker': DatePicker,
  // },
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
      fuzzyParams: {
        comparator: '_gte',
        match: '_match_topic',
      },
      topics: [],
      subscriptions: [],
      showMoreQuery: false,
      protoNames: ['MQTT', 'MQTT-SN', 'CoAP', 'LwM2M'],
    }
  },
  watch: {
    $route: 'init',
    activeTab() {
      this.fuzzyParams = {
        comparator: '_gte',
        match: '_match_topic',
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
      this.$httpGet('/nodes')
        .then((response) => {
          let currentNode = ''
          if (this.activeTab !== 'topics') {
            const allNodesOption = [
              {
                name: this.$t('select.cluster'),
                node: 'all',
              },
            ]
            this.nodes = allNodesOption.concat(response.data)
            currentNode = 'all'
          } else {
            this.nodes = response.data
            currentNode = this.$store.state.nodeName || this.nodes[0].node
          }
          this.nodeName = this.cluster ? 'cluster' : currentNode
          this.loadChild()
        })
        .catch((error) => {
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
      // show allNodes data or single node data
      let url =
        this.nodeName === 'all' && this.activeTab !== 'topics'
          ? `/${this.activeTab}`
          : `/nodes/${this.nodeName}/${this.activeTab}`
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
      this.$httpGet(url, params)
        .then((response) => {
          this[this.activeTab] = response.data.items
          this.count = response.data.meta.count || 0
          this.hasnext = response.data.meta.hasnext
        })
        .catch((error) => {
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
      this.$httpGet(requestURL)
        .then((response) => {
          // reset page
          this.count = 0
          this.params = {
            _page: 1,
            _limit: 10,
          }
          this.searchView = true
          this[this.activeTab] = response.data
        })
        .catch((error) => {
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
      const params = this.genQueryParams(this.fuzzyParams)
      this.loadChild(false, params)
    },
    handleNextClick() {
      if (!this.hasnext) {
        return
      }
      this.params._page += 1
      const params = this.genQueryParams(this.fuzzyParams)
      this.loadChild(false, params)
    },
    handleDisconnect(row, index, self) {
      this.$httpDelete(`/clients/${encodeURIComponent(row.clientid)}`)
        .then(() => {
          this.loadData()
          // Close popover
          self.$refs[`popover-${index}`].doClose()
        })
        .catch((error) => {
          this.$message.error(error || this.$t('error.networkError'))
        })
    },
    genQueryParams(params) {
      let newParams = {}
      if (this.activeTab === 'clients') {
        const { _like_clientid, _like_username, ip_address, conn_state, proto_name, comparator, _created_at } = params
        newParams = {
          _like_clientid: _like_clientid || undefined,
          _like_username: _like_username || undefined,
          ip_address: ip_address || undefined,
          conn_state: conn_state || undefined,
          proto_name: proto_name || undefined,
        }
        if (_created_at) {
          const connectedAtKey = `${comparator}_created_at`
          newParams[connectedAtKey] = Math.floor(_created_at / 1000)
        }
      } else if (this.activeTab === 'subscriptions') {
        const { _like_clientid, topic, qos, share, match } = params
        newParams = {
          clientid: _like_clientid || undefined,
          qos: qos === '' ? undefined : qos,
          share: share || undefined,
        }
        if (topic) {
          newParams[match] = topic
        }
      }
      return newParams
    },
    clientQuerySearch() {
      const params = this.genQueryParams(this.fuzzyParams)
      this.loadChild(true, params)
    },
    resetClientQuerySearch() {
      this.fuzzyParams = {
        comparator: '>=',
        match: '_match_topic',
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
    margin-left: 8px;
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
    .el-input,
    .el-select {
      width: 100%;
    }
    .el-input--medium .el-input__inner {
      height: 32px !important;
    }
    .col-share {
      position: absolute;
      bottom: -13px;
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
      .el-select.comparator .el-input--medium .el-input__inner,
      .el-select.match .el-input--medium .el-input__inner {
        border-radius: 4px 0 0 4px;
      }
      .el-input__inner {
        border-radius: 0 4px 4px 0;
      }
    }
    .el-select .el-input .el-select__caret {
      line-height: 36px;
    }
  }

  .custom-pagination {
    margin-top: 10px;
    a {
      transition: all 0.3s ease;
      color: #fff;
      margin-right: 10px;
      background: #42d885;
      display: inline-block;
      border-radius: 4px;
      padding: 5px 8px;
      &:hover {
        color: #fff;
      }
    }
    a.disabled {
      transition: all 0.3s ease;
      color: #606266;
      background: transparent;
      cursor: not-allowed;
    }
  }
}
</style>
