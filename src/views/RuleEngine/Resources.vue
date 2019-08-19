<template>
  <div class="resources-view">
    <div class="page-title">
      {{ $t('rule.resource_title') }}
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
        {{ $t('rule.create') }}
      </el-button>
    </div>

    <!-- resource list -->
    <el-table border :data="tableData" @expand-change="handExpand">

      <el-table-column prop="id" type="expand" class-name="expand-column" width="1px">
        <template slot-scope="{ row }">
          <ul class="status-wrapper">
            <li v-for="(item, i) in row.status || []" :key="i" class="status-item">
              <span class="key">
                {{ item.node }}
              </span>

              <span :class="[item.is_alive ? 'running' : 'stopped danger', 'status']">
                  {{ item.is_alive ? $t('rule.enabled') : $t('rule.disabled') }}
              </span>

              <el-button
                v-if="!item.is_alive"
                :loading="reloadLoading && currentResource === row.id"
                plain
                type="success"
                size="mini"
                @click="handleReconnect(row, i)">
                {{ $t('rule.reconnect') }}
              </el-button>

            </li>
          </ul>
        </template>
      </el-table-column>

      <!-- resource name -->
      <el-table-column prop="id" :label="$t('rule.id')">
        <template slot-scope="{ row }">
           <span class="" @click="viewResource(row)">
            {{ row.id }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="type" :label="$t('rule.resource_type')"></el-table-column>


      <el-table-column prop="description" :label="$t('rule.description')"></el-table-column>


      <!--<el-table-column prop="status" :label="$t('rule.running_statue')">-->
      <!--<template slot-scope="{ row }">-->
      <!--<span :class="[row.status.is_alive ? 'running' : 'stopped', 'status']">-->
      <!--{{ row.status.is_alive ? $t('rule.enabled') : $t('rule.disabled') }}-->
      <!--</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column :label="$t('rule.oper')">
        <template slot-scope="{ row, $index }">
          <!--<el-button-->
          <!--v-if="!row.status.is_alive"-->
          <!--:loading="reloadLoading && currentResource === row.id"-->
          <!--plain-->
          <!--type="success"-->
          <!--size="mini"-->
          <!--@click="handleReconnect(row)">-->
          <!--{{ $t('rule.reconnect') }}-->
          <!--</el-button>-->

          <el-button
            plain
            type="success"
            size="mini"
            @click="viewResource(row)">
            {{ $t('rule.view') }}
          </el-button>
          <el-button
            plain
            size="mini"
            type="warning"
            @click="handleDelete(row)">
            {{ $t('rule.delete') }}
          </el-button>
          <el-button
            plain
            type="success"
            size="mini"
            @click="viewRunningStatus(row, $index)">
            {{ $t('rule.viewStates') }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <resource-dialog
      ref="resourceDialog"
      :visible.sync="dialogVisible"
      @confirm="loadData">
    </resource-dialog>

    <el-dialog :title="$t('rule.resource_details')" :visible.sync="viewDialogVisible">
      <div class="dialog-preview">
        <div class="option-item">
          <div class="option-title">
            {{ $t('rule.id') }}
          </div>
          <div class="option-value">{{ res.id }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">
            {{ $t('rule.resource_type') }}
          </div>
          <div class="option-value">{{ res.type }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">
            {{ $t('rule.description') }}
          </div>
          <div class="option-value">{{ res.description }}</div>
        </div>

        <!-- 这里是参数 -->
        <div
          v-if="res.config && Object.keys(res.config).length > 0"
          class="option-item">
          <div class="option-title">
            {{ $t('rule.config_info') }}
          </div>
          <div class="option-all">

            <div
              v-for="(item, index) in Object.entries(res.config)"
              class="option-item"
              :key="index">
              <template v-if="typeof item[1] !== 'object' || Array.isArray(item[1])">
                <div class="option-title">
                  {{ item[0] }}
                </div>
                <div class="option-value">
                  {{ item[1] }}
                </div>
              </template>
              <template v-else>
                <div class="option-title">
                  {{ item[0] }}
                </div>
                <div class="option-value">
                  <span v-if="!item[1] || Object.keys(item[1]).length === 0">
                    N/A
                  </span>
                  <data-table
                    v-else
                    v-model="item[1]"
                    disabled
                    style="margin-top: 0">
                  </data-table>
                </div>
              </template>
            </div>

          </div>
        </div>

      </div>

      <div slot="footer">
        <el-button class="confirm-btn" type="success" @click="viewDialogVisible = false">
          {{ $t('rule.confirm') }}
        </el-button>
      </div>
    </el-dialog>

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
      viewDialogVisible: false,
      tableData: [],
      res: {},
      reloadLoading: false,
      currentResource: '',
    }
  },

  methods: {
    viewRunningStatus(row, index) {
      const el = document.querySelectorAll('.el-table__expand-icon')[index]
      if (el && el.click) {
        el.click()
      }
    },
    handleReconnect(row, i) {
      this.reloadLoading = true
      this.currentResource = row.id
      this.$httpPost(`/resources/${row.id}`).then(() => {
        setTimeout(() => {
          // this.loadData()
          this.reloadLoading = false
          this.$message.success(this.$t('rule.connectSuccess'))
          try {
            row.status[i].is_alive = true
          } catch (e) {
            console.log(e)
          }
        }, 300)
      }).catch(() => {
        this.reloadLoading = false
      })
    },
    handleDelete(row) {
      this.$confirm(this.$t('rule.confirm_stop_delete'), 'Notice', {
        confirmButtonClass: 'confirm-btn',
        confirmButtonText: this.$t('oper.confirm'),
        cancelButtonClass: 'cache-btn el-button--text',
        cancelButtonText: this.$t('oper.cancel'),
        type: 'warning',
      }).then(() => {
        this.$httpDelete(`/resources/${row.id}`).then(() => {
          this.$message.success(this.$t('rule.delete_success'))
          this.loadData()
        })
      }).catch()
    },
    viewResource(row) {
      this.res = { ...row }
      this.viewDialogVisible = true
    },
    handleOperation() {
      this.dialogVisible = true
    },
    loadData() {
      this.$httpGet('/resources').then((response) => {
        const data = response.data
        this.tableData = data.map(($) => {
          $.status = $.status || []
          return $
        })
      })
    },
    handExpand(row) {
      if (row.status && row.status.length > 0) {
        return
      }
      this.$httpGet(`/resources/${row.id}`).then((res) => {
        this.$set(row, 'status', res.data.status)
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

  .status-wrapper {
    padding: 0;
    list-style-type: none;

    .status-item {
      padding: 2px 6px;

      & > span {
        margin-right: 12px;
      }
    }
  }

  .el-form-item__content {
    clear: both;
  }

  .expand-column {
    /*display: none;*/
    /*width: 0 !important;*/
    /*opacity: 0;*/
    .cell {
      opacity: 0;
    }
  }
}
</style>
