<template>
  <div class="generate-jwt">
    <el-row :gutter="20">
      <el-col :span="14">
        <el-form ref="record" :model="record" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="alg">
                <emq-select
                  class="el-select--public"
                  popper-class="el-select--public"
                  v-model="record.alg"
                  :field="{ list: algsOptions }"
                  :placeholder="$t('plugins.algorithm')"
                >
                </emq-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!inCurrentAlgNeedPubKey()">
              <el-form-item prop="secret">
                <el-input v-model="record.secret" :placeholder="$t('plugins.secret')"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24" v-else>
              <el-form-item prop="secret">
                <el-input
                  v-model="record.secret"
                  :placeholder="$t('plugins.secret')"
                  size="small"
                  type="textarea"
                  :rows="5"
                >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item>
            <el-checkbox v-model="payloadVisible" size="small">Payload</el-checkbox>
          </el-form-item>

          <template v-if="payloadVisible">
            <p class="jwt-payload-desc">
              {{ $t('plugins.payloadDesc') }}
              <a :href="jwtDoc" target="_blank" rel="noopener">{{ $t('plugins.jwtDoc') }}</a>
            </p>
            <el-form-item prop="payload">
              <div class="monaco-container" style="height: 200px">
                <monaco id="jwt-payload" v-model="record.payload" lang="json"> </monaco>
              </div>
            </el-form-item>
            <p class="jwt-payload-desc">
              {{ $t('plugins.dataDesc') }}
            </p>
            <el-form-item prop="data">
              <div class="monaco-container" style="height: 200px">
                <monaco id="jwt-data" v-model="record.data" lang="plaintext"> </monaco>
              </div>
            </el-form-item>
          </template>

          <el-form-item prop="expired">
            <el-date-picker
              v-model="record.expired"
              :picker-options="pickerOptions"
              :placeholder="$t('app.expiredText')"
              value-format="timestamp"
            >
            </el-date-picker>
          </el-form-item>

          <el-button type="success" class="add" size="small" @click="save">
            {{ $t('oper.generate') }}
          </el-button>
        </el-form>
      </el-col>
    </el-row>

    <el-table border :data="records">
      <el-table-column prop="username" label="Username"></el-table-column>
      <el-table-column prop="clientid" label="Client ID"></el-table-column>
      <el-table-column min-width="160px" prop="token" label="token" show-overflow-tooltip></el-table-column>
      <el-table-column width="140px" :label="$t('oper.oper')">
        <template slot-scope="{ row }">
          <el-button size="small" type="success" plain icon="el-icon-document-copy" @click="copyToken(row, $event)">
            {{ $t('oper.copy') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { Input, Button, Table, TableColumn, Form, FormItem, Row, Col, Checkbox, DatePicker } from 'element-ui'
import { sign } from '~/common/sign.js'
import Monaco from '~/components/Monaco'
import EmqSelect from '~/components/EmqSelect'
import { handleClipboard } from '~/common/utils'

const algorithmsDoNotNeedPubKey = ['HS256', 'HS384', 'HS512']

export default {
  name: 'generate-jwt',
  components: {
    'el-input': Input,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-row': Row,
    'el-col': Col,
    'el-checkbox': Checkbox,
    'el-date-picker': DatePicker,
    Monaco,
    EmqSelect,
  },
  data() {
    return {
      lang: window.localStorage.getItem('language') || 'en',
      record: {
        alg: 'HS256',
        payload: JSON.stringify(
          {
            username: '%u',
            clientid: '%c',
          },
          null,
          2,
        ),
        data: '',
      },
      rules: {
        secret: { required: true, message: this.$t('plugins.secretRequired') },
        payload: { required: true, message: this.$t('plugins.payloadRequired') },
        data: { required: true, message: this.$t('plugins.dataRequired') },
      },
      algsOptions: [
        'HS256',
        'HS384',
        'HS512',
        'RS256',
        'RS384',
        'RS512',
        'ES256',
        'ES384',
        'ES512',
        'PS256',
        'PS384',
        'PS512',
      ],
      payloadVisible: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
        shortcuts: [
          {
            text: `180 ${this.$tc('util.day', 180)}`,
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 180)
              picker.$emit('pick', date)
            },
          },
          {
            text: `1 ${this.$tc('util.year', 1)}`,
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 365)
              picker.$emit('pick', date)
            },
          },
          {
            text: `3 ${this.$tc('util.year', 3)}`,
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 1095)
              picker.$emit('pick', date)
            },
          },
        ],
      },
      records: [],
    }
  },
  computed: {
    jwtDoc() {
      return this.lang === 'zh'
        ? `https://emqx.io/docs/zh/${this.$store.state.systemVersion}/advanced/auth-jwt.html`
        : `https://emqx.io/docs/en/${this.$store.state.systemVersion}/advanced/auth-jwt.html`
    },
  },
  methods: {
    save() {
      this.$refs.record.validate(async (valid) => {
        try {
          if (!valid) {
            return
          }
          if (this.payloadVisible) {
            this.records = await this.getPayloadJWTData(this.record.payload, this.record.data)
          } else {
            this.records = await this.getPrivateKeyJWTData()
          }
        } catch (error) {
          this.records = []
        }
      })
    },
    inCurrentAlgNeedPubKey() {
      return !algorithmsDoNotNeedPubKey.includes(this.record.alg)
    },
    popupErrorsMessage(errors) {
      if (Array.isArray(errors.errors)) {
        const errorMsg = errors.errors.map(({ message }) => message).join('; ')
        this.$message.error(errorMsg)
      } else {
        this.$message.error(errors.message)
      }
    },
    async getPayloadJWTData(template, data) {
      let payloadStr = JSON.stringify(template)
      const ret = await Promise.all(
        data.split('\n').map((item) => {
          const [username = '', clientid = ''] = item.split(',')
          payloadStr = template.replace(/%u/g, username).replace(/%c/g, clientid)
          const payload = JSON.parse(payloadStr)
          const header = { alg: this.record.alg }
          if (this.record.expired) {
            payload.exp = this.record.expired / 1000
          }
          return new Promise(async (resolve, reject) => {
            try {
              const token = await sign(header, payload, this.record.secret)
              resolve({ username, clientid, token })
            } catch (error) {
              this.popupErrorsMessage(error)
              reject()
            }
          })
        }),
      )
      return Promise.resolve(ret)
    },
    async getPrivateKeyJWTData() {
      const payload = {}
      if (this.record.expired) {
        payload.exp = this.record.expired / 1000
      }
      const header = { alg: this.record.alg }
      return new Promise(async (resolve, reject) => {
        try {
          const token = await sign(header, payload, this.record.secret)
          resolve([{ clientid: '', username: '', token }])
        } catch (error) {
          this.popupErrorsMessage(error)
          reject()
        }
      })
    },
    copyToken(row, event) {
      handleClipboard(row.token, event)
    },
  },
}
</script>

<style lang="scss">
.generate-jwt {
  .monaco-container {
    height: 200px;
  }
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-table {
    margin-top: 40px;
  }
  .jwt-payload-desc {
    font-size: 14px;
    padding: 6px;
    border-radius: 4px;
    line-height: 1.4;
    margin: 16px 0;
  }
}
</style>
