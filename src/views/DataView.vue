<template>
  <div class="data-view">
    <div class="page-title">
      {{ $t(`leftbar.${activeTab}`) }}
      <div style="float: right" @keyup.enter.native="searchChild">
        <el-input
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
          <!--<el-option value="cluster" :label="$t('select.cluster')"></el-option>-->
          <el-option
            v-for="item in nodes"
            :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </div>
    </div>

    <!-- clients -->
    <el-table v-show="activeTab==='clients'" v-loading="$store.state.loading" border :data="clients">
      <el-table-column prop="client_id" label="Client ID" width="160px" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <a href="javascript:;" @click="$router.push({ path: `/clients/${row.client_id}` })">
            {{ row.client_id }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="Username" show-overflow-tooltip></el-table-column>
      <el-table-column prop="keepalive" label="Keepalive"></el-table-column>
      <el-table-column prop="expiry_interval" :label="$t('clients.expiryInterval')"></el-table-column>
      <el-table-column prop="subscriptions_cnt" :label="$t('clients.subscriptionsCount')"></el-table-column>
      <el-table-column prop="connected" :label="$t('clients.connected')">
        <template slot-scope="{ row }">
          <span :class="[row.connected ? 'connected' : 'disconnected', 'status-circle']"></span>
          {{ row.connected ? $t('websocket.connected') : $t('websocket.disconnected') }}
        </template>
      </el-table-column>
      <el-table-column prop="created_at" :label="$t('clients.createdAt')" width="160px"></el-table-column>
      <el-table-column width="120px" :label="$t('oper.oper')">
        <template slot-scope="{ row, $index, _self }">
          <el-popover
           :ref="`popover-${$index}`"
           placement="right"
           trigger="click">
            <p>{{ row.connected ? $t('oper.confirmDisconnect') : $t('oper.confirmCleanSession') }}</p>
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
              {{ row.connected ? $t('websocket.disconnect') : $t('websocket.cleanSession') }}
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
      <el-table-column prop="client_id" :label="$t('subscriptions.clientId')"></el-table-column>
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
  </div>
</template>


<script>
import { Pagination, Input, Select, Option, Table, TableColumn } from 'element-ui'
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
  },
  data() {
    return {
      searchView: false,
      cluster: false,
      popoverVisible: false,
      count: 0,
      params: {
        _page: 1,
        _limit: 10,
      },
      nodeName: '',
      nodes: [],
      activeTab: 'clients',
      searchKey: '',
      searchValue: '',
      searchPlaceholder: 'ClientId',
      clients: [],
      topics: [],
      subscriptions: [],
    }
  },
  watch: {
    $route: 'init',
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
          this.searchPlaceholder = 'ClientId'
          break
      }
      this.loadData()
    },
    loadData() {
      this.searchValue = ''
      // set default of select
      this.$httpGet('/nodes').then((response) => {
        const currentNode = this.$store.state.nodeName || response.data[0].name
        this.nodeName = this.cluster ? 'cluster' : currentNode
        this.nodes = response.data
        this.loadChild()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    loadChild(reload = false) {
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
      this.$httpGet(url, this.params).then((response) => {
        this[this.activeTab] = response.data.items
        this.count = response.data.meta.count || 0
        // this.params._page = response.data.meta.page || 1
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    searchChild() {
      // click x button
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
    handleDisconnect(row, index, self) {
      this.$httpDelete(`/clients/${row.client_id}`).then(() => {
        this.loadData()
        // Close popover
        self.$refs[`popover-${index}`].doClose()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
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
}
</style>
