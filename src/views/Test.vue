<template>
  <div class="test-view">
    <div class="page-title">
      Test
    </div>

    <code>
      {{val}}
    </code>
    <data-table v-model="val"></data-table>
  </div>
</template>


<script>
export default {
  name: 'test-view',

  components: {},

  props: {},

  data() {
    return {
      val: {
        age: 1,
        sex: false,
        data: 1,
        func: 'xx',
      },
    }
  },

  methods: {},

  created() {},
}
</script>


<style lang="scss">
.test-view {
}
</style>
