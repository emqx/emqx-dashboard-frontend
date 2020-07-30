<template>
  <div class="alarms-view">
    <div class="page-title">
      {{ $t('leftbar.alarms') }}
    </div>
    <!-- alarms list -->
    <el-table v-loading="$store.state.loading" border :data="tableData">
      <el-table-column prop="node" min-width="60px" :label="$t('clients.node')" show-overflow-tooltip></el-table-column>
      <el-table-column prop="name" :label="$t('analysis.alarmName')"></el-table-column>
      <el-table-column prop="message" min-width="140px" :label="$t('analysis.alarmMessage')" show-overflow-tooltip>
        <template slot-scope="{ row }">
          <el-popover
            placement="top"
            trigger="hover"
            width="160"
            :open-delay="500">
            <div v-for="(value, label) in row.details" :key="label">
              {{ label }}: {{ value }}
            </div>
            <span slot="reference" class="details">
              <i class="iconfont icon-bangzhu"></i>
            </span>
          </el-popover>
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>
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
import {
  Table, TableColumn, Popover, Tooltip,
} from 'element-ui'
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
      tableData: [],
      lang: window.localStorage.getItem('language') || 'en',
    }
  },
  methods: {
    loadData() {
      this.$httpGet('/alarms').then((response) => {
        const res = response.data
        const data = []
        res.forEach((item) => {
          item.alarms.forEach((alarm) => {
            alarm.node = item.node
            data.push(alarm)
          })
        })
        this.tableData = data
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    dateFormat(date) {
      if (typeof date !== 'number' && date === 'infinity') {
        return ''
      }
      return dateformat(date / 1000, 'yyyy-mm-dd HH:MM:ss')
    },
  },
  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
.alarms-view {
  .el-table {
    margin-top: 24px;
  }
  .details {
    margin-right: 5px;
    color: #a7a7a7;
    cursor: pointer;
  }
}
</style>
