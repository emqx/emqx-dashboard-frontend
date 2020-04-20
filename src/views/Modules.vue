<template>
  <div class="modules-view">
    <!-- modules list -->
    <div class="page-title">
      {{ $t('leftbar.modules') }}
      <div style="float: right">
        <el-select
          v-model="nodeName"
          class="select-radius"
          :placeholder="$t('select.placeholder')"
          :disabled="$store.state.loading"
          @change="loadModuls">
          <el-option
            v-for="node in nodes"
            :key="node.node"
            :label="node.node"
            :value="node.node">
          </el-option>
        </el-select>
      </div>
    </div>

    <el-table
      v-loading="$store.state.loading"
      border
      :data="enableTableData"
      @filter-change="resetFilter">
      <el-table-column prop="name" width="250" :label="$t('modules.name')">
      </el-table-column>
      <el-table-column prop="description" min-width="350" :label="$t('plugins.description')">
      </el-table-column>
      <el-table-column
        prop="active"
        width="150"
        :label="$t('plugins.status')"
        :filters="[{ text: $t('modules.disabled'), value: false }, { text: $t('modules.enabled'), value: true }]">
        <template slot-scope="props">
          <span :class="[props.row.active ? 'running' : '', 'status']">
            {{ props.row.active ? $t('modules.enabled'): $t('modules.disabled')}}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="160" :label="$t('oper.oper')">
        <template slot-scope="props">
          <el-button
            slot="reference"
            class="oper"
            size="mini"
            :type="props.row.active ? 'warning' : 'success'"
            @click="update(props.row)" :plain="true">
            {{ props.row.active ? $t('modules.disable') : $t('modules.enable') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
import {
  Select, Option, Button, Table, TableColumn,
} from 'element-ui'
import { mapActions } from 'vuex'

export default {
  name: 'modules-view',
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
  },
  data() {
    return {
      filterSet: new Set(),
      tableData: [],
      enableTableData: [],
      nodeName: '',
      nodes: [],
    }
  },
  methods: {
    ...mapActions(['CURRENT_NODE']),
    loadData() {
      this.$httpGet('/nodes').then((response) => {
        this.nodeName = this.$store.state.nodeName || response.data[0].node
        this.nodes = response.data
        this.loadModuls()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    loadModuls() {
      this.CURRENT_NODE(this.nodeName)
      if (!this.nodeName) {
        return
      }
      this.$httpGet(`/nodes/${this.nodeName}/modules`).then((response) => {
        this.tableData = response.data
        this.handleFilter()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    handleFilter() {
      // No need to initialize Set
      this.enableTableData = this.tableData.filter(item => !this.filterSet.has(item.active))
    },
    resetFilter(e) {
      this.filterSet.clear()
      Object.keys(e).forEach((item) => {
        e[item].forEach((active) => {
          this.filterSet.add(!active)
        })
      })
      if (this.filterSet.size === 2) {
        this.filterSet.clear()
      }
      this.handleFilter()
    },
    update(row) {
      const operation = row.active ? 'unload' : 'load'
      this.$httpPut(`/modules/${row.name}/${operation}`).then(() => {
        this.$message.success(
          `${row.active ? this.$t('oper.disabledSuccess') : this.$t('oper.enableSuccess')}`,
        )
        this.loadModuls()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
        this.loadModuls()
      })
    },
  },
  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
.modules-view {
  .el-table {
    margin-top: 24px;
  }
  .oper {
    min-width: 50px;
    font-size: 14px;
    margin-bottom: 4px;
  }
}
</style>
