<template>
  <div class="plugin-config">
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/plugins' }">{{ nodeName }}</el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-name">{{ pluginName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card class="el-card--self" v-loading="$store.state.loading">
      <div slot="header" class="config-dialog">
        <span>{{ pluginName }}</span>
      </div>
      <div v-if="configOptions.length === 0" class="empty-content">
        <h3>
          {{ $t('plugins.emptyConfigOption') }}
        </h3>
      </div>
      <!--  Plugin Config -->
      <el-form
        ref="record"
        label-position="top"
        size="medium"
        :rules="rules"
        :model="record"
        @keyup.enter.native="updateConfig"
      >
        <el-row :gutter="20">
          <el-col v-for="item in configOptions" :span="12" :key="item.key">
            <template v-if="record[item.selfKey] !== undefined">
              <el-form-item :prop="item.required ? item.selfKey : ''" :label="item.key">
                <el-input v-if="item.value.length < 36" v-model="record[item.selfKey]" :placeholder="item.desc">
                </el-input>
                <el-input
                  v-else
                  v-model="record[item.selfKey]"
                  :prop="item.required ? item.key : ''"
                  type="textarea"
                  :rows="2"
                  :placeholder="item.desc"
                >
                </el-input>
              </el-form-item>
            </template>
          </el-col>
        </el-row>
      </el-form>

      <div v-if="configOptions.length !== 0" class="operation-area">
        <el-button class="confirm-btn" type="success" :disabled="!configChanged" @click="updateConfig">
          {{ $t('oper.confirm') }}
        </el-button>
        <el-button class="cache-btn" type="text" @click="cacheConfig">
          {{ $t('oper.cancel') }}
        </el-button>
        <span v-if="advancedConfig.length > 0" class="cache-btn advanced-btn" @click="selecting = true">
          {{ $t('plugins.advancedConfig') }}
        </span>
      </div>

      <el-button
        v-if="!$store.state.loading && configOptions.length === 0"
        type="text"
        icon="el-icon-arrow-left"
        @click="$router.push('/plugins')"
      >
        {{ $t('plugins.back') }}
      </el-button>
    </el-card>
    <!-- advancedConfig -->
    <el-dialog
      width="500px"
      :title="$t('plugins.advancedConfig')"
      :visible.sync="selecting"
      @keyup.enter.native="moreConfig"
    >
      <div class="advanced-config" :gutter="20">
        <el-checkbox-group v-model="selectedAdvancedConfig">
          <el-checkbox v-for="item in advancedConfig" :label="item" :key="item.key">
            {{ item.key }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="text" class="cache-btn" @click="selecting = false">
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button class="confirm-btn" type="success" @click="moreConfig">
          {{ $t('oper.confirm') }}
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  Dialog,
  Input,
  Checkbox,
  CheckboxGroup,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  Breadcrumb,
  BreadcrumbItem,
  Form,
  FormItem,
  Row,
  Col,
  Card,
} from 'element-ui'

