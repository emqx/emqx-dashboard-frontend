<template>
  <el-input
    v-model="sourceValue"
    class="json-input"
    type="textarea"
    :placeholder="$attrs.placeholder || objectPlaceholder"
    :rows="5">
  </el-input>
</template>


<script>
export default {
  name: 'json-input',

  components: {},

  inheritAttrs: false,

  props: {
    value: [Array, Object, String],
  },

  model: {
    prop: 'value',
    event: 'input',
  },

  data() {
    return {
      objectPlaceholder: `JSON, e.g: \n${JSON.stringify({
        Authorization: 'Basic YWRtaW46cHVibGlj',
      }, null, 2)}`,
      sourceValue: '',
    }
  },

  methods: {},

  created() {
    try {
      this.sourceValue = JSON.parse(this.value, null, 2)
    } catch (e) {
      this.sourceValue = ''
    }
  },

  watch: {
    value(val) {
      console.log(val)
    },
    sourceValue(val) {
      let data = val
      if (!val) {
        this.$emit('input', undefined)
        return
      }
      try {
        data = JSON.parse(val)
      } catch (e) {
        data = val
      }
      this.$emit('input', data)
    },
    // value(val) {
    //   console.log('watch val', val)
    //   if (!val) {
    //     return
    //   }
    //   let data = ''
    //   try {
    //     data = JSON.stringify(val, null, 2)
    //   } catch (e) {
    //     data = ''
    //   }
    //   this.sourceValue = data
    // },
  },

  computed: {},
}
</script>


<style lang="scss">
.json-input {
}
</style>
