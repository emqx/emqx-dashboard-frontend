<template>
  <div class="rules-view">
    <div class="rules-page">
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
          @click="handleOperation"
        >
          {{ $t('rule.create') }}
        </el-button>
      </div>

      <!-- Fuzzy search card -->
      <el-card class="el-card--self card-search">
        <el-form
          ref="filterParams"
          :model="filterParams"
          label-position="left"
          label-width="90px"
          @keyup.enter.native="searchData"
        >
          <el-row :gutter="32">
            <el-col :span="6">
              <el-form-item :label="$t('rule.id')">
                <el-input type="text" size="small" v-model="filterParams._like_id" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('rule.topic')">
                <div class="like-input">
                  <el-select class="select-topic-type" size="small" v-model="keyForSearchTopic" @hover.prevent.native>
                    <el-option
                      v-for="{ label, value } in KEYS_FOR_SEARCH_TOPIC"
                      :key="value"
                      :label="label"
                      :value="value"
                    />
                  </el-select>
                  <el-input type="text" size="small" v-model="filterParams[keyForSearchTopic]" />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('rule.viewStates')">
                <el-select v-model="filterParams.enabled" size="small" clearable>
                  <el-option :label="$t('rule.ruleEnabled')" :value="true" />
                  <el-option :label="$t('rule.ruleDisabled')" :value="false" />
                </el-select>
              </el-form-item>
            </el-col>
            <template v-if="showMoreQuery">
              <el-col :span="6">
                <el-form-item :label="$t('rule.description')">
                  <el-input type="text" size="small" v-model="filterParams._like_description" />
                </el-form-item>
              </el-col>
            </template>

            <div class="col-oper">
              <el-button size="small" type="primary" plain @click="searchData">
                {{ $t('oper.search') }}
              </el-button>
              <el-button
                size="small"
                plain
                @click="
                  resetFilterParams()
                  loadData()
                "
              >
                {{ $t('oper.reset') }}
              </el-button>
              <a href="javascript:;" class="show-more" @click="showMoreQuery = !showMoreQuery">
                {{ showMoreQuery ? $t('oper.collapse') : $t('oper.expand') }}
                <i :class="showMoreQuery ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </a>
            </div>
          </el-row>
        </el-form>
      </el-card>

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
          :formatter="getMatchedCount"
        />

        <el-table-column :label="$t('rule.viewStates')">
          <template slot-scope="props">
            <el-tooltip
              :content="props.row.enabled ? $t('rule.ruleEnabled') : $t('rule.ruleDisabled')"
              placement="left"
            >
              <el-switch
                v-model="props.row.enabled"
                active-text=""
                inactive-text=""
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="updateRule(props.row)"
              >
              </el-switch>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column :label="$t('rule.oper')" min-width="120px">
          <template slot-scope="{ row }">
            <el-button type="success" size="mini" plain @click="editRule(row)">
              {{ $t('rule.edit') }}
            </el-button>
            <el-button size="mini" plain @click="copyRule(row)">
              {{ $t('rule.duplicate') }}
            </el-button>
            <el-button size="mini" type="danger" plain @click="handleDelete(row)">
              {{ $t('rule.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="center-align">
        <el-pagination
          hide-on-single-page
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[10, 50, 100, 300, 500]"
          :current-page.sync="pageParams._page"
          :page-size="pageParams._limit"
          :total="rulesCount"
          @size-change="handleSizeChanged"
          @current-change="loadData()"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog :title="$t('rule.rule_details')" :visible.sync="dialogVisible" @close="closeDialog">
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
              {{ $t('rule.rule_matched_1') }}: <span>{{ rule.metrics.matched }}</span> {{ $t('rule.match_unit') }}
            </span>
            <span size="mini" type="info">
              {{ $t('rule.speed_current') }}: <span>{{ rule.metrics.speed }}</span> {{ $t('rule.speed_unit') }}
            </span>
            <span size="mini" type="info">
              {{ $t('rule.speed_max_1') }}: <span>{{ rule.metrics.speed_max }}</span> {{ $t('rule.speed_unit') }}
            </span>
            <span size="mini" type="info">
              {{ $t('rule.speed_last5m_1') }}: <span>{{ rule.metrics.speed_last5m }}</span> {{ $t('rule.speed_unit') }}
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
            <rule-actions in-dialog :record="rule" :operations="[]"> </rule-actions>
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

const createRawFilterParams = () => ({
  _like_id: undefined,

  _like_for: undefined,
  _match_for: undefined,

  enabled: undefined,
  _like_description: undefined,
})

const KEYS_FOR_SEARCH_TOPIC = [
  { value: '_like_for', label: 'Topic' },
  { value: '_match_for', label: 'Wildcard' },
]

export default {
  name: 'rules-view',

  components: { RuleActions },

  data() {
    return {
      KEYS_FOR_SEARCH_TOPIC,
      ruleDialogLoading: false,
      timer: 0,
      rule: {
        for: [],
        metrics: {},
      },
      dialogVisible: false,
      tableData: [],
      pageParams: {
        _limit: 10,
        _page: 1,
      },
      rulesCount: 0,
      showMoreQuery: false,
      filterParams: createRawFilterParams(),
      keyForSearchTopic: KEYS_FOR_SEARCH_TOPIC[0].value,
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
      const data = ((await this.$httpGet(`/rules/${row.id}`)) || {}).data || {}
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
    editRule(row) {
      this.$router.push(`/rules/create?rule=${row.id}`)
    },
    copyRule({ id }) {
      this.$router.push({ name: 'ruleCreate', query: { command: 'copy', rule: id } })
    },
    loadDetails(id) {
      this.ruleDialogLoading = true
      this.$httpGet(`/rules/${id}`)
        .then((res) => {
          const { data } = res
          this.rule = data
          setTimeout(() => {
            this.ruleDialogLoading = false
          }, 500)
        })
        .catch(() => {
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
      })
        .then(() => {
          this.$httpDelete(`/rules/${row.id}`).then(() => {
            this.$message.success(this.$t('rule.delete_success'))
            this.loadData()
          })
        })
        .catch()
    },
    handleOperation() {
      this.$router.push('/rules/create')
    },
    getFilterParams() {
      const { _like_for, _match_for, ...filterParams } = this.filterParams
      const ret = Object.keys(filterParams).reduce((obj, currentKey) => {
        const currentVal = this.filterParams[currentKey]
        if (currentVal !== undefined && currentVal !== '') {
          return { ...obj, [currentKey]: currentVal }
        }
        return obj
      }, {})
      if (this.filterParams[this.keyForSearchTopic]) {
        ret[this.keyForSearchTopic] = this.filterParams[this.keyForSearchTopic]
      }
      return ret
    },
    loadData() {
      const params = { ...this.pageParams, ...this.getFilterParams() }
      this.$httpGet('/rules', params).then(({ data }) => {
        const { items, meta } = data
        this.tableData = items
        this.rulesCount = meta.count
        const currentRule = this.tableData.find(($) => $.id === this.rule.id)
        if (currentRule) {
          this.rule = currentRule
        }
      })
    },
    resetPageNo() {
      this.pageParams._page = 1
    },
    searchData() {
      this.resetPageNo()
      this.loadData()
    },
    handleSizeChanged(size) {
      this.pageParams._limit = size
      this.resetPageNo()
      this.loadData()
    },
    resetFilterParams() {
      this.filterParams = createRawFilterParams()
      this.resetPageNo()
    },
    updateRule(row) {
      const { id, enabled } = row
      this.$httpPut(`/rules/${id}`, {
        enabled,
      }).then(() => {
        this.$message.success(this.$t('oper.editSuccess'))
      })
    },
  },

  filters: {
    actionsFilter(actions) {
      return actions.map(($) => $.name).join(',  ')
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

  span[type='info'] {
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

  .page-title {
    margin-bottom: 24px;
  }

  .card-search {
    .el-select {
      width: 100%;
    }
    .el-select.el-select--small .el-input__inner {
      height: 32px !important;
    }
    .el-form-item--medium .el-form-item__content {
      height: 32px;
    }
    .el-form-item--medium .el-form-item__label {
      line-height: 32px;
    }
    .el-col {
      line-height: 1;
      margin-bottom: 16px;
      .el-form-item {
        margin-bottom: 0;
      }
    }
    .like-input {
      font-size: 0;
      .el-input__inner {
        position: relative;
        transition: none;
      }
      > .el-select,
      > .el-input {
        vertical-align: top;
        &:hover {
          .el-input__inner {
            z-index: 20;
          }
        }
        .el-input__inner:hover {
          z-index: 20;
        }
      }
      > .el-select {
        width: 42%;
        .el-input__inner {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          background-color: var(--el-fill-color-light);
        }
      }
      > .el-input {
        width: 58%;
        position: relative;
        left: -1px;
        .el-input__inner {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border-left-color: transparent;
        }
      }
    }
  }
  .col-oper {
    float: right;
    position: relative;
    top: 1px;
    .show-more {
      margin: 0px 10px;
      font-size: 12px;
    }
    margin-bottom: 10px;
  }
}
</style>
