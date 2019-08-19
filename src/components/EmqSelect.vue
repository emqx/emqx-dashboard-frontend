<template>
  <el-select
    v-bind="$attrs"
    v-model="val"
    :value="value"
    class="emq-select">
    <el-option
      v-for="(item, index) in optionItem"
      :key="index"
      :value="item.value"
      :label="item.label">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'emq-select',

  components: {},

  inheritAttrs: false,

  model: {
    prop: 'value',
    event: 'input',
  },

  props: {
    value: {
      type: [Number, String, Array],
      default: undefined,
    },
    /**
     * url: url 存在则从 url 中加载 options
     * key: key 存在则优先从 key 中加载 options
     * options: options 优先级最高
     *
     */
    field: {
      type: Object,
      default: () => ({}),
    },
    sync: {
      default: 0,
    },
    afterLoad: {
      type: Function,
      default: null,
    },
  },

  data() {
    return {
      optionItem: [],
    }
  },

  computed: {
    val: {
      set(val) {
        this.$emit('input', val)
      },
      get() {
        return this.value
      },
    },
  },

  watch: {
    sync(val) {
      if (!val) {
        return
      }
      this.initData()
    },
    // 搜索条件变了
    'field.params': function () {
      this.initData()
    },
  },

  created() {
    this.initData()
  },

  methods: {
    async initData() {
      this.optionItem = []
      const selectMap = JSON.parse(localStorage.getItem('select_map')) || {}
      const { options, key, url, params = {} } = this.field
      if (options) {
        this.optionItem = options
      } else if (key && selectMap[key]) {
        this.optionItem = selectMap[key]
      } else if (url) {
        const res = await this.$axios.get(url, { params })
        this.optionItem = res ? res.data : []
      }
      if (this.afterLoad) {
        this.optionItem = await this.afterLoad(this.optionItem)
      }
    },
  },
}
</script>

<style lang="scss">
.emq-select {
}
</style>
