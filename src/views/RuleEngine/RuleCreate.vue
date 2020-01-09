<template>
  <div class="rule-create">
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/rules' }">
          {{ $t('rule.message_rule') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-name">
          {{ operationName }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card class="el-card--self">
      <el-form
        label-position="right"
        label-width="108px"
        ref="record"
        :model="record"
        :rules="rules">

        <!-- 基本信息 -->
        <div class="form-block--wrapper">
          <div class="form-block__title">
            {{ $t('rule.conditional') }}
            <div class="form-block__title-tips">
              {{ $t('rule.conditional_tips') }}
            </div>
          </div>

          <div class="form-block__body">
            <el-row style="max-width: 1366px">
              <el-col :span="14">
                <el-form-item prop="rawsql" :label="$t('rule.rule_sql')" class="code-sql rawsql">
                  <div class="monaco-container">
                    <monaco
                      id="rule-sql"
                      v-model="record.rawsql"
                      lang="sql"
                      :provider="sqlProvider"
                      @qucik-save="handleTest">
                    </monaco>
                  </div>
                </el-form-item>

                <el-form-item :label="$t('rule.description')">
                  <el-input v-model="record.description" :placeholder="$t('rule.rule_descr_placeholder')">
                  </el-input>
                </el-form-item>

                <!-- sql test -->
                <el-form-item :label="$t('rule.input_test_data')">
                  <el-switch v-model="inTest" inactive-color="#a7a7a7"></el-switch>
                  <el-popover
                    placement="right"
                    width="200"
                    trigger="hover">
                    {{ $t('rule.input_test_data_tips') }}
                    <i tabindex="-1" class="el-icon-question" slot="reference"></i>
                  </el-popover>
                </el-form-item>

                <template v-if="inTest">
                  <el-form-item
                    v-for="k in Object.keys(selectedOption.test_columns)"
                    :class="{ 'code-sql': k === 'payload', 'payload': k === 'payload' }"
                    v-bind="{ label: k, prop: `ctx.${k}` }"
                    :key="k">
                    <el-input
                      v-if="k !== 'payload'"
                      v-model="record.ctx[k]"></el-input>
                    <template v-else>
                      <div class="monaco-container">
                        <monaco
                          id="payload"
                          v-model="record.ctx.payload"
                          :lang="payloadType"
                          @qucik-save="handleTest">
                        </monaco>
                      </div>
                      <div class="payload-type">
                        <el-radio-group v-model="payloadType">
                          <el-radio label="json">JSON</el-radio>
                          <el-radio label="plaintext">RAW</el-radio>
                        </el-radio-group>
                      </div>
                    </template>
                  </el-form-item>

                  <el-form-item>
                    <el-button class="test-btn" type="primary" size="small" @click="handleTest">
                      {{ $t('rule.test') }}
                    </el-button>
                  </el-form-item>

                  <el-form-item :label="$t('rule.test_output')">
                    <el-input
                      v-model="testOutPut"
                      type="textarea"
                      :rows="4"
                      :placeholder="$t('rule.no_test_output')"
                      readonly>
                    </el-input>
                  </el-form-item>
                </template>
              </el-col>

              <el-col class="sql-tips" :span="8" :offset="1">
                <div class="title">
                  {{ $t('rule.rule_sql_tips_title') }}
                </div>
                <el-scrollbar wrap-class="doc-wrapper">
                  <div v-html="$t('rule.sql_tips_html')"></div>
                </el-scrollbar>
              </el-col>
            </el-row>
          </div>

        </div>

        <!-- 触发动作 -->
        <div class="form-block--wrapper" style="clear: both;">
          <div class="form-block__title">
            <span style="color: #ff6d6d">*</span>
            {{ $t('rule.set_action') }}
            <div class="form-block__title-tips">
              {{ $t('rule.actions_tips') }}
            </div>
          </div>

          <div class="form-block__body">
            <el-row style="max-width: 1366px;">
              <el-col :span="23">
                <rule-actions
                  :operations="['create', 'delete']"
                  :record="record">
                </rule-actions>
              </el-col>
            </el-row>
          </div>
        </div>

      </el-form>

      <div>
        <el-button
          class="confirm-btn"
          type="success"
          @click="handleCreate">
          {{ $t('rule.create') }}
        </el-button>
        <el-button
          class="cache-btn"
          type="text"
          @click="handleCancel">
          {{ $t('rule.cancel') }}
        </el-button>
      </div>
    </el-card>
  </div>
</template>


<script>
import sqlFormatter from 'sql-formatter'
import EmqSelect from '~/components/EmqSelect'
import { loadRuleEvents } from '~/api/rule'
import { ruleEngineProvider } from '~/common/provider'
import { ruleNewSqlParser, ruleOldSqlCheck } from '~/common/utils'

import Monaco from '~/components/Monaco'
import RuleActions from './components/RuleActions'

export default {
  name: 'rule-create',

  components: {
    EmqSelect,
    Monaco,
    RuleActions,
  },

  props: {},

  data() {
    return {
      payloadType: 'json',
      eventsList: [],
      testOutPut: '',
      inTest: false,
      id: this.$route.params.id,
      eventOptions: [],
      sqlPrimaryKey: [],
      needCheckSql: true,
      record: {
        rawsql: '',
        actions: [],
        description: '',
        ctx: {},
      },
      rules: {
        rawsql: { required: true, message: this.$t('rule.sql_required') },
      },
      selectedOption: {
        event: '$events/messagepublish',
        sql_example: 'SELECT * FROM "t/#"',
        test_columns: {
          clientid: 'c_emqx',
          username: 'u_emqx',
          topic: 't/a',
          qos: 1,
          payload: '{"msg": "hello"}',
        },
      },
    }
  },

  computed: {
    operationName() {
      const oper = 'create'
      const operationNameMap = {
        view: this.$t('rule.view'),
        edit: this.$t('rule.edit'),
        create: this.$t('rule.create'),
      }
      if (this.id === '0' || this.id === 0) {
        return operationNameMap.create
      }
      return operationNameMap[oper]
    },
    sqlProvider() {
      return ruleEngineProvider
    }
  },

  watch: {
    inTest(val) {
      if (!val) {
        return
      }
      this.initTestFormItem()
    },
    'record.rawsql': 'handleSqlChanged',
  },

  methods: {
    handleSqlChanged(val) {
      this.triggerEventChange(val)
      if (!this.needCheckSql) {
        return
      }
      const checkValues = ruleOldSqlCheck(val)
      if (!checkValues) {
        return
      }
      this.sqlParse(val, checkValues[0])
    },
    sqlParse(sql, oldEvent) {
      this.$confirm(this.$t('rule.parse_confirm'), this.$t('oper.warning'), {
        confirmButtonClass: 'confirm-btn',
        cancelButtonClass: 'cache-btn el-button--text',
        type: 'warning',
      }).then(() => {
        this.record.rawsql = this._sqlFormatter(ruleNewSqlParser(sql, oldEvent))
      }).catch(() => {
        this.needCheckSql = false
      })
    },
    beforeSqlValid(sql) {
      const checkValues = ruleOldSqlCheck(sql)
      if (!checkValues) {
        return true
      }
      this.sqlParse(sql, checkValues[0])
      return false
    },
    handleTest() {
      this.testOutPut = ''
      this.needCheckSql = true
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        if (!this.beforeSqlValid(this.record.rawsql)) {
          return
        }
        const data = JSON.parse(JSON.stringify(this.record))
        try {
          if (data.ctx.payload) {
            data.ctx.payload = JSON.stringify(JSON.parse(data.ctx.payload))
          }
        } catch (e) {
          console.log(data.ctx.payload)
        }
        this.$httpPost('/rules?test=true', data).then((res) => {
          const { data } = res
          this.testOutPut = JSON.stringify(data, null, 2)
        })
      })
    },
    triggerEventChange(sql) {
      const events = [
        'events/message_delivered',
        'events/message_acked',
        'events/message_dropped',
        'events/client_connected',
        'events/client_disconnected',
        'events/session_subscribed',
        'events/session_unsubscribed',
      ]
      let values = null
      let value = ''
      events.forEach((e) => {
        const [regType, regEvent] = e.split('/')
        const reg = new RegExp(`\\$${regType}\\/${regEvent}`, 'gim')
        if (sql.match(reg)) {
          values = sql.match(reg)
        }
      })
      if (values) {
        value = values[0]
      } else {
        value = '$events/message_publish'
      }
      if (value === this.selectedOption.event) {
        return
      }
      this.selectedOption = this.eventsList.find($ => $.event === value) || { columns: {}, test_columns: {} }
      this.sqlPrimaryKey = this.selectedOption.columns
      this.initTestFormItem()
    },
    initTestFormItem() {
      this.testOutPut = ''
      const testFieldObject = {}
      const testFieldRules = {}

      const { test_columns: testColumns } = this.selectedOption
      Object.keys(testColumns).forEach((k) => {
        let value = testColumns[k]

        if (typeof value === 'object') {
          value = JSON.stringify(value, null, 2)
        }
        testFieldObject[k] = value
        testFieldRules[k] = { required: true, message: `${k} ${this.$t('rule.is_required')}` }
      })
      this.$set(this.record, 'ctx', testFieldObject)
      this.rules.ctx = testFieldRules
    },
    generateEventsSelect() {
      this.eventOptions = this.eventsList
      this.selectedOption = this.eventsList[0]
      this.record.rawsql = this._sqlFormatter(this.selectedOption.sql_example)
    },
    _sqlFormatter(sql) {
      const newSQL = sqlFormatter.format(sql)
      let text = newSQL.replace(/= ~/g, '=~').replace(/\n/g, '!#!')
      const paramsRe = text.match(/SELECT!#!(.+)!#!FROM/)
      if (paramsRe) {
        const paramsText = paramsRe[1]
        if (paramsText) {
          const newParamsText = paramsText.replace(/(!#!|\s)/g, ' ').split(/[,，]/).join(', ')
          text = text.replace(paramsText, `  ${newParamsText}`)
        }
      }
      return text.replace(/!#!/g, '\n')
    },
    handleCreate() {
      if (this.$refs.record) {
        this.$refs.record.validate((valid) => {
          if (!valid) {
            return
          }
          if (this.record.actions.length === 0) {
            this.$message.error(this.$t('rule.actions_required'))
            return
          }
          this.$httpPost('/rules', this.record).then(() => {
            this.$message.success(this.$t('rule.create_success'))
            this.$router.push('/rules')
          })
        })
      }
    },
    async loadData() {
      this.eventsList = await loadRuleEvents()
      this.generateEventsSelect()
    },
    handleCancel() {
      this.$router.push('/rules')
    },
  },

  created() {
    this.loadData()
    this.initTestFormItem()
  },
}
</script>


<style lang="scss">
.rule-create {

  .page-title .el-breadcrumb {
    text-transform: none;
  }

  .el-card {
    margin-top: 24px;
    min-height: 150px;
    padding: 20px;
    overflow: visible;

    .config-null {
      text-align: center;
      margin: 20px auto;
    }
  }

  .toggle-btn {
    cursor: pointer;
    margin-top: 4px;
    width: auto;
  }

  .show-guess {
    line-height: 1.4;

    p {
      font-size: 13px;
      margin-bottom: 4px;
      .notice {
        color: #ff6d6d;
      }
    }
  }

  .form-block--wrapper {
    margin-bottom: 50px;
    padding-bottom: 24px;

    .form-block__title {
      margin-bottom: 30px;
      padding-left: 10px;
      border-left: 4px solid #34c388;

      .form-block__title-tips {
        font-size: 12px;
        display: inline-block;
        margin-left: 4px;
      }
    }

    .form-block__body {
      padding-left: 20px;
    }
  }

  .sql-tips {
    padding: 20px 0;
    border-radius: 4px;
    font-size: 15px;
    max-height: 480px;

    .title {
      padding: 0 20px 12px 20px;
    }

    .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .doc-wrapper {
      max-height: 400px;
      padding: 0 20px;
    }

    p {
      font-size: 13px;
      margin-bottom: 4px;
    }

    li {
      font-size: 13px;
      margin: 8px 12px;
    }

    code, span {
      font-size: 12px;
      margin-bottom: 12px;
    }
  }

  .code {
    line-height: 1.4;
    padding: 6px;
    border-radius: 4px;
    margin-bottom: 12px;
    &.text {
      line-height: 1.8;
    }
  }

  .test-btn {
    margin-top: 12px;
  }
}

.code-sql {
  line-height: 18px !important;

  &.rawsql .el-form-item__content {
    height: 420px;
  }

  &.payload .el-form-item__content {
    height: 200px;
  }

  .el-form-item__content {
    line-height: 18px !important;
  }

  .payload-type {
    width: 100%;
    text-align: right;
    padding: 2px 4px;
    margin-bottom: 12px;
    .el-radio__label {
      font-size: 13px;
    }
  }

  &.is-error {
    .code-sql__editor,
    .monaco-container {
      border-color: #ff6d6d;
    }
  }
}
</style>
