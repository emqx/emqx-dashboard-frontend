<template>
  <div class="auth-username-table">
    <el-row :gutter="20">
      <el-form ref="record" :model="record" :rules="rules" @keyup.enter.native="save">
        <el-col :span="6">
          <el-form-item prop="username">
            <el-input v-model="record.username" placeholder="Username" class="input-radius">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item prop="password">
            <el-input
              v-model="record.password"
              type="password"
              placeholder="Password"
              auto-complete="new-password"
              class="input-radius">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button
            class="add"
            round
            plain
            type="success"
            icon="el-icon-plus"
            size="medium"
            @click="save">
            {{ $t('oper.add') }}
          </el-button>
        </el-col>
      </el-form>
    </el-row>

    <el-table border :data="tableData">
      <el-table-column prop="username" label="Username"></el-table-column>
      <el-table-column width="120px" :label="$t('oper.oper')">
        <template slot-scope="{ row, $index, _self }">
          <el-button
            size="mini"
            type="success"
            plain
            @click="showEdit(row)">
            {{ $t('oper.edit') }}
          </el-button>
          <el-popover
            :ref="`popover-${$index}`"
            placement="right"
            trigger="click">
            <p>{{ $t('oper.confirmDelete') }}</p>
            <div style="text-align: right">
              <el-button
                size="mini"
                type="text"
                class="cache-btn"
                @click="_self.$refs[`popover-${$index}`].doClose()">
                {{ $t('oper.cancel') }}
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleDelete(row, $index, _self)">
                {{ $t('oper.confirm') }}
              </el-button>
            </div>
            <el-button
              slot="reference"
              size="mini"
              type="danger"
              plain>
              {{ $t('oper.delete') }}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :visible.sync="editVisible"
      width="400px"
      :title="$t('oper.edit')"
      @keyup.enter.native="handleEdit">
      <el-form
        class="el-form--public app-info"
        ref="editRecord"
        size="medium"
        :rules="rules"
        :model="editRecord">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="username" label="Username">
              <el-input v-model="editRecord.username" disabled type="username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="password" label="Password">
              <el-input v-model="editRecord.password" type="password"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer">
        <el-button
          type="text"
          class="cache-btn"
          @click="editVisible = false">
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button
          type="success"
          class="confirm-btn"
          :loading="$store.state.loading"
          :disabled="$store.state.loading"
          @click="handleEdit">
          {{ $t('oper.save')   }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import {
  Dialog, Input, Button, Table, TableColumn, Form, FormItem, Row, Col,
} from 'element-ui'

export default {
  name: 'auth-username-table',
  components: {
    'el-dialog': Dialog,
    'el-input': Input,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-row': Row,
    'el-col': Col,
  },
  data() {
    return {
      editVisible: false,
      tableData: [],
      record: {},
      rules: {
        username: { required: true, message: this.$t('plugins.usernameRequired') },
        password: { required: true, message: this.$t('plugins.passwordRequired') },
      },
      editRecord: {},
    }
  },
  methods: {
    loadData() {
      this.$httpGet('/auth_username').then((response) => {
        this.tableData = response.data.map(item => ({
          username: item,
        }))
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    save() {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        const data = { ...this.record }
        this.$httpPost('/auth_username', data).then(() => {
          this.loadData()
          this.$message.success(this.$t('success.createSuccess'))
          this.record = {}
          this.$refs.record.resetFields()
        }).catch((error) => {
          this.$message.error(error || this.$t('error.networkError'))
        })
      })
    },
    handleDelete(row, index, self) {
      this.$httpDelete(`/auth_username/${row.username}`).then(() => {
        this.loadData()
        // Close popover
        self.$refs[`popover-${index}`].doClose()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    showEdit(row) {
      this.editVisible = true
      this.$httpGet(`/auth_username/${row.username}`).then((response) => {
        this.editRecord = response.data
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    handleEdit() {
      this.$refs.editRecord.validate((valid) => {
        if (!valid) {
          return
        }
        const data = {
          password: this.editRecord.password,
        }
        this.$httpPut(`/auth_username/${this.editRecord.username}`, data).then(() => {
          this.loadData()
          this.$message.success(this.$t('oper.editSuccess'))
          this.editRecord = {}
          this.editVisible = false
          this.$refs.editRecord.resetFields()
        }).catch((error) => {
          this.$message.error(error || this.$t('error.networkError'))
        })
      })
    },
  },
  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
.auth-username-table {
  .el-form-item__error {
    display: none;
  }
}
</style>
