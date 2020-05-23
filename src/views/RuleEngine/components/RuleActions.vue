<template>
  <div class="rule-actions">
    <div
      v-for="(action, index) in record.actions"
      :key="index"
      class="action-card">
      <el-row class="action-body" type="flex">
        <el-col :span="12">
          <div class="filed-item">
            <label class="title">{{ $t('rule.type') }}: </label>
            <span class="desc">{{ action.name }}</span>
          </div>
          <div v-for="(item, i) in Object.entries(action.params)" :key="i" class="filed-item">
            <label class="title"> {{ item[0] === '$resource' ? $t('rule.rely_resource') : item[0] }}: </label>
            <span class="desc">{{ item[1] }}</span>
          </div>
        </el-col>
        <el-col v-if="has.delete || has.edit" :span="12" class="action-oper">
          <el-button v-if="has.edit" type="text" @click="handleActionEdit(action, index)">
            {{ $t('rule.edit') }}
          </el-button>
          <el-button
            v-if="has.delete"
            class="delete-btn"
            type="text"
            @click="handleActionRemove(index)">
            {{ $t('rule.delete') }}
          </el-button>
          <div v-if="!action.fallbacks.length" class="fallbacks">
            <el-popover
              placement="top-start"
              trigger="hover"
              :content="$t('rule.fallbackActionCreate')">
              <el-button
                slot="reference"
                type="text"
                icon="el-icon-plus"
                @click="handleAddFallbacks(action)">
                {{ $t('rule.fallbackAction') }}
              </el-button>
            </el-popover>
          </div>
        </el-col>
        <el-col v-if="!(has.delete || has.edit)" :span="12">
          <div class="status-wrapper filed-item">
            <div v-for="(item, i) in action.metrics || []" :key="i" class="status-item">
              <div class="title">{{ $t('rule.metrics') }}: </div>
              <span class="key">
                {{ item.node }}
              </span>
              <span type="info">
                {{$t('rule.success')}}:
                <span>{{ item.success }}</span>
              </span>
              <span type="info">
                {{$t('rule.failed')}}:
                <span>{{ item.failed }}</span>
              </span>
            </div>
            <div class="status-item">
              <span class="key">
                {{ $t('rule.all') }}
              </span>
              <span type="info">
                {{$t('rule.success')}}:
                <span>{{ getSum(action.metrics, 'success') }}</span>
              </span>
              <span type="info">
                {{$t('rule.failed')}}:
                <span>{{ getSum(action.metrics, 'failed') }}</span>
              </span>
            </div>
          </div>
        </el-col>
      </el-row>

      <template v-if="action.fallbacks && action.fallbacks.length">
        <el-row v-for="(fallback, index) in action.fallbacks" :key="index" class="action-footer" type="flex">
          <el-col :span="12">
            <div class="filed-item">
              <label class="title">{{ $t('rule.type') }}: </label>
              <span class="desc">{{ fallback.name }}</span>
            </div>
            <div v-for="(item, i) in Object.entries(fallback.params)" :key="i" class="filed-item">
              <label class="title"> {{ item[0] === '$resource' ? $t('rule.rely_resource') : item[0] }}: </label>
              <span class="desc">{{ item[1] }}</span>
            </div>
          </el-col>
          <el-col v-if="has.delete || has.edit" :span="12" class="action-oper">
            <el-button v-if="has.edit" type="text" @click="handleFallbackEdit(fallback, action, index)">
              {{ $t('rule.edit') }}
            </el-button>
            <el-button
              v-if="has.delete"
              class="delete-btn"
              type="text"
              @click="handleFallbackRemove(action, index)">
              {{ $t('rule.delete') }}
            </el-button>
            <div class="fallbacks">
              <el-popover
                placement="top-start"
                trigger="hover"
                :content="$t('rule.fallbackActionTip')">
                <span slot="reference">
                  {{ $t('rule.fallbackAction') }}
                </span>
              </el-popover>
            </div>
          </el-col>
          <el-col v-if="!(has.delete || has.edit)" :span="12">
            <div class="status-wrapper filed-item">
              <div v-for="(item, i) in fallback.metrics || []" :key="i" class="status-item">
                <div class="title">{{ $t('rule.metrics') }}: </div>
                <span class="key">
                  {{ item.node }}
                </span>
                <span type="info">
                  {{$t('rule.success')}}:
                  <span>{{ item.success }}</span>
                </span>
                <span type="info">
                  {{$t('rule.failed')}}:
                  <span>{{ item.failed }}</span>
                </span>
              </div>
              <div class="status-item">
                <span class="key">
                  {{ $t('rule.all') }}
                </span>
                <span type="info">
                  {{$t('rule.success')}}:
                  <span>{{ getSum(fallback.metrics, 'success') }}</span>
                </span>
                <span type="info">
                  {{$t('rule.failed')}}:
                  <span>{{ getSum(fallback.metrics, 'failed') }}</span>
                </span>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
    </div>

    <el-button
      v-if="has.create"
      type="success"
      plain
      icon="el-icon-plus"
      size="small"
      style="min-width: 80px"
      @click="dialogVisible = true">
      {{ $t('rule.add') }}
    </el-button>

    <action-dialog
      :visible.sync="dialogVisible"
      :currentActions="record.actions"
      :recordIndex="editIndex"
      :editRecord="editForm"
      :params="params"
      @confirm="handleActionAdd"
    >
    </action-dialog>
  </div>
