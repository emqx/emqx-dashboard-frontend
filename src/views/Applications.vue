<template>
  <div class="applications-view">
    <div class="page-title">
      {{ $t('leftbar.applications') }}
      <el-button
        class="confirm-btn"
        round
        plain
        type="success"
        icon="el-icon-plus"
        size="medium"
        style="float: right;"
        :disable="$store.state.loading"
        @click="handleOperation"
      >
        {{ $t('app.newApp') }}
      </el-button>
    </div>
    <!-- applications list -->
    <el-table v-loading="$store.state.loading" border :data="tableData">
      <el-table-column prop="app_id" min-width="90px" :label="$t('app.appId')"></el-table-column>
      <el-table-column prop="name" min-width="100px" :label="$t('app.name')"></el-table-column>
      <el-table-column prop="expired" min-width="120px" :label="$t('app.expired')">
        <template slot-scope="props">
          {{ dateFormat(props.row.expired) }}
        </template>
      </el-table-column>
      <el-table-column prop="desc" min-width="90px" :label="$t('app.desc')"></el-table-column>
      <el-table-column :label="$t('app.status')">
        <template slot-scope="props">
          <el-tooltip :content="props.row.status ? $t('app.enableText') : $t('app.disableText')" placement="left">
            <el-switch
              v-model="props.row.status"
              active-text=""
              inactive-text=""
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="updateApp(true, props.row)"
            >
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column width="180px" :label="$t('oper.oper')">
        <template slot-scope="props">
          <!-- view -->
          <el-button type="success" size="mini" plain @click="showApp(props.row)">
            {{ $t('oper.view') }}
          </el-button>

          <!-- edit -->
          <el-button type="success" size="mini" plain @click="handleOperation(false, props.row)">
            {{ $t('oper.edit') }}
          </el-button>

          <!-- delete -->
          <el-popover placement="right" trigger="click" :value="popoverVisible">
            <p>{{ $t('oper.confirmDelete') }}</p>
            <div style="text-align: right;">
              <el-button size="mini" type="text" class="cache-btn" @click="hidePopover">
                {{ $t('oper.cancel') }}
              </el-button>
              <el-button size="mini" type="success" @click="deleteApp(props.row)">
                {{ $t('oper.confirm') }}
              </el-button>
            </div>
            <el-button slot="reference" size="mini" type="danger" plain>
              {{ $t('oper.delete') }}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :width="oper === 'view' ? '660px' : '500px'"
      :visible.sync="displayDialog"
      :title="$t(`app.${oper}App`)"
      @keyup.enter.native="createApp"
    >
      <el-form
        class="el-form--public app-info"
        ref="record"
        size="medium"
        :rules="oper === 'view' ? {} : rules"
        :model="record"
      >
        <el-row :gutter="20">
          <template v-if="oper === 'view'">
            <el-col :span="12">
              <el-form-item prop="app_id" :label="$t('app.appId')">
                <el-input v-model="record.app_id" class="is-disabled" :readonly="true"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('app.secret')">
                <el-input v-model="record.secret" class="is-disabled" :readonly="true"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="name" :label="$t('app.name')">
                <el-input v-model="record.name" class="is-disabled" :readonly="true"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="status" :label="$t('app.status')">
                <el-select
                  v-model="record.status"
                  class="el-select--public"
                  popper-class="el-select--public"
                  :disabled="oper === 'view'"
                >
                  <el-option :label="$t('app.enable')" :value="true"></el-option>
                  <el-option :label="$t('app.disable')" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('app.expired')">
                <el-date-picker
                  v-model="record.expired"
                  :picker-options="pickerDisable"
                  :placeholder="$t('app.expiredText')"
                  :disabled="oper === 'view'"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="desc" :label="$t('app.desc')">
                <el-input v-model="record.desc" class="is-disabled" :readonly="true"></el-input>
              </el-form-item>
            </el-col>
          </template>

          <template v-else>
            <el-col :span="12">
              <el-form-item prop="app_id" :label="$t('app.appId')">
                <el-input v-model="record.app_id" :disabled="['view', 'edit'].includes(oper)"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item v-if="oper === 'view'" :label="$t('app.secret')">
                <el-input v-model="record.secret" disabled></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="name" :label="$t('app.name')">
                <el-input v-model="record.name" :disabled="['view', 'edit'].includes(oper)"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12"></el-col>

            <el-col :span="12">
              <el-form-item prop="status" :label="$t('app.status')">
                <el-select
                  v-model="record.status"
                  class="el-select--public"
                  popper-class="el-select--public"
                  :disabled="oper === 'view'"
                >
                  <el-option :label="$t('app.enable')" :value="true"></el-option>
                  <el-option :label="$t('app.disable')" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$t('app.expired')">
                <el-date-picker
                  v-model="record.expired"
                  :picker-options="pickerDisable"
                  :placeholder="$t('app.expiredText')"
                  :disabled="oper === 'view'"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item prop="desc" :label="$t('app.desc')">
                <el-input v-model="record.desc" :disabled="['view'].includes(oper)"></el-input>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>

      <!-- create & edit footer -->
      <div v-if="oper !== 'view'" slot="footer">
        <el-button type="text" class="cache-btn" @click="displayDialog = false">
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button
          v-if="oper === 'edit'"
          type="success"
          class="confirm-btn"
          :loading="$store.state.loading"
          :disabled="$store.state.loading"
          @click="updateApp(false)"
        >
          {{ $t('oper.save') }}
        </el-button>
        <el-button
          v-if="oper === 'new'"
          type="success"
          class="confirm-btn"
          :loading="$store.state.loading"
          :disabled="$store.state.loading"
          @click="createApp"
        >
          {{ $t('oper.save') }}
        </el-button>
      </div>

      <div v-else slot="footer">
        <div class="guide-doc">
          {{ this.$t('app.guide') }}
          <a
            :href="
              lang === 'zh'
                ? 'https://docs.emqx.cn/cn/broker/latest/advanced/http-api.html'
                : 'https://docs.emqx.io/en/broker/latest/advanced/http-api.html'
            "
            target="_blank"
          >
            {{ $t('app.docs') }}
          </a>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  Dialog,
  Input,
  Switch,
  Select,
  Option,
  Button,
  Form,
  FormItem,
  Table,
  TableColumn,
  DatePicker,
  Popover,
  Tooltip,
  Row,
  Col,
} from 'element-ui'
import dateformat from 'dateformat'

