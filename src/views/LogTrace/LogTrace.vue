<template>
  <div class="log-trace">
    <div class="page-title">
      <div>
        {{ $t('logTrace.logTrace') }}
        <span class="sub-tip">{{ $t('logTrace.logTraceDesc') }}</span>
      </div>

      <el-button
        v-if="!isLogTraceEnable"
        class="confirm-btn"
        round
        plain
        type="success"
        size="medium"
        :disable="$store.state.loading"
        @click="enableLogTrace(selfArgument, $event)"
      >
        {{ $t('modules.enable') }}
      </el-button>
      <el-button
        v-else
        class="confirm-btn"
        round
        plain
        type="success"
        icon="el-icon-plus"
        size="medium"
        :disable="$store.state.loading"
        @click="addLogTrace"
      >
        {{ $t('rule.create') }}
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
        <template #default="{ row }"> {{ row.start_at | dateFormat }}<br />{{ row.end_at | dateFormat }} </template>
      </el-table-column>
      <el-table-column :label="$t('logTrace.status')" sortable>
        <template #default="{ row }">
          <div class="trace-status">
            <el-badge
              is-dot
              :type="row.status === 'running' ? 'primary' : row.status === 'stopped' ? 'danger' : 'info'"
            />
            <span>{{ row.status && $t('logTrace.s' + row.status) }}</span>
          </div>
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
          <el-button plain size="mini" @click="downloadLog(row)">
            {{ $t('logTrace.download') }}
          </el-button>
          <template v-if="row.status !== 'stopped'">
            <el-button plain size="mini" type="danger" @click="stopTrace(row)">
              {{ $t('logTrace.stop') }}
            </el-button>
          </template>
          <template v-else>
            <el-button plain size="mini" type="danger" @click="deleteTrace(row)">
              {{ $t('oper.delete') }}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <CreateLogTraceDialog v-model="showCreateDialog" @submitted="loadTableData" />
  </div>
</template>

<script>
import filters from '~/common/filter'
import CreateLogTraceDialog from './components/CreateLogTraceDialog.vue'
import downloadTraceLog from '~/api/downloadTraceLog'

const LOG_TRACE_MODULE_NAME = 'emqx_mod_trace'

export default {
  name: 'log-trace',

  filters,

  components: {
    CreateLogTraceDialog,
  },

  data() {
    return {
      isLogTraceEnable: true,
      tableSorter: undefined,
      tableData: [],
      showCreateDialog: false,
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
    addLogTrace() {
      this.showCreateDialog = true
    },
    async stopTrace({ name }) {
      try {
        await this.$httpPut(`/trace/${encodeURIComponent(name)}/stop`)
        this.$message.success(this.$t('logTrace.stopSuc'))
        this.loadTableData()
      } catch (error) {
        console.error(error)
      }
    },
    async deleteTrace(data) {
      await this.$confirm(this.$t('logTrace.confirmDeleteTrace'), {
        confirmButtonText: this.$t('oper.confirm'),
        cancelButtonText: this.$t('oper.cancel'),
        type: 'warning',
      })
      try {
        await this.$httpDelete(`/trace/${encodeURIComponent(data.name)}`)
        this.$message.success(this.$t('logTrace.deleteSuc'))
        this.loadTableData()
      } catch (error) {
        console.error(error)
      }
    },
    downloadLog(data) {
      downloadTraceLog(data.name)
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
  .el-badge {
    padding-top: 5px;
    line-height: 1;
    margin-right: 4px;
  }
}
</style>
