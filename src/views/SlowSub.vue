<template>
  <div class="slow-sub">
    <div class="page-title">
      <div>
        {{ $t('slowSub.slowSub') }}
        <span class="sub-tip">{{ $t('slowSub.slowSubDesc') }}</span>
      </div>
      <div v-if="isSlowSubEnable">
        <el-select
          v-model="selectedNode"
          class="select-radius select-node"
          :disabled="$store.state.loading"
          :placeholder="$t('select.placeholder')"
          @change="refreshLocalData"
        >
          <el-option :label="$t('select.cluster')" :value="ALL_NODE_KEY"> </el-option>
          <el-option v-for="item in nodeOptions" :key="item.node" :label="item.name || item.node" :value="item.node" />
        </el-select>
        <el-button
          class="confirm-btn"
          round
          plain
          type="success"
          size="medium"
          :disable="$store.state.loading"
          @click="clearSlowSub"
        >
          {{ $t('slowSub.clearData') }}
        </el-button>
      </div>

      <el-button
        v-else
        class="confirm-btn"
        round
        plain
        type="success"
        size="medium"
        :disable="$store.state.loading"
        @click="enableSlowSub"
      >
        {{ $t('modules.enable') }}
      </el-button>
    </div>
    <el-table border v-loading="$store.state.loading" :data="tableData" @sort-change="sortTable">
      <el-table-column prop="clientid" label="Client ID">
        <template slot-scope="{ row }">
          <router-link
            :to="{
              name: 'clientDetails',
              params: { id: row.clientid },
            }"
          >
            {{ row.clientid }}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="topic" :label="$t('topics.topic')" />
      <el-table-column prop="timespan" :label="$t('slowSub.latencyTime')" sortable="custom">
        <template slot-scope="{ row }"> {{ formatTime(row.timespan) }} </template>
      </el-table-column>
      <el-table-column prop="node" :label="$t('topics.node')" />
      <el-table-column prop="last_update_time" :label="$t('slowSub.updated')">
        <template slot-scope="{ row }">
          {{ row.last_update_time | dateFormat }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="pageParams.count > 10"
      background
      layout="total, sizes, prev, pager, next"
      :page-sizes="[10, 50, 100, 300, 500]"
      :current-page.sync="pageParams.page"
      :page-size="pageParams.limit"
      :total="pageParams.count"
      @size-change="handleSizeChange"
      @current-change="getPageData"
    >
    </el-pagination>
  </div>
</template>

<script>
import filters from '~/common/filter'
import paging from '~/common/paging'

const ALL_NODE_KEY = 'all'
const { setTotalData, getAPageData } = paging()

export default {
  name: 'slow-sub',

  filters,

  data() {
    return {
      isSlowSubEnable: true,
      selectedNode: ALL_NODE_KEY,
      ALL_NODE_KEY,
      nodeOptions: [],
      tableSorter: undefined,
      totalSlowSubData: [
        {
          clientid: 'string',
          topic: 'string',
          timespan: 1000,
          node: 'string',
          last_update_time: Date.now(),
        },
      ],
      tableData: [],
      pageParams: {
        page: 1,
        limit: 10,
        count: 0,
      },
    }
  },

  methods: {
    loadTotalData() {
      // TODO:
      this.$httpGet('/query-slow-sub')
        .then((res) => {
          const { data } = res
          this.totalSlowSubData = data
          setTotalData(data)
          this.getPageData()
          this.isSlowSubEnable = true
        })
        .catch((error) => {
          this.$message.warning(this.$t(`error.${error.message}`))
          this.isSlowSubEnable = false
        })
    },
    getPageData() {
      const { limit, page } = this.pageParams
      const filters = []
      const { tableSorter } = this
      if (this.selectedNode !== ALL_NODE_KEY) {
        filters.push({
          key: 'node',
          value: this.selectedNode,
        })
      }
      const { data, meta } = getAPageData({ limit, page }, filters, tableSorter)
      this.pageParams = meta
      this.tableData = data
    },
    handleSizeChange(size) {
      this.pageParams.limit = size
      this.refreshLocalData()
    },
    refreshLocalData() {
      this.pageParams.page = 1
      this.getPageData()
    },
    sortTable(orderMsg) {
      const { order } = orderMsg
      this.tableSorter = !order
        ? undefined
        : {
            key: 'timespan',
            type: order === 'descending' ? 'desc' : 'asc',
          }
      this.refreshLocalData()
    },
    loadNodes() {
      this.$httpGet('/nodes')
        .then((response) => {
          this.nodeName = response.data[0].node
          this.nodeOptions = response.data
        })
        .catch((error) => {
          const msg = error.message || error
          this.$message.error(msg || this.$t('error.networkError'))
        })
    },
    enableSlowSub() {
      this.$httpGet('/enable-slow-sub')
        .then(() => {
          this.loadTotalData()
        })
        .catch((error) => {
          this.$message.warning(this.$t(`error.${error.message}`))
        })
    },
    clearSlowSub() {
      // TODO:
      this.$httpGet('/clear-slow-sub')
        .then(() => {
          this.$message.success(this.$t(`oper.clear`))
          this.loadTotalData()
        })
        .catch((error) => {
          this.$message.warning(this.$t(`error.${error.message}`))
        })
    },
    formatTime(val) {
      if (val < 1000) {
        return `${val} ms`
      }
      return `${val / 1000} s`
    },
  },

  created() {
    this.loadTotalData()
    this.loadNodes()
  },
}
</script>

<style lang="scss">
.slow-sub {
  .page-title {
    display: flex;
    justify-content: space-between;
  }
  .sub-tip {
    font-size: 14px;
    color: #9e9e9f;
    text-transform: none;
    margin-right: 10px;
  }
  .select-node {
    float: none;
    margin-right: 24px;
  }
  .el-table {
    margin-top: 24px;
  }
}
</style>
