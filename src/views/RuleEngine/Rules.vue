<template>
  <div class="rules-view">
    <div class="page-title">
      {{ $t('rule.message_rule') }}
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
      <el-table-column prop="id" :label="$t('rule.id')">
        <template slot-scope="{ row }">
          <span class="btn" @click="viewRule(row)">
            {{ row.id }}
          </span>
        </template>
      </el-table-column>

      <el-table-column prop="for" :label="$t('rule.topic')"></el-table-column>

      <el-table-column prop="rawsql" min-width="150px" label="SQL"></el-table-column>
      <el-table-column prop="actions" :label="$t('rule.actions')">
        <template slot-scope="{ row }">
          <div v-for="(item, i) in row.actions" class="action-item" :key="i">
            {{ item.name }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        prop="metrics.matched"
        min-width="110px"
        :label="$t('rule.rule_matched_1')"
        :formatter="getMatchedCount"></el-table-column>

      <el-table-column :label="$t('rule.oper')" min-width="70px">
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

    <el-dialog
      :title="$t('rule.rule_details')"
      :visible.sync="dialogVisible"
      @close="closeDialog">
      <div class="dialog-preview">
        <div class="option-item">
          <div class="option-title">{{ $t('rule.id') }}</div>
          <div class="option-value">{{ rule.id }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">{{ $t('rule.trigger_events') }}</div>
          <div class="option-value">{{ (rule.for || []).join(',') }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">{{ $t('rule.rule_desc') }}</div>
          <div class="option-value">{{ rule.description }}</div>
        </div>
        <div class="option-item">
          <div class="option-title">SQL</div>
          <div class="option-all">
            <code>
              {{ rule.rawsql }}
            </code>
          </div>
        </div>
        <div class="option-item">
          <div class="option-title">
            {{ $t('rule.metrics') }}
            <i v-show="ruleDialogLoading" class="el-icon-loading"></i>
          </div>
          <div class="option-all">
            <span size="mini" type="info">
                {{$t('rule.rule_matched_1')}}: <span>{{ rule.metrics.matched }}</span> {{$t('rule.match_unit')}}
              </span>
            <span size="mini" type="info">
              {{$t('rule.speed_current')}}: <span>{{ rule.metrics.speed }}</span> {{$t('rule.speed_unit')}}
            </span>
            <span size="mini" type="info">
              {{$t('rule.speed_max_1')}}: <span>{{ rule.metrics.speed_max }}</span> {{$t('rule.speed_unit')}}
            </span>
            <span size="mini" type="info">
              {{$t('rule.speed_last5m_1')}}: <span>{{ rule.metrics.speed_last5m }}</span> {{$t('rule.speed_unit')}}
            </span>
          </div>
        </div>
        <el-table-column prop="description" :label="$t('rule.description')"></el-table-column>
        <div class="option-item">
          <div class="option-title">
            {{ $t('rule.actions') }}
            <i v-show="ruleDialogLoading" class="el-icon-loading"></i>
          </div>
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
  </div>
</template>


<script>
import RuleActions from '~/views/RuleEngine/components/RuleActions'

export default {
  name: 'rules-view',

  components: { RuleActions },

  props: {},

  data() {
    return {
      ruleDialogLoading: false,
      timer: 0,
      rule: {
        for: [],
        metrics: {},
      },
      dialogVisible: false,
      tableData: [],
    }
  },

  methods: {
    getMatchedCount(row = {}) {
      const { metrics = [] } = row
      let sum = 0
      metrics.forEach(({ matched }) => {
        sum += matched
      })
      return sum
    },
    getHitRate({ matched = 0, nomatch = 0 }) {
      const rate = (matched / (matched + nomatch)) * 100
      console.log(rate)
      if (rate.toString().split('.')[1] && rate.toString().split('.')[1].length > 2) {
        return rate.toFixed(2)
      }
      return rate
    },
    async viewRule(row) {
      if (row.id) {
        this.$router.push(`/rules/${row.id}`)
        return
      }
      const data = (await this.$httpGet(`/rules/${row.id}`) || {}).data || {}
      if (!data) {
        this.rule = row
      } else {
        this.rule = data
      }
      this.dialogVisible = true
      // start refresh
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.viewRule(row)
      }, 10 * 1000)
    },
    loadDetails(id) {
      this.ruleDialogLoading = true
      this.$httpGet(`/rules/${id}`).then((res) => {
        const { data } = res
        this.rule = data
        setTimeout(() => {
          this.ruleDialogLoading = false
        }, 500)
      }).catch(() => {
        this.ruleDialogLoading = false
      })
    },
    closeDialog() {
      clearInterval(this.timer)
      this.loadData()
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
      this.$router.push('/rules/create')
    },
    loadData() {
      this.$httpGet('/rules').then((response) => {
        this.tableData = response.data
        const currentRule = this.tableData.find($ => $.id === this.rule.id)
        if (currentRule) {
          this.rule = currentRule
        }
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
    clearInterval(this.timer)
  },

  beforeRouteLeave(from, to, next) {
    clearInterval(this.timer)
    next()
  },
}
</script>


<style lang="scss">
.rules-view {
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

  span[type="info"] {
    /*color: #101010;*/
    padding-right: 20px;

    & > span {
      margin-left: 6px;
      color: #333;
      font-weight: 600;
      border-bottom: 1px dashed #d8d8d8;

      &:hover {
        font-weight: 800;
      }
    }
  }
}
</style>
