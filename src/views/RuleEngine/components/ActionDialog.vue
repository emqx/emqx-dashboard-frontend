<!-- 动作类型编辑与选择 -->
<template>
  <el-dialog
    v-bind="$attrs"
    width="500px"
    append-to-body
    class="action-dialog"
    :visible.sync="dialogVisible"
    :title="$t('rule.actions')"
    @open="open"
    @close="close">
    <el-form
      class="el-form--public"
      ref="record"
      :model="record"
      :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item prop="action">
            <template slot="label">
              {{ $t('rule.action') }}
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover">
                <div v-html="action.descriptionLabel || $t('rule.action_type')"></div>
                <i tabindex="-1" class="el-icon-question" slot="reference"></i>
              </el-popover>
            </template>
            <el-select
              v-model="record.action"
              class="el-select--public"
              popper-class="el-select--public"
              @change="handleActionChange"
              style="width: 100%">
              <el-option
                v-for="(item, index) in actionsList"
                :key="index"
                :label="item.label"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 选择 resource -->
        <el-col v-if="action.params && action.params.$resource" :span="12">
          <el-form-item class="resource-item" prop="params.$resource">
            <template slot="label">
              {{ $t('rule.resource') }}
              <span class="btn" style="float: right;font-size: 12px" @click="createResource">
                {{ $t('rule.new_resource') }}
              </span>
            </template>
            <el-select
              v-model="record.params.$resource"
              class="el-select--public"
              popper-class="el-select--public"
              style="width: 100%">
              <el-option
                v-for="(item, index) in options"
                :key="index"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>


        <el-col
          v-for="(item, index) in paramsList"
          :span="(item.type === 'object' || item.$attrs.type === 'textarea') ? 24 : 12"
          :key="index">
          <el-form-item :prop="`params.${item.prop}`">
            <template slot="label">
              {{ item.label }}

              <el-popover
                v-if="item.description"
                placement="right"
                width="200"
                trigger="hover">
                <div v-html="item.description"></div>
                <i tabindex="-1" class="el-icon-question" slot="reference"></i>
              </el-popover>
            </template>

            <data-table
              v-if="item.type === 'object'"
              v-model="record.params[item.key]"
            ></data-table>

            <emq-select2
              v-else-if="item.type === 'emq-select'"
              v-bind="item.$attrs"
              v-model="record.params[item.key]"
              class="el-select--public"
              popper-class="el-select--public">
            </emq-select2>

            <!-- Number field -->
            <el-input
              v-else-if="item.type === 'number'"
              type="number"
              v-bind="item.$attrs"
              v-model.number="record.params[item.key]">
            </el-input>

            <el-input
              v-else
              v-bind="item.$attrs"
              v-model="record.params[item.key]">
            </el-input>

          </el-form-item>
        </el-col>

      </el-row>
    </el-form>

    <div slot="footer">
      <el-button class="cache-btn" type="text" @click="dialogVisible = false">
        {{ $t('rule.cancel') }}
      </el-button>
      <el-button class="confirm-btn" type="success" @click="handleAdd">
        {{ $t('rule.confirm') }}
      </el-button>
    </div>

    <resource-dialog
      :visible.sync="resourceDialogVisible" :resource-type="resourceType"
      :enable-item="enableItem"
      append-to-body
      @confirm="handleResourceCreate">
    </resource-dialog>
  </el-dialog>
</template>


<script>
import EmqSelect2 from '~/components/EmqSelect2'
import ResourceDialog from '~/views/RuleEngine/components/ResourceDialog'
import { params2Form2 } from '~/common/utils'

const lang = window.localStorage.language || window.EMQX_DASHBOARD_CONFIG.lang || 'en'

