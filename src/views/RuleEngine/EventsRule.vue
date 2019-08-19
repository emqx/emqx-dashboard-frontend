<template>
  <div class="events-rules-view">
    <div class="page-title">
      {{ $t('rule.events_rule') }}
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

    <!-- rules list -->
    <el-table v-loading="$store.state.loading" border :data="tableData">

      <!-- rule name -->
      <el-table-column prop="name" :label="$t('rule.rule_name')"></el-table-column>

      <!-- action -->
      <el-table-column prop="actions" :label="$t('rule.actions')">
        <template slot-scope="{ row }">
          <div v-for="(item, i) in row.actions" class="action-item" :key="i">
            {{ item.name }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="description" :label="$t('rule.description')"></el-table-column>

      <el-table-column :label="$t('rule.oper')">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            size="mini"
            plain
            @click="viewRule(row)">
            {{ $t('rule.view') }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            plain
            @click="handleDelete(row)">
            {{ $t('rule.delete') }}
          </el-button>
        </template>
      </el-table-column>

    </el-table>


    <el-dialog :title="$t('rule.rule_details')" :visible.sync="dialogVisible">
      <div class="dialog-preview">
        <div class="option-item">
          <div class="option-title">{{ $t('rule.rule_name') }}</div>
          <div class="option-value">{{ rule.name }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">{{ $t('rule.rule_desc') }}</div>
          <div class="option-value">{{ rule.description }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">{{ $t('rule.actions') }}</div>
          <div class="option-all">
            <rule-actions
              in-dialog
              :record="rule"
              :operations="[]">
            </rule-actions>
          </div>
        </div>
      </div>

      <div slot="footer">
        <el-button class="confirm-btn" type="success" @click="dialogVisible = false">
          {{ $t('rule.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      width="700px"
      :title="$t('rule.create_rule')"
      :visible.sync="createDialogVisible"
      @close="close"
      @open="open">
      <el-form
        class="el-form--public"
        ref="record"
        :model="record"
        :rules="rules">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="name" :label="$t('rule.name')">
              <el-input v-model="record.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="for" :label="$t('rule.events_type')">
              <emq-select
                v-model="record.for"
                class="el-select--public"
                style="width: 100%"
                popper-class="el-select--public"
                :field="forField">
              </emq-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="description" :label="$t('rule.description')">
              <el-input v-model="record.description"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="actions" :label="$t('rule.actions')">
              <rule-actions
                in-dialog
                :params="{ for: '$events' }"
                :operations="['create', 'delete']"
                :record="record"
              >
              </rule-actions>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer">
        <el-button class="cache-btn" type="text" @click="createDialogVisible = false">
          {{ $t('rule.cancel') }}
        </el-button>
        <el-button class="confirm-btn" type="success" @click="handleCreate">
          {{ $t('rule.create') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import RuleActions from './components/RuleActions'

export default {
  name: 'events-rules-view',

  components: { RuleActions },

  props: {},

  data() {
    return {
      createDialogVisible: false,
      rule: {},
      dialogVisible: false,
      tableData: [],
      forField: {
        options: [
          'client.connected',
          'client.disconnected',
          'client.subscribe',
          'client.unsubscribe',
          'session.created',
          'session.resumed',
          'session.subscribed',
          'session.unsubscribe',
          'session.terminated',
          'message.deliver',
          'message.acked',
          'message.dropped',
        ].map($ => ({ label: $, value: $ })),
      },
      record: {
        name: '',
        for: '',
        actions: [],
      },
      rules: {
        name: { required: true },
        for: { required: true },
        actions: [],
      },
    }
  },

  methods: {
    async open() {
      // 时间的 action
    },
    close() {
      this.$refs.record.resetFields()
    },
    viewRule(row) {
      this.rule = row
      this.dialogVisible = true
    },
    handleCreate() {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        const data = { ...this.record, rawsql: 'select * from "#"' }
        if (!data.actions || data.actions.length === 0) {
          this.$message.error(this.$t('rule.actions_required'))
          return
        }
        this.$httpPost('/rules', data).then(() => {
          this.$message.success(this.$t('rule.create_success'))
          this.loadData()
          this.createDialogVisible = false
        })
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
        this.$httpDelete(`/rules/${row.id}`).then(() => {
          this.$message.success(this.$t('rule.delete_success'))
          this.loadData()
        })
      }).catch()
    },
    handleOperation() {
      this.createDialogVisible = true
    },
    loadData() {
      this.$httpGet('/rules').then((response) => {
        this.tableData = response.data.filter($ => $.for !== 'message.publish')
      })
    },
  },

  filters: {
    actionsFilter(actions) {
      return actions.map($ => $.name).join(',  ')
    },
  },

  created() {
    this.loadData()
  },
}
</script>


<style lang="scss">
.events-rules-view {
  .el-table {
    margin-top: 24px;
  }

  .el-form--public {
    .el-button {
      &.is-plain {
        color: #42d885 !important;
        background: #ecfbf3 !important;;
        border-color: #b3efce !important;;
      }
    }
  }
}
</style>
