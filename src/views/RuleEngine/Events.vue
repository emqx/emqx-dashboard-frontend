<template>
  <div class="resources-view">
    <div class="page-title">
      事件规则
      <el-button
        class="confirm-btn"
        round
        plain
        type="success"
        icon="el-icon-plus"
        size="medium"
        style="float: right"
        :disable="$store.state.loading"
        @click="handleOperation">
        新建
      </el-button>
    </div>

    <!-- rules list -->
    <el-table border :data="tableData">

      <!-- rule name -->
      <el-table-column prop="name" label="资源名称"></el-table-column>

      <el-table-column prop="type" label="资源类型"></el-table-column>

      <el-table-column prop="description" label="描述"></el-table-column>

      <el-table-column label="操作">
        <template slor-scope="{ row }">
          <el-button
            type="success"
            size="mini"
            :plain="true">
            查看
          </el-button>
          <el-button
            size="mini"
            type="warning">
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <resource-dialog :visible.sync="dialogVisible"></resource-dialog>
  </div>
</template>


<script>
import ResourceDialog from './components/ResourceDialog'

export default {
  name: 'resources-view',

  components: { ResourceDialog },

  props: {},

  data() {
    return {
      dialogVisible: false,
      tableData: [],
    }
  },

  methods: {
    viewResource(row) {
    },
    handleOperation() {
      this.dialogVisible = true
    },
    loadData() {
      this.$httpGet('/resources').then((response) => {
        this.tableData = response.data
      })
    },
  },

  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
.resources-view {
  .el-table {
    margin-top: 24px;
  }
}
</style>
