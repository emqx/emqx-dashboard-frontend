<template>
  <div class="listeners-view">
    <div class="page-title">
      {{ $t('leftbar.listeners') }}
      <el-select
        v-model="nodeName"
        class="select-radius"
        :placeholder="$t('select.placeholder')"
        :disabled="$store.state.loading"
        @change="loadListeners"
      >
        <el-option v-for="node in nodes" :key="node.node" :label="node.node" :value="node.node"> </el-option>
      </el-select>
    </div>
    <el-table v-loading="$store.state.loading" border :data="listeners">
      <el-table-column prop="protocol" width="240" :label="$t('listeners.protocol')"> </el-table-column>
      <el-table-column prop="listen_on" min-width="240" :label="$t('listeners.listenOn')"> </el-table-column>
      <el-table-column prop="max_conns" min-width="180" :label="$t('listeners.maxConnections')"> </el-table-column>
      <el-table-column prop="current_conns" min-width="120" :label="$t('listeners.currentConnections')">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Select, Option, Table, TableColumn } from 'element-ui'

export default {
  name: 'listeners-view',
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-table': Table,
    'el-table-column': TableColumn,
  },
  data() {
    return {
      nodeName: '',
      nodes: [],
      listeners: [],
    }
  },
  methods: {
    ...mapActions(['CURRENT_NODE']),
    loadData() {
      this.$httpGet('/nodes')
        .then(response => {
          this.nodeName = this.$store.state.nodeName || response.data[0].node
          this.nodes = response.data
          this.loadListeners()
        })
        .catch(error => {
          this.$message.error(error || this.$t('error.networkError'))
        })
    },
    loadListeners() {
      this.CURRENT_NODE(this.nodeName)
      this.$httpGet(`/nodes/${this.nodeName}/listeners`)
        .then(response => {
          this.listeners = response.data
        })
        .catch(error => {
          this.$message.error(error || this.$t('error.networkError'))
        })
    },
  },
  created() {
    this.loadData()
  },
}
</script>

<style lang="scss">
.listeners-view {
  .el-table {
    margin-top: 24px;
  }
}
</style>
