<template>
  <div class="array-editor light-themes">
    <el-table style="margin-top: 1px;" :data="tableData" :render-header="labelHeads" size="mini">
      <el-table-column :label="item" v-for="(item, index) in headers" :key="index">
        <template slot-scope="{ row }">
          <emq-select
            v-if="row[item].type === 'emq-select'"
            v-bind="row[item].$attrs"
            v-model="row[row[item].key]"
            class="el-select--public"
            popper-class="el-select--public"
            @change="atInputChange"
          >
          </emq-select>
          <!-- Number field -->
          <el-input
            v-else-if="row[item].type === 'number'"
            type="number"
            v-bind="row[item].$attrs"
            v-model.number="row[row[item].key]"
            @input="atInputChange"
          >
          </el-input>
          <!-- String field -->
          <el-input v-else v-bind="row[item].$attrs" v-model="row[row[item].key]" @input="atInputChange"> </el-input>
        </template>
      </el-table-column>
      <el-table-column width="60px">
        <span slot="header" class="btn" @click="addColumn">
          {{ $t('rule.add') }}
        </span>
        <template slot-scope="{ row }">
          <span class="btn" @click="deleteItem(row)">
            {{ $t('rule.delete') }}
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import EmqSelect from './EmqSelect'

export default {
  name: 'ArrayEditor',

  components: { EmqSelect },

  model: {
    prop: 'value',
    event: 'update',
  },

  props: {
    value: {
      type: Array,
      required: true,
    },
    notNull: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      tableData: [],
      headers: [],
      oneRow: {},
      defaultConfig: {},
    }
  },

  created() {
    this.initData()
  },

  methods: {
    assignValue() {
      if (this.value.length) {
        for (let i = 0; i < this.value.length; i += 1) {
          this.addColumn()
        }
        this.value.forEach(item => {
          const index = this.value.indexOf(item)
          Object.assign(this.tableData[index], item)
        })
      }
    },
    initData() {
      const { model } = this.data
      // eslint-disable-next-line no-unused-vars
      Object.entries(model).forEach(([k, v]) => {
        const labelName = v.label
        this.headers.push(labelName)
        this.oneRow[labelName] = v
        const { key, defaultValue } = v
        this.oneRow[key] = defaultValue
        this.defaultConfig[key] = defaultValue
      })
      this.assignValue()
    },
    labelHeads(h, { column }) {
      return h('span', { class: 'table-head', style: { width: '100%' } }, [column.label])
    },
    atInputChange() {
      const data = []
      this.tableData.forEach(item => {
        const tempConfig = {}
        Object.keys(this.defaultConfig).forEach(key => {
          tempConfig[key] = item[key]
        })
        data.push(tempConfig)
      })
      this.$emit('update', data)
    },
    deleteItem(row) {
      this.tableData = this.tableData.filter($ => $.key !== row.key)
      this.atInputChange()
    },
    addColumn() {
      const row = { ...this.oneRow }
      row.key = Math.random()
        .toString(16)
        .slice(3)
      this.tableData.push(row)
    },
  },
}
</script>