export default {
  name: 'plugin-config',
  components: {
    'el-dialog': Dialog,
    'el-input': Input,
    'el-checkbox': Checkbox,
    'el-checkbox-group': CheckboxGroup,
    'el-select': Select,
    'el-option': Option,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-row': Row,
    'el-col': Col,
    'el-card': Card,
  },
  data() {
    return {
      // nodeName: this.$route.params.nodeName,
      pluginName: this.$route.params.pluginName,
      selecting: false,
      cancel: true,
      defaultOptions: [],
      configOptions: [],
      advancedConfig: {},
      selectedAdvancedConfig: [],
      record: {},
      rules: {},
      configHash: '',
    }
  },
  computed: {
    nodeName() {
      try {
        return atob(this.$route.params.nodeName)
      } catch (e) {
        return ''
      }
    },
    configChanged() {
      return this.configHash !== JSON.stringify(this.record)
    },
  },
  methods: {
    loadConfig() {
      if (this.pluginName.includes('dashboard')) {
        this.$router.hook('/plugins')
        return
      }
      this.$httpGet(`/nodes/${this.nodeName}/plugin_configs/${this.pluginName}`)
        .then((response) => {
          response.data.forEach((item) => {
            this.defaultOptions.push({
              selfKey: item.key.replace(/\./g, '__'),
              ...item,
            })
          })
          this.handleConfigOptions()
          this.cancel = false
        })
        .catch((error) => {
          this.$message.error(error.message || this.$t('error.networkError'))
        })
    },
    handleConfigOptions() {
      this.configOptions = []
      this.advancedConfig = []
      this.defaultOptions.forEach((item) => {
        if (item.key.includes('$id')) {
          return
        }
        if (item.value.length < 36) {
          this.configOptions.unshift(item)
        } else {
          this.configOptions.push(item)
        }
        this.$set(this.record, item.selfKey, item.value)
        if (!item.required && !item.value) {
          this.advancedConfig.push(item)
          this.$delete(this.record, item.selfKey)
        }
      })
      this.handleValidateRules()
      this.configHash = JSON.stringify(this.record)
    },
    handleValidateRules() {
      this.rules = {}
      this.configOptions.forEach((item) => {
        if (item.required) {
          this.rules[item.selfKey] = [
            {
              required: true,
              message: `${item.key} ${this.$t('alert.required')}`,
            },
          ]
        }
      })
    },
    updateConfig() {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        // format record
        const record = {}
        Object.keys(this.record).forEach((key) => {
          if (!this.record[key]) {
            return
          }
          record[key.replace(/__/g, '.')] = this.record[key]
        })
        this.$httpPut(`/nodes/${this.nodeName}/plugin_configs/${this.pluginName}`, record)
          .then(() => {
            this.$message.success(this.$t('plugins.configSuccess'))
            this.configHash = JSON.stringify(this.record)
            this.$router.push('/plugins')
          })
          .catch(() => {
            this.$message.error(this.$t('plugins.configFailure'))
          })
      })
    },
    cacheConfig() {
      if (this.configChanged) {
        this.$confirm(this.$t('plugins.giveUpNotice'), 'Notice', {
          confirmButtonClass: 'confirm-btn',
          confirmButtonText: this.$t('oper.confirm'),
          cancelButtonClass: 'cache-btn el-button--text',
          cancelButtonText: this.$t('oper.cancel'),
          type: 'warning',
        })
          .then(() => {
            this.$message.warning(this.$t('plugins.cacheNotice'))
            this.cancel = true
            this.$router.push('/plugins')
          })
          .catch()
      } else {
        this.cancel = true
        this.$router.push('/plugins')
      }
    },
    moreConfig() {
      const selectedKeyList = []
      // remove cancel select && add selected options
      this.selectedAdvancedConfig.forEach((config) => {
        // add
        if (this.record[config.selfKey] === undefined) {
          this.$set(this.record, config.selfKey, config.value)
        }
        selectedKeyList.push(config.selfKey)
        // remove
      })
      this.advancedConfig.forEach((item) => {
        if (!selectedKeyList.includes(item.selfKey)) {
          this.$delete(this.record, item.selfKey)
        }
      })
      this.selecting = false
    },
  },
  created() {
    this.loadConfig()
  },
  // to modify protection
  beforeRouteLeave(to, from, next) {
    if (this.configChanged && !this.cancel) {
      this.cacheConfig()
      return
    }
    next()
  },
}
</script>

<style lang="scss">
.plugin-config {
  .el-card {
    margin-top: 24px;
    min-height: 150px;
    .config-null {
      text-align: center;
      margin: 20px auto;
    }
  }
  .advanced-btn {
    font-size: 12px !important;
    font-weight: 500;
  }
  .el-checkbox {
    display: block;
    margin-bottom: 10px !important;
    margin-left: 0 !important;
  }
  .cache-btn {
    margin-left: 10px;
  }
}
</style>
