<template>
  <el-dialog
    v-bind="$attrs"
    width="700px"
    class="resource-dialog"
    :visible.sync="dialogVisible"
    :title="$t('rule.resource_mgmt')"
    @close="close"
    @open="loadResourceTypes"
  >
    <el-form class="el-form--public" ref="record" :model="record" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="type" :label="$t('rule.resource_type')">
            <el-select
              v-model="record.type"
              class="el-select--public"
              popper-class="el-select--public"
              style="width: 100%;"
              :disabled="!!resourceType || oper === 'edit'"
              @change="handleTypeChange"
            >
              <div v-for="(item, index) in resourceTypes" :key="index">
                <el-option
                  v-if="enableItem.length === 0 ? true : enableItem.includes(item.name)"
                  :label="item.titleLabel"
                  :value="item.name"
                >
                </el-option>
              </div>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item>
            <template slot="label">&nbsp;</template>
            <el-button type="primary" @click="handleCreate(false)">
              {{ $t('rule.conf_test') }}
            </el-button>
          </el-form-item>
        </el-col>

        <template v-if="record.type">
          <el-col :span="12">
            <el-form-item prop="id" :label="$t('rule.resource_id')">
              <el-input v-model="record.id" :disabled="oper === 'edit'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="description" :label="$t('rule.resource_des')">
              <el-input v-model="record.description"></el-input>
            </el-form-item>
          </el-col>

          <el-col
            v-for="(item, index) in paramsList"
            :span="item.type === 'object' || item.type === 'array' || item.$attrs.type === 'textarea' ? 24 : 12"
            :key="index"
          >
            <el-form-item
              v-if="item.type !== 'file' && !['verify', 'tls_version', 'ciphers'].includes(item.key)"
              :prop="`config.${item.prop}`"
            >
              <template slot="label">
                {{ item.label }}

                <el-popover v-if="item.description" placement="right" width="200" trigger="hover">
                  <div v-html="item.description"></div>
                  <span tabindex="-1" class="el-icon-question" slot="reference"></span>
                </el-popover>
              </template>

              <data-table v-if="item.type === 'object'" v-model="record.config[item.key]"></data-table>

              <template v-else-if="item.type === 'array'">
                <array-editor v-model="record.config[item.key]" :data="item.oneObjOfArray"></array-editor>
              </template>

              <emq-select
                v-else-if="item.type === 'emq-select'"
                v-bind="item.$attrs"
                v-model="record.config[item.key]"
                class="el-select--public"
                popper-class="el-select--public"
              >
              </emq-select>

              <file-editor v-else-if="item.type === 'file'" v-model="record.config[item.key]"></file-editor>

              <!-- Number field -->
              <el-input
                v-else-if="item.type === 'number'"
                type="number"
                v-bind="item.$attrs"
                v-model.number="record.config[item.key]"
              >
              </el-input>

              <!-- Password field -->
              <el-input
                v-else-if="item.type === 'password'"
                v-model="record.config[item.key]"
                v-bind="item.$attrs"
                show-password
              >
              </el-input>

              <!-- String field -->
              <el-input v-else v-bind="item.$attrs" v-model="record.config[item.key]"> </el-input>
            </el-form-item>
            <template v-else>
              <el-form-item
                v-if="
                  ['true', true].includes(record.config['https_enabled']) ||
                  ['true', true].includes(record.config['ssl']) ||
                  (record.config['ssl'] === undefined && record.config['https_enabled'] === undefined)
                "
                :prop="`config.${item.prop}`"
              >
                <template slot="label">
                  {{ item.label }}

                  <el-popover v-if="item.description" placement="right" width="200" trigger="hover">
                    <div v-html="item.description"></div>
                    <span tabindex="-1" class="el-icon-question" slot="reference"></span>
                  </el-popover>
                </template>
                <file-editor v-if="item.type === 'file'" v-model="record.config[item.key]"></file-editor>
                <emq-select
                  v-else-if="item.type === 'emq-select'"
                  v-bind="item.$attrs"
                  v-model="record.config[item.key]"
                  class="el-select--public"
                  popper-class="el-select--public"
                >
                </emq-select>
                <el-input v-else v-bind="item.$attrs" v-model="record.config[item.key]"> </el-input>
              </el-form-item>
            </template>
          </el-col>
        </template>
      </el-row>
    </el-form>

    <div slot="footer">
      <el-button class="cache-btn" type="text" @click="dialogVisible = false">
        {{ $t('rule.cancel') }}
      </el-button>
      <el-button class="confirm-btn" type="success" @click="handleCreate">
        {{ oper === 'edit' ? $t('rule.confirm') : $t('rule.create') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import EmqSelect from '~/components/EmqSelect'
import ArrayEditor from '~/components/ArrayEditor'
import FileEditor from '~/components/FileEditor'
import { params2Form, verifyID } from '~/common/utils'

const lang = window.localStorage.language || window.EMQX_DASHBOARD_CONFIG.lang || 'en'

export default {
  name: 'resource-dialog',
  components: { EmqSelect, ArrayEditor, FileEditor },
  inheritAttrs: false,

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    resourceType: {
      type: String,
    },
    enableItem: {
      type: Array,
      default: () => [],
    },
    oper: {
      type: String,
      default: 'add',
    },
    editItem: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      paramsList: [],
      resourceRules: {},
      resourceTypes: [],
      record: {
        type: '',
        config: {},
        description: '',
        id: '',
      },
    }
  },

  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      },
    },
    rules() {
      return {
        id: { required: true, validator: verifyID },
        type: { required: true, message: this.$t('rule.type_required') },
        ...this.resourceRules,
      }
    },
  },

  methods: {
    clearTabIndex() {
      document.querySelectorAll('.el-icon-question').forEach((el) => {
        el.setAttribute('tabindex', '-1')
      })
    },
    close() {
      if (this.$refs.record) {
        this.$refs.record.resetFields()
      }
    },
    cleanFileContent(config) {
      const falseValues = [false, 'false']
      if (falseValues.includes(config.ssl)) {
        config.verify = false
        Object.keys(config).forEach((key) => {
          const oneValue = config[key]
          if (typeof oneValue === 'object' && Object.keys(oneValue).includes('file')) {
            config[key] = {
              file: '',
              filename: '',
            }
          }
        })
      }
    },
    handleCreate(isCreate = true) {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        const { config } = this.record
        // String to Boolean
        Object.keys(config).forEach((label) => {
          const value = config[label]
          if (value === 'true') {
            this.record.config[label] = true
          }
          if (value === 'false') {
            this.record.config[label] = false
          }
        })
        this.cleanFileContent(config)
        const url = isCreate ? '/resources' : '/resources?test=true'
        if (this.oper === 'edit' && isCreate) {
          this.handleEdit(url, this.record)
          return
        }
        this.$httpPost(url, this.record)
          .then((res) => {
            if (!isCreate) {
              this.$message.success(this.$t('rule.conf_test_success'))
              return
            }
            this.$message.success(this.$t('rule.create_success'))
            this.dialogVisible = false
            this.$emit('confirm', res.data)
          })
          .catch(() => {})
      })
    },
    handleTypeChange(val) {
      this.paramsList = []
      this.resourceRules = {}
      const resourceType = this.resourceTypes.find(($) => $.name === val)
      if (!resourceType) {
        return
      }
      const { model, rules } = params2Form(resourceType.params, 'config')
      this.resourceRules = rules
      this.paramsList = model
      this.initRecord()
      setTimeout(this.clearTabIndex, 500)
    },
    // 初始化 record
    initRecord() {
      if (this.paramsList.length === 0) {
        this.$set(this.record, 'config', undefined)
      } else if (!this.record.config) {
        this.$set(this.record, 'config', {})
      }
      this.$set(this.record, 'config', {})
      if (this.oper === 'edit') {
        this.assignValuesToRecord()
      } else {
        // 设置默认值
        this.paramsList.forEach((item) => {
          this.$set(this.record.config, item.key, item.defaultValue)
        })
      }
      setTimeout(() => {
        this.$refs.record.clearValidate()
      }, 30)
    },
    loadResourceTypes() {
      this.$httpGet('/resource_types').then((response) => {
        this.record = {
          type: '',
          config: {},
          description: '',
          id: 'resource:' + Math.random().toString().slice(3, 9),
        }
        // edit
        if (this.oper === 'edit') {
          const { type, id } = this.editItem
          this.record.type = type
          this.record.id = id
        } else if (this.resourceType) {
          this.record.type = this.resourceType
        }
        this.resourceTypes = response.data.map((item) => {
          item.titleLabel = typeof item.title === 'object' ? item.title[lang] : item.title
          return item
        })
        this.handleTypeChange(this.record.type)
        setTimeout(() => {
          this.$refs.record.clearValidate()
        }, 30)
      })
    },
    assignValuesToRecord() {
      const { config, description } = this.editItem
      this.record.description = description
      Object.keys(config).forEach((key) => {
        const value = config[key]
        this.$set(this.record.config, key, value)
      })
    },
    handleEdit(url, record) {
      this.$confirm(this.$t('rule.confirm_edit_resource'), 'Notice', {
        confirmButtonClass: 'confirm-btn',
        confirmButtonText: this.$t('oper.confirm'),
        cancelButtonClass: 'cache-btn el-button--text',
        cancelButtonText: this.$t('oper.cancel'),
        type: 'warning',
      })
        .then(() => {
          const { id } = this.editItem
          this.$httpPut(`${url}/${id}`, record)
            .then((res) => {
              this.$message.success(this.$t('rule.edit_success'))
              this.dialogVisible = false
              this.$emit('confirm', res.data)
            })
            .catch(() => {})
        })
        .catch()
    },
  },
}
</script>

<style lang="scss">
.resource-dialog {
  .el-form {
    padding: 20px;
  }

  .el-input--medium .el-input__inner {
    height: 35px;
    line-height: 35px;
  }

  .block__title {
    padding-left: 10px;
    margin-left: 10px;
    border-left: 4px solid #34c388;
    margin-bottom: 20px;
  }

  .el-select {
    width: 100%;
  }

  .divide {
    margin: 25px auto;
    border-bottom: 1px solid #d8d8d8;
    clear: both;
  }

  .el-form-item__content {
    clear: both;
  }
}
</style>