export default {
  name: 'applications-view',
  components: {
    'el-dialog': Dialog,
    'el-input': Input,
    'el-switch': Switch,
    'el-select': Select,
    'el-option': Option,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-date-picker': DatePicker,
    'el-popover': Popover,
    'el-tooltip': Tooltip,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-row': Row,
    'el-col': Col,
  },
  data() {
    return {
      tableData: [],
      displayDialog: false,
      oper: 'new',
      record: {
        app_id: '',
        name: '',
        desc: '',
        secret: '',
        expired: '',
        status: true,
      },
      rules: {
        app_id: [{ required: true, message: this.$t('app.errors') }],
        name: [{ required: true, message: this.$t('app.errors') }],
      },
      popoverVisible: false,
      pickerDisable: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
      lang: window.localStorage.getItem('language') || 'en',
    }
  },
  methods: {
    loadData() {
      this.$httpGet('/apps')
        .then(response => {
          this.tableData = response.data
        })
        .catch(error => {
          this.$message.error(error || this.$t('error.networkError'))
        })
    },
    createApp() {
      this.$refs.record.validate(valid => {
        if (!valid) {
          return
        }
        const record = { ...this.record }
        if (new Date(record.expired).getTime().toString().length === 13) {
          record.expired /= 1000
        } else {
          record.expired = undefined
        }
        this.$httpPost('/apps', record)
          .then(() => {
            this.loadData()
            this.$message.success(this.$t('success.createSuccess'))
            this.displayDialog = false
          })
          .catch(error => {
            this.$message.error(error || this.$t('error.networkError'))
          })
      })
    },
    updateApp(fromTable = false, row) {
      // just update
      if (fromTable) {
        const record = { ...row }
        if (new Date(record.expired).getTime().toString().length === 13) {
          record.expired /= 1000
        } else {
          record.expired = undefined
        }
        this.$httpPut(`/apps/${record.app_id}`, record)
          .then(() => {
            this.$message.success(this.$t('oper.editSuccess'))
            this.loadData()
          })
          .catch(error => {
            this.$message.error(error || this.$t('error.networkError'))
          })
      } else {
        this.$refs.record.validate(valid => {
          if (!valid) {
            return
          }
          const record = { ...this.record }
          if (new Date(record.expired).getTime().toString().length === 13) {
            record.expired /= 1000
          } else {
            record.expired = undefined
          }
          this.$httpPut(`/apps/${record.app_id}`, record)
            .then(() => {
              this.displayDialog = false
              this.$message.success(this.$t('oper.editSuccess'))
              this.loadData()
            })
            .catch(error => {
              this.$message.error(error || this.$t('error.networkError'))
            })
        })
      }
    },
    showApp(row) {
      this.oper = 'view'
      this.$httpGet(`/apps/${row.app_id}`)
        .then(response => {
          this.displayDialog = true
          this.record = response.data
          if (this.record.expired.toString().length === 10) {
            this.record.expired = new Date(this.record.expired * 1000)
          }
          this.displayDialog = true
        })
        .catch(error => {
          this.$message.error(error || this.$t('error.networkError'))
        })
    },
    deleteApp(row) {
      this.$httpDelete(`/apps/${row.app_id}`)
        .then(() => {
          this.loadData()
          this.hidePopover()
        })
        .catch(error => {
          this.$message.error(error || this.$t('error.networkError'))
        })
    },
    handleOperation(create = true, row) {
      this.displayDialog = true
      setTimeout(() => {
        if (create) {
          this.oper = 'new'
          this.record = {
            app_id: Math.random()
              .toString(16)
              .slice(2),
            name: '',
            desc: '',
            secret: '',
            expired: '',
            status: true,
          }
        } else {
          this.oper = 'edit'
          this.record = { ...row }
          this.record.expired =
            this.record.expired && this.record.expired.toString().length === 10
              ? new Date(this.record.expired * 1000)
              : ''
        }
        this.$refs.record.resetFields()
      }, 10)
    },
    hidePopover() {
      this.popoverVisible = true
      setTimeout(() => {
        this.popoverVisible = false
      }, 0)
    },
    dateFormat(date) {
      try {
        return date.toString().length === 10 ? dateformat(date * 1000, 'yyyy-mm-dd') : this.$t('app.expiredText')
      } catch (e) {
        return this.$t('app.expiredText')
      }
    },
  },
  created() {
    this.loadData()
  },
}
</script>

<style lang="scss">
.applications-view {
  .el-select,
  .el-date-editor {
    width: 100%;
  }
  .el-table {
    margin-top: 24px;
  }
  .el-row {
    margin-top: 20px;
  }
  .search-btn {
    margin-left: 8px;
  }
  .el-breadcrumb {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .el-date-picker {
    max-width: 600px !important;
  }
  .el-form-item--medium .el-form-item__content {
    line-height: 38px;
  }
}

.app-info {
  .el-input {
    &.is-disabled {
      .el-input__inner {
        cursor: text;
      }
    }
  }
}
</style>
