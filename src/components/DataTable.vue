<template>
  <el-table
    class="data-table"
    style="margin-top: 0;"
    border
    :class="{ disable: disabled, 'el-table--public': isRaw }"
    :data="tableData"
  >
    <el-table-column prop="key" :label="_option.keyLabel">
      <template slot-scope="{ row }">
        <span class="data-value">{{ row.key }}</span>
        <el-input
          v-model="row.key"
          class="data-input"
          size="mini"
          :placeholder="row.__new ? 'Key' : ''"
          :class="{ 'is-error': row.__has_error && !row.__new }"
          @input="handleInput(row)"
        >
          <template v-if="row.__has_error" slot="append">
            {{ $t('rule.exists') }}
          </template>
        </el-input>
      </template>
    </el-table-column>

    <el-table-column prop="value" class-name="value-column" :label="_option.valueLabel">
      <template slot-scope="{ row, $index }">
        <span class="data-value">{{ row.value }}</span>
        <el-input
          v-model="row.value"
          class="data-input"
          size="mini"
          :placeholder="row.__new ? 'Value' : ''"
          @input="handleInput(row, false)"
        >
        </el-input>

        <i
          v-if="!disabled"
          :class="{ 'el-icon-close': !row.__new, 'oper-icon': true }"
          @click="handleOper('remove', $index, true)"
        >
          {{ row.__new ? '&nbsp;' : '' }}
        </i>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'data-table',

  components: {},

  props: {
    value: {
      required: true,
    },
    isRaw: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    option: {
      type: Object,
      default: () => ({}),
    },
    allowedArray: {
      type: Boolean,
      default: false,
    },
  },

  model: {
    prop: 'value',
    event: 'input',
  },

  watch: {
    // value: 'initValue',
  },

  data() {
    return {
      tableData: [
        {
          __new: true,
          key: '',
          value: '',
        },
      ],
    }
  },

  methods: {
    initValue(val) {
      if (!val) {
        this.tableData = [{ key: '', value: '', __new: true }]
        return
      }
      this.tableData = []
      Object.entries(val).forEach((item) => {
        const [key, value] = item
        if (!key) {
          return
        }
        if (value && Array.isArray(value)) {
          value.forEach((valueItem) => {
            this.tableData.push({ key, value: valueItem })
          })
        } else {
          this.tableData.push({ key, value })
        }
      })
      if (this.disabled) {
        return
      }
      this.tableData.push({ key: '', value: '', __new: true })
    },

    handleInput(row) {
      if (row.__new) {
        this.$delete(row, '__new')
        if (row.key || row.value) {
          this.tableData.push({
            key: '',
            value: '',
            __new: true,
          })
        }
      }
      this.setObject()
    },

    setObject() {
      const obj = {}
      const keyMap = {}
      this.tableData.forEach((row) => {
        this.$set(row, '__has_error', false)
        const { key, value = '', __new } = row
        if (!key || __new) {
          return
        }
        if (keyMap[key] && !this.allowedArray) {
          this.$set(row, '__has_error', true)
          const lastRow = this.tableData.find(($) => key === $.key)
          if (lastRow) {
            this.$set(lastRow, '__has_error', true)
          }
          // last key set
          return
        }
        // exists key => trans to array
        if (keyMap[key]) {
          if (Array.isArray(obj[key])) {
            obj[key].push(value)
          } else {
            obj[key] = [obj[key], value]
          }
        } else {
          obj[key] = value
        }

        if (obj[key] && !this.allowedArray && Array.isArray(obj.key)) {
          obj[key] = obj[key][0]
        }
        keyMap[key] = true
      })
      this.$emit('input', obj)
    },

    handleOper(oper, index, state) {
      if (['edit'].includes(oper)) {
        this.$set(this.tableData[index], `__${oper}`, state)
      } else if (oper === 'remove') {
        this.tableData = this.tableData.filter(($, i) => i !== index)
      }
      this.setObject()
    },
  },

  created() {
    this.initValue(this.value)
  },

  computed: {
    _option() {
      return {
        keyLabel: this.$t('rule.data_key'),
        valueLabel: this.$t('rule.data_value'),
        ...this.option,
      }
    },
  },
}
</script>

<style lang="scss">
.data-table {
  .cell {
    .el-input__inner {
      border-color: transparent;

      &:focus {
        border-color: #dcdfe6;
      }
    }
  }

  .data-input {
    position: relative;

    .el-input-group__append {
      background-color: #fff;
      border: none;
      font-size: 12px;
      color: #ff6d6d;
    }
  }

  .oper-icon {
    width: 40px;
    height: 26px;
    line-height: 28px;
    visibility: hidden;
    cursor: pointer;
    text-align: center;
  }

  td {
    padding: 2px 0 !important;
  }

  .cell {
    padding: 0 4px;
  }

  .el-table__row.hover-row {
    .el-icon-close {
      visibility: visible;
    }

    .cell {
      .el-input__inner {
        /*border-color: #dcdfe6;*/
      }
    }
  }

  .el-input__inner {
    border-radius: 0;
  }

  .el-input {
    &.is-error {
      .el-input__inner {
        border-width: 2px;
        border-color: #ff6d6d;
      }
    }
  }

  .data-value {
    display: none;
  }

  &.disable {
    .el-input {
      display: none;
    }

    .data-value {
      display: inline-block;
    }
  }

  .value-column {
    .cell {
      display: flex;

      .data-input {
        flex: 1;
      }
    }
  }

  th {
    &.is-leaf {
      font-weight: 400;
    }
  }
}
</style>
