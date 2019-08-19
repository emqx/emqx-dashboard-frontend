<template>
  <div class="rule-actions">
    <el-table border :class="{ 'el-table--public': inDialog }" :data="record.actions" default-expand-all>
      <el-table-column prop="name" :label="$t('rule.type')" min-width="80px"></el-table-column>
      <el-table-column show-overflow-tooltip prop="params" :label="$t('rule.params')" min-width="200px">
        <template slot-scope="{ row }">
          <div v-for="(item, i) in Object.entries(row.params)" class="action-item" :key="i">
            {{ item[0] === '$resource' ? $t('rule.rely_resource') : item[0] }}: {{ item[1] }}
          </div>
        </template>
      </el-table-column>


      <!--<el-table-column-->
      <!--v-if="!(has.delete || has.edit)"-->
      <!--prop="metrics"-->
      <!--type="expand">-->
      <!--<template slot-scope="{ row }">-->

      <!--<ul class="status-wrapper metrics">-->
      <!--<li class="status-item" style="margin-bottom: 6px;font-size: 14px">-->
      <!--{{ $t('rule.metrics') }}-->
      <!--</li>-->

      <!--&lt;!&ndash;<el-table :data="row.metrics" border>&ndash;&gt;-->
      <!--&lt;!&ndash;<el-table-column label="节点" prop="node"></el-table-column>&ndash;&gt;-->
      <!--&lt;!&ndash;<el-table-column label="成功数" prop="success"></el-table-column>&ndash;&gt;-->
      <!--&lt;!&ndash;<el-table-column label="失败数" prop="failed"></el-table-column>&ndash;&gt;-->
      <!--&lt;!&ndash;</el-table>&ndash;&gt;-->
      <!--<li v-for="(item, i) in row.metrics || []" :key="i" class="status-item" style="margin-left: 10px">-->
      <!--<span class="key">-->
      <!--{{ item.node }}-->
      <!--</span>-->

      <!--<span type="info">-->
      <!--{{$t('rule.success')}}:-->
      <!--<span>{{ item.success }}</span>-->
      <!--</span>-->

      <!--<span type="info">-->
      <!--{{$t('rule.failed')}}:-->
      <!--<span>{{ item.failed }}</span>-->
      <!--</span>-->

      <!--</li>-->

      <!--<li class="status-item" style="margin-left: 10px;margin-top: 4px">-->

      <!--<span class="key">-->
      <!--{{ $t('rule.all') }}-->
      <!--</span>-->
      <!--<span type="info">-->
      <!--{{$t('rule.success')}}:-->
      <!--<span>{{ getSum(row.metrics, 'success') }}</span>-->
      <!--</span>-->

      <!--<span type="info">-->
      <!--{{$t('rule.failed')}}:-->
      <!--<span>{{ getSum(row.metrics, 'failed') }}</span>-->
      <!--</span>-->
      <!--</li>-->
      <!--</ul>-->
      <!--</template>-->
      <!--</el-table-column>-->


      <el-table-column v-if="has.delete || has.edit" :label="$t('rule.oper')">
        <template slot-scope="props">
          <el-button v-if="has.delete" type="text" @click="handleRemove(props)">
            {{ $t('rule.delete') }}
          </el-button>
          <el-button v-if="has.edit" type="text">{{ $t('rule.edit') }}</el-button>
        </template>
      </el-table-column>

      <el-table-column
        v-if="!(has.delete || has.edit)"
        prop="metrics"
        min-width="130px"
        :label="$t('rule.metrics')">
        <template slot-scope="{ row }">

          <ul class="status-wrapper metrics">
            <!--<li class="status-item" style="margin-bottom: 6px;font-size: 14px">-->
              <!--{{ $t('rule.metrics') }}-->
            <!--</li>-->

            <!--<el-table :data="row.metrics" border>-->
            <!--<el-table-column label="节点" prop="node"></el-table-column>-->
            <!--<el-table-column label="成功数" prop="success"></el-table-column>-->
            <!--<el-table-column label="失败数" prop="failed"></el-table-column>-->
            <!--</el-table>-->
            <li v-for="(item, i) in row.metrics || []" :key="i" class="status-item">
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

            </li>

            <li class="status-item" style="margin-top: 4px">

              <span class="key">
                {{ $t('rule.all') }}
              </span>
              <span type="info">
                {{$t('rule.success')}}:
                <span>{{ getSum(row.metrics, 'success') }}</span>
              </span>

              <span type="info">
                {{$t('rule.failed')}}:
                <span>{{ getSum(row.metrics, 'failed') }}</span>
              </span>
            </li>
          </ul>
        </template>
      </el-table-column>
    </el-table>

    <el-button
      v-if="has.create"
      type="success"
      plain
      icon="el-icon-plus"
      size="small"
      style="margin-top:24px; min-width: 80px"
      @click="dialogVisible = true">
      {{ $t('rule.add') }}
    </el-button>

    <action-dialog
      :visible.sync="dialogVisible"
      :currentActions="record.actions"
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
      default: () => ({ for: '$message' }),
    },
  },

  data() {
    return {
      dialogVisible: false,
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
     * { name: 'action_name', params: { ...params } }
     * @param action
     */
    handleActionAdd(action) {
      this.record.actions.push(action)
    },

    handleRemove(props) {
      const { $index } = props
      this.record.actions = this.record.actions.filter((item, index) => index !== $index)
    },
  },

  created() {
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
}
</script>


<style lang="scss">
.rule-actions {
  .status-wrapper {
    padding: 0;
    list-style-type: none;

    &.metrics {
      .key {
        display: inline-block;
        width: 120px;
      }
    }

    .status-item {
      padding: 2px 6px;

      & > span {
        margin-right: 12px;
      }
    }
  }

  .action-item {
    margin: 2px auto;
  }

  .el-table__expanded-cell {
    padding: 6px;
    font-size: 12px;
  }
}
</style>
