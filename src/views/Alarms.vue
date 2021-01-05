<template>
  <div class="alarms-view">
    <div class="page-title">
      {{ $t('leftbar.alarms') }}
    </div>
    <!-- alarms list -->
    <div class="table-title">{{ $t('analysis.currentAlarms') }}</div>
    <el-table v-loading="loading" border :data="currentTableData">
      <el-table-column prop="name" :label="$t('analysis.alarmName')"></el-table-column>
      <el-table-column prop="message" min-width="140px" :label="$t('analysis.alarmMessage')" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-popover placement="top" trigger="hover" width="160" :open-delay="500">
            <div v-for="(value, label) in row.details" :key="label">{{ label }}: {{ value }}</div>
            <span slot="reference" class="details">
              <i class="iconfont icon-bangzhu"></i>
            </span>
          </el-popover>
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="node" min-width="60px" :label="$t('clients.node')" show-overflow-tooltip></el-table-column>
      <el-table-column prop="activate_at" :label="$t('analysis.activateAt')">
        <template slot-scope="{ row }">
          {{ dateFormat(row.activate_at) }}
        </template>
      </el-table-column>
      <el-table-column>
        <span slot="header">
          {{ $t('analysis.duration') }}
          <el-popover trigger="hover" placement="top">
            {{ $t('analysis.durationTips') }}
            <i slot="reference" class="el-icon-question"></i>
          </el-popover>
        </span>
        <template slot-scope="{ row }">
          {{ getDuration(row.duration) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="120px" :label="$t('oper.oper')">
        <template slot-scope="{ row, $index, _self }">
          <el-popover :ref="`popover-${$index}`" placement="right" trigger="click">
            <p>{{ $t('analysis.confirmDeactivate') }}</p>
            <div style="text-align: right;">
              <el-button size="mini" type="text" class="cache-btn" @click="_self.$refs[`popover-${$index}`].doClose()">
                {{ $t('oper.cancel') }}
              </el-button>
              <el-button size="mini" type="success" @click="handleCancelAlarm(row, $index, _self)">
                {{ $t('oper.confirm') }}
              </el-button>
            </div>
            <el-button slot="reference" size="mini" type="danger" plain>
              {{ $t('analysis.deactivate') }}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <div class="table-title">
      {{ $t('analysis.historicalAlarm') }}
      <el-button
        class="table-oper"
        size="mini"
        type="danger"
        plain
        :disabled="!historicalTableData.length"
        @click="handleClearAll"
      >
        {{ $t('analysis.clearAll') }}
      </el-button>
    </div>
    <el-table v-loading="loading" border :data="historicalTableData">
      <el-table-column prop="name" :label="$t('analysis.alarmName')"></el-table-column>
      <el-table-column prop="message" min-width="140px" :label="$t('analysis.alarmMessage')" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-popover placement="top" trigger="hover" width="160" :open-delay="500">
            <div v-for="(value, label) in row.details" :key="label">{{ label }}: {{ value }}</div>
            <span slot="reference" class="details">
              <i class="iconfont icon-bangzhu"></i>
            </span>
          </el-popover>
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="node" min-width="60px" :label="$t('clients.node')" show-overflow-tooltip></el-table-column>
      <el-table-column prop="activate_at" :label="$t('analysis.activateAt')">
        <template slot-scope="{ row }">
          {{ dateFormat(row.activate_at) }}
        </template>
      </el-table-column>
      <el-table-column prop="deactivate_at" :label="$t('analysis.deactivateAt')">
        <template slot-scope="{ row }">
          {{ dateFormat(row.deactivate_at) }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Table, TableColumn, Popover, Tooltip } from 'element-ui'
import { getDateDiff } from '~/common/utils'
import dateformat from 'dateformat'

export default {
  name: 'alarms-view',
  components: {
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-popover': Popover,
    'el-tooltip': Tooltip,
  },
  data() {
    return {
      loading: false,
      currentTableData: [],
      historicalTableData: [],
      lang: window.localStorage.getItem('language') || 'en',
    }
  },
  methods: {
    loadData() {
      this.loadAlarmData('activated', 'currentTableData')
      this.loadAlarmData('deactivated', 'historicalTableData')
    },
    loadAlarmData(type, tableData) {
      this.loading = true
      this.$httpGet(`/alarms/${type}`)
        .then(response => {
          const res = response.data
          const data = []
          res.forEach(item => {
            item.alarms.forEach(alarm => {
              alarm.node = item.node
              data.push(alarm)
            })
          })
          this[tableData] = data
          this.loading = false
        })
        .catch(error => {
          this.loading = false
          this.$message.error(error || this.$t('error.networkError'))
        })
    },
    getDuration(duration) {
      return getDateDiff(duration / 1000)
    },
    dateFormat(date) {
      if (typeof date !== 'number' && date === 'infinity') {
        return ''
      }
      return dateformat(date / 1000, 'yyyy-mm-dd HH:MM:ss')
    },
    handleCancelAlarm(row, index, self) {
      const body = {
        node: row.node,
        name: row.name,
      }
      this.$httpPost('/alarms/deactivated', body)
        .then(() => {
          self.$refs[`popover-${index}`].doClose()
          this.loadData()
        })
        .catch(error => {
          this.$message.error(error || this.$t('error.networkError'))
        })
    },
    handleClearAll() {
      this.$confirm(this.$t('analysis.confirmClear'), this.$t('oper.warning'), {
        confirmButtonClass: 'confirm-btn',
        cancelButtonClass: 'cache-btn el-button--text',
        type: 'warning',
      })
        .then(() => {
          this.$httpDelete('/alarms/deactivated')
            .then(() => {
              this.loadData()
            })
            .catch(error => {
              this.$message.error(error || this.$t('error.networkError'))
            })
        })
        .catch(() => {})
    },
  },
  created() {
    this.loadData()
  },
}
</script>

<style lang="scss">
.alarms-view {
  .table-title {
    margin: 24px 0 20px 0;
    font-size: 16px;
    .table-oper {
      float: right;
    }
  }
  .el-table {
    margin-bottom: 32px;
  }
  .details {
    margin-right: 5px;
    color: #a7a7a7;
    cursor: pointer;
  }
}
</style>
