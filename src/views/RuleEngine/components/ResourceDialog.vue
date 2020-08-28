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
              :disabled="!!resourceType"
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

        <el-col :span="12">
          <el-form-item prop="id" :label="$t('rule.resource_id')">
            <el-input v-model="record.id"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="description" :label="$t('rule.resource_des')">
            <el-input type="textarea" v-model="record.description"></el-input>
          </el-form-item>
        </el-col>

        <div v-if="record.type">
          <el-col
            v-for="(item, index) in paramsList"
            :span="item.type === 'object' || item.$attrs.type === 'textarea' ? 24 : 12"
            :key="index"
          >
            <el-form-item :prop="`config.${item.prop}`">
              <template slot="label">
                {{ item.label }}

                <el-popover v-if="item.description" placement="right" width="200" trigger="hover">
                  <div v-html="item.description"></div>
                  <span tabindex="-1" class="el-icon-question" slot="reference"></span>
                </el-popover>
              </template>

              <data-table v-if="item.type === 'object'" v-model="record.config[item.key]"></data-table>

              <emq-select
                v-else-if="item.type === 'emq-select'"
                v-bind="item.$attrs"
                v-model="record.config[item.key]"
                class="el-select--public"
                popper-class="el-select--public"
              >
              </emq-select>

              <!-- Number field -->
              <el-input
                v-else-if="item.type === 'number'"
                type="number"
                v-bind="item.$attrs"
                v-model.number="record.config[item.key]"
              >
              </el-input>

              <!-- String field -->
              <el-input v-else v-bind="item.$attrs" v-model="record.config[item.key]"> </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
    </el-form>

    <div slot="footer">
      <el-button class="cache-btn" type="text" @click="dialogVisible = false">
        {{ $t('rule.cancel') }}
      </el-button>
      <el-button class="confirm-btn" type="success" @click="handleCreate">
        {{ $t('rule.create') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import EmqSelect from '~/components/EmqSelect'
import { params2Form, verifyID } from '~/common/utils'

const lang = window.localStorage.language || window.EMQX_DASHBOARD_CONFIG.lang || 'en'

export default {
  name: 'resource-dialog',
  components: { EmqSelect },
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
    handleCreate(isCreate = true) {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        const url = isCreate ? '/resources' : '/resources?test=true'
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
      // 设置默认值
      this.paramsList.forEach((item) => {
        this.$set(this.record.config, item.key, item.defaultValue)
      })
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
          id: '',
        }
        if (this.resourceType) {
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
