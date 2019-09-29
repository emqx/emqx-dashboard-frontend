<template>
  <div class="rule-view">
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
        label-width="100px"
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
                <el-form-item prop="for">
                  <template slot="label">
                    <span style="cursor: pointer" @click="showGuess = !showGuess">
                      {{ $t('rule.trigger_events') }}
                    </span>
                  </template>
                  <emq-select2
                    v-model="record.for"
                    style="width: 100%"
                    :field-name="{ label: 'event', value: 'event' }"
                    :field="{ options: eventsList }"
                    @change="triggerChange">
                    <template slot="option" slot-scope="{ item }">
                      <span style="float: left">{{ item.event }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.title }}</span>
                    </template>
                  </emq-select2>
                  <!--<el-select v-model="record.for" style="width: 100%" @change="triggerChange">-->
                  <!--<el-option-->
                  <!--v-for="(item, k) in eventOptions"-->
                  <!--:key="k"-->
                  <!--:label="item.name"-->
                  <!--:value="item.value">-->
                  <!---->
                  <!--</el-option>-->
                  <!--</el-select>-->
                  <el-collapse-transition>
                    <div v-show="showGuess" class="show-guess">
                      <template v-if="ctxValue">
                        <p>{{ $t('rule.event_info') }}</p>
                        <div class="code">
                          <code style="font-size: 12px">
                            {{ ctxValue }}
                          </code>
                        </div>
                      </template>
                      <p>{{ $t('rule.suggest_sql') }}</p>
                      <div class="code">
                        <code style="font-size: 12px">
                          {{ guessSQL }}
                        </code>
                      </div>
                    </div>
                  </el-collapse-transition>
                </el-form-item>

                <el-form-item prop="rawsql" :label="$t('rule.rule_sql')" class="code-sql">
                  <!--<el-input-->
                  <!--v-model="record.rawsql"-->
                  <!--type="textarea"-->
                  <!--:rows="5"-->
                  <!--:placeholder="rawSqlPlaceholder"></el-input>-->
                  <code-editor
                    v-model="record.rawsql"
                    lang="text/x-sql"
                    class="code-sql__editor"
                    :primary-key="sqlPrimaryKey">
                  </code-editor>
                </el-form-item>

                <el-form-item :label="$t('rule.description')">
                  <el-input v-model="record.description" :placeholder="$t('rule.rule_descr_placeholder')"></el-input>
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
                    :class="{ 'code-sql': k === 'payload' }"
                    v-bind="{ label: k, prop: `ctx.${k}` }"
                    :key="k">
                    <el-input
                      v-if="k !== 'payload'"
                      v-model="record.ctx[k]"></el-input>
                    <code-editor
                      v-else
                      v-model="record.ctx.payload"
                      lang="text/x-sql"
                      class="code-sql__editor">
                    </code-editor>
                  </el-form-item>

                  <el-form-item>
                    <el-button type="primary" size="small" @click="handleTest">
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
                  :params="params"
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
import EmqSelect2 from '~/components/EmqSelect2'
import { loadRuleEvents } from '~/api/rule'

import CodeEditor from '~/components/CodeEditor'

import RuleActions from './components/RuleActions'

export default {
  name: 'rule-view',

  components: { EmqSelect2, CodeEditor, RuleActions },

  props: {},

  watch: {
    inTest(val) {
      if (!val) {
        return
      }
      this.initTestFormItem()
    },
  },

  data() {
    return {
      eventsList: [],
      testOutPut: '',
      inTest: false,
      id: this.$route.params.id,
      showGuess: true,
      eventOptions: [],
      sqlPrimaryKey: [],
      record: {
        name: '',
        for: 'message.publish',
        rawsql: '',
        actions: [],
        description: '',
        ctx: {},
      },
      rawSqlPlaceholder: '',
      rules: {
        for: { required: true },
        rawsql: { required: true, message: this.$t('rule.sql_required') },
      },
      selectedOption: {
        columns: [
          'clientid',
          'username',
          'event',
          'id',
          'payload',
          'peername',
          'qos',
          'timestamp',
          'topic',
        ],
        event: 'message.publish',
        sql_example: 'SELECT * FROM "message.publish" WHERE topic =~ \'t/#\'',
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

  methods: {
    handleTest() {
      this.testOutPut = ''
      this.$refs.record.validate((valid) => {
        if (!valid) {
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
    triggerChange(value) {
      this.selectedOption = this.eventsList.find($ => $.event === value) || { columns: {}, test_columns: {} }
      this.record.rawsql = this._sqlFormatter(this.selectedOption.sql_example)
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
      this.sqlPrimaryKey = this.selectedOption.columns
    },
    _sqlFormatter(sql) {
      const newSQL = sqlFormatter.format(sql)
      let text = newSQL.replace(/= ~/g, '=~').replace(/\n/g, '!#!')
      const paramsRe = text.match(/SELECT!#!(.+)!#!FROM/)
      if (paramsRe) {
        const paramsText = paramsRe[1]
        if (paramsText) {
          const newParamsText = paramsText.replace(/(!#!|\s)/g, '').split(/[,，]/).join(', ')
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
      // if (this.id === 0 || this.id === '0' || this.operationName == 'v') {
      //   return
      // }
      // this.$httpGet(`/rules/${this.id}`).then((response) => {
      //   this.record = response.data
      // })
    },
    handleCancel() {
      this.$router.push('/rules')
    },
  },

  created() {
    this.loadData()
    this.initTestFormItem()
  },

  computed: {
    ctxValue() {
      if (!this.selectedOption.columns) {
        return ''
      }
      const { columns } = this.selectedOption
      return columns.join(', ')
    },
    params() {
      let [type] = (this.record.for || '').split('.')
      type = type || 'message'
      type = `$${type}`
      return {
        for: type,
      }
    },
    operationName() {
      // const { oper = 'view' } = this.$route.query
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
    guessSQL() {
      if (!this.selectedOption.event) {
        return ''
      }
      return this.selectedOption.sql_example
    },
  },
}
</script>


<style lang="scss">
.rule-view {

  .page-title .el-breadcrumb {
    text-transform: none;
  }

  .el-card {
    margin-top: 24px;
    min-height: 150px;
    padding: 20px;

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
    margin-top: 4px;
    line-height: 1.4;

    p {
      font-size: 13px;
      margin-bottom: 4px;
      margin-top: 6px;
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
    max-height: 460px;

    .title {
      padding: 0 20px 12px 20px;
    }

    .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    .doc-wrapper {
      max-height: 380px;
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
  }

  .code-sql__editor {
    border-radius: 6px;

    .CodeMirror-gutters {
      border-radius: 6px 0 0 6px;
    }

    .CodeMirror {
      border-radius: 6px;
    }
  }
}

.code-sql {
  line-height: 18px !important;

  .el-form-item__content {
    line-height: 18px !important;
  }

  &.is-error {
    .code-sql__editor {
      border-color: #ff6d6d;
    }
  }
}
</style>