</template>


<script>
import ActionDialog from './ActionDialog'

export default {
  name: 'rule-actions',

  components: { ActionDialog },

  props: {
    record: {
      type: Object,
      required: true,
    },
    inDialog: {
      type: Boolean,
      default: false,
    },
    operations: {
      type: Array,
      default: () => ['create', 'edit', 'delete'],
    },
    params: {
      type: Object,
      default: () => ({}),
    },
  },

  watch: {
    dialogVisible(val) {
      if (!val) {
        this.editForm = null
        this.editIndex = null
        this.currentAction = {}
        this.isFallBacks = false
      }
    },
  },

  computed: {
    has() {
      const dict = []
      this.operations.forEach((item) => {
        dict[item] = true
      })
      return dict
    },
  },

  data() {
    return {
      dialogVisible: false,
      editForm: null,
      editIndex: null,
      isFallBacks: false,
      currentAction: {},
    }
  },

  filters: {
    jsonFormat(val) {
      return JSON.stringify(val, null, 2)
    },
  },

  methods: {
    getSum(list = [], key = '') {
      if (list.length === 0 || !key) {
        return 0
      }
      let sum = 0
      list.forEach((item) => {
        const value = item[key] || 0
        sum += value
      })
      return sum
    },
    /**
     * 新建好一个 action
     * { name: 'action_name', params: { ...params }, fallbacks: [] }
     * @param action
     */
    handleActionAdd(action, index) {
      if (this.isFallBacks) {
        if (this.editIndex !== null) {
          this.currentAction.fallbacks = []
        }
        this.currentAction.fallbacks.push(action)
        return
      }
      if (index !== null) {
        this.record.actions.splice(index, 1, action)
      } else {
        this.record.actions.push(action)
      }
    },

    handleActionRemove(index) {
      const removeIndex = index
      this.record.actions = this.record.actions.filter((item, index) => index !== removeIndex)
    },
    handleActionEdit(action, index) {
      this.editIndex = index
      this.editForm = action
      this.dialogVisible = true
    },
    handleAddFallbacks(action) {
      this.currentAction = action
      this.isFallBacks = true
      this.dialogVisible = true
    },
    handleFallbackRemove(action) {
      action.fallbacks = []
    },
    handleFallbackEdit(fallback, action, index) {
      this.currentAction = action
      this.isFallBacks = true
      this.editIndex = index
      this.editForm = fallback
      this.dialogVisible = true
    },
  },
}
</script>


<style lang="scss">
.rule-actions {
  .status-wrapper {
    .title, .status-item  {
      margin-bottom: 10px;
    }
    .key {
      width: 120px;
      display: inline-block;
    }
  }
  .action-item {
    margin: 2px auto;
  }
  .action-card {
    font-size: 14px;
    margin-bottom: 24px;
    .action-body, .action-footer {
      padding: 20px;
    }
    .filed-item {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      .title {
        margin-right: 10px;
      }
    }
    .action-oper {
      text-align: right;
      position: relative;
      .delete-btn {
        margin-bottom: 40px;
      }
      .fallbacks {
        position: absolute;
        right: 0;
        bottom: 0;
        .el-button [class*="el-icon-"] + span {
          margin-left: 0px;
        }
      }
    }
    &:last-child {
      margin-bottom: 0px;
    }
  }

  .el-table__expanded-cell {
    padding: 6px;
    font-size: 12px;
  }
}
</style>
