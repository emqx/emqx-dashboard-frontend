<template>
  <div class="log-trace">
    <div class="page-title">
      <div>
        {{ $t('logTrace.logTrace') }}
        <span class="sub-tip">{{ $t('logTrace.logTraceDesc') }}</span>
      </div>

      <el-button
        class="confirm-btn"
        round
        plain
        type="success"
        size="medium"
        :disable="$store.state.loading"
        @click="enableLogTrace"
      >
        {{ $t('modules.enable') }}
      </el-button>
    </div>

    <el-table :data="tableData" border v-loading="$store.state.loading">
      <el-table-column :label="$t('logTrace.name')" prop="name" sortable></el-table-column>
      <el-table-column :label="$t('logTrace.type')" prop="type" sortable></el-table-column>
      <el-table-column :label="$t('logTrace.condition')">
        <template #default="{ row }">
          {{ row[row.type] }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('logTrace.startEndTime')" min-width="90" sortable>
        <template #default="{ row }">
          {{ moment(row.start_at).format('YYYY-MM-DD HH:mm:ss') }}<br />{{
            moment(row.end_at).format('YYYY-MM-DD HH:mm:ss')
          }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('logTrace.status')" sortable>
        <template #default="{ row }">
          <el-badge
            is-dot
            :type="row.status === 'running' ? 'primary' : row.status === 'stopped' ? 'danger' : 'info'"
          ></el-badge
          ><span>{{ row.status && $t('logTrace.s' + row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('logTrace.logSize')" sortable>
        <template #default="{ row }">
          {{ (Object.keys(row.log_size).reduce((c, v) => c + row.log_size[v], 0) / 1024).toFixed(2) }}KB
        </template>
      </el-table-column>
      <el-table-column min-width="140" :label="$t('oper.oper')">
        <template #default="{ row }">
          <el-button
            plain
            size="mini"
            @click="
              $router.push({
                name: 'log-trace-detail',
                params: { id: row.name },
              })
            "
          >
            {{ $t('logTrace.view') }}
          </el-button>
          <el-button plain size="mini" @click="download(row)">{{ $t('logTrace.download') }}</el-button>
          <template v-if="row.status !== 'stopped'">
            <el-button plain size="mini" type="danger" @click="stopTraceHandler(row)">
              {{ $t('logTrace.stop') }}
            </el-button>
          </template>
          <template v-else>
            <el-button plain size="mini" type="danger" @click="deleteTraceHandler(row)">
              {{ $t('oper.delete') }}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import filters from '~/common/filter'

const LOG_TRACE_MODULE_NAME = 'emqx_mod_trace'

export default {
  name: 'log-trace',

  filters,

  data() {
    return {
      isLogTraceEnable: true,
      tableSorter: undefined,
      tableData: [{}],
    }
  },

  methods: {
    loadTableData() {
      // TODO:
      this.$httpGet('/trace')
        .then((res) => {
          const { data } = res
          this.tableData = data
          this.isLogTraceEnable = true
        })
        .catch((error) => {
          this.$message.warning(this.$t(`error.${error.message}`))
          this.isLogTraceEnable = false
        })
    },
    enableLogTrace() {
      this.$httpPut(`/modules/${LOG_TRACE_MODULE_NAME}/load`)
        .then(() => {
          this.$message.success(this.$t('oper.enableSuccess'))
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
    this.loadTableData()
  },
}
</script>

<style lang="scss">
.log-trace {
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
