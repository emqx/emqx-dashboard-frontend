<template>
  <div class="slow-sub">
    <div class="page-title">
      <div>
        {{ $t('slowSub.slowSub') }}
        <span class="sub-tip">{{ $t('slowSub.slowSubDesc') }}</span>
      </div>
      <el-button
        v-if="isSlowSubEnable"
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

const SLOW_SUB_MODULE_NAME = 'emqx_mod_slow_subs'
const { setTotalData, getAPageData } = paging()

export default {
  name: 'slow-sub',

  filters,

  data() {
    return {
      isSlowSubEnable: true,
      tableSorter: undefined,
      totalSlowSubData: [],
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
      this.$httpGet('/slow_subscriptions')
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
      const { tableSorter } = this
      const { data, meta } = getAPageData({ limit, page }, [], tableSorter)
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
    enableSlowSub() {
      this.$httpPut(`/modules/${SLOW_SUB_MODULE_NAME}/load`)
        .then(() => {
          this.$message.success(this.$t('oper.enableSuccess'))
          this.loadTotalData()
        })
        .catch((error) => {
          this.$message.warning(this.$t(`error.${error.message}`))
        })
    },
    async clearSlowSub() {
      await this.$confirm(this.$t('slowSub.clearSlowSubscriptionConfirm'), this.$t('oper.warning'), {
        confirmButtonClass: 'confirm-btn',
        cancelButtonClass: 'cache-btn el-button--text',
        type: 'warning',
      })
      this.$httpDelete('/slow_subscriptions')
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
    margin-left: 8px;
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