export default {
  name: 'action-dialog',

  inheritAttrs: false,

  components: { EmqSelect2, ResourceDialog },

  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    formData: {
      type: Object,
    },
    currentActions: {
      type: Array,
      default: () => [],
    },
    params: {
      type: Object,
      default: () => ({ for: '$message' }),
    },
  },

  data() {
    return {
      resourceDialogVisible: false,
      resourceType: '',
      enableItem: [],
      record: {
        action: '',
        params: {},
      },
      rules: {
        action: {
          required: true,
        },
        params: {
          $resource: {
            required: true,
            message: 'Resource is required',
          },
        },
      },
      options: [],
      action: {},

      actionsList: [],
      paramsList: [],
    }
  },

  methods: {
    clearTabIndex() {
      document.querySelectorAll('.el-icon-question').forEach((el) => {
        el.setAttribute('tabindex', '-1')
      })
    },
    handleResourceCreate(resource) {
      this.loadResource(resource.id)
    },
    createResource() {
      this.resourceDialogVisible = true
      this.resourceType = this.action.type
    },
    _isEmpty(val) {
      if (!val) {
        return true
      }
      if (Array.isArray(val) && val.length === 0) {
        return true
      }
      if (typeof val === 'object') {
        return Object.keys(val).length === 0
      }
      return !!val
    },
    close() {
      if (this.$refs.record) {
        this.options = {}
        this.action = {}
        this.paramsList = []
        this.$refs.record.resetFields()
      }
    },
    handleAdd() {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        const { params, action: name } = this.record
        // 资源类型 资源参数
        const action = { name, params: { ...params } }
        const hash = JSON.stringify(action)
        if (this.currentActionsMap[hash]) {
          this.$message.error(this.$t('rule.action_exists'))
          return
        }
        this.$emit('confirm', action)
        this.dialogVisible = false
      })
    },
    handleActionChange(val) {
      this.paramsList = []
      this.enableItem = []
      this.action = this.actionsList.find($ => $.name === val)
      if (!this.action) {
        return
      }
      this.enableItem = this.action.types
      // TODO: resource_type to action layout
      const { model = [], rules = {} } = params2Form2(this.action.params)
      this.rules.params = { ...this.rules.params, ...rules }
      // fillData
      this.$set(this.record, 'params', {})
      model.forEach((item) => {
        const { key, defaultValue } = item
        this.$set(this.record.params, key, defaultValue === undefined ? '' : defaultValue)
      })
      this.paramsList = model
      setTimeout(() => {
        this.$refs.record.clearValidate()
      }, 10)
      return this.loadResource()
      // setTimeout(this.clearTabIndex, 500)
    },

    // 加载 resource 列表
    loadResource(resourceId = undefined) {
      if (!this.action || !this.action.params || !this.action.params.$resource) {
        return
      }
      this.$set(this.record.params, '$resource', resourceId)
      // 清空 待选择
      this.$set(this.record, 'resource', resourceId)
      const { types = [] } = this.action
      return this.$httpGet('/resources').then((response) => {
        const { data } = response
        this.options = data.filter($ => types.includes($.type))
        // 清空 待选择
        this.$set(this.record, 'resource', resourceId)
      })
    },

    loadActions() {
      return this.$httpGet('/actions', this.params).then((response) => {
        this.actionsList = response.data.map(($) => {
          $.label = ($.title || {})[lang]
          $.descriptionLabel = ($.description || {})[lang]
          return $
        })
      })
    },
    // 使用配置绘制
    async renderForm(formData) {
      if (!this.formData) {
        return
      }
      const { name, params = {} } = this.formData || formData

      // 加载资源
      await this.handleActionChange(name)
      // 填充数据
      this.fillData(params)
    },
    fillData(data) {
      Object.entries(data).forEach((item) => {
        const [key, value] = item
        this.$set(this.record, key, value)
      })
    },
    open() {
      // this.dialogVisible = true
      // this.renderForm(formData)
      this.record.params = {}
      this.record.action = ''
      this.loadActions()
    },
  },

  async created() {
    await this.loadActions()
    await this.renderForm()
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
    currentActionsMap() {
      const dict = {}
      this.currentActions.forEach((item) => {
        const hash = JSON.stringify(item)
        dict[hash] = true
      })
      return dict
    },
  },
}
</script>


<style lang="scss">
.action-dialog {
  .action-tips {
    padding: 20px auto;
    font-size: 13px;
  }

  .resource-item .el-form-item__label {
    width: 100%;
    text-align: left;
    padding-right: 0;
  }

  .el-form-item__content {
    clear: both;
  }

  .el-select {
    width: 100%;
  }
}
</style>
