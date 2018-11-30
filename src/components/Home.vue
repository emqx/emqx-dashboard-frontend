<template>
  <div class="home-view">
    <left-bar/>
    <div class="home-content">
      <router-view/>
    </div>
  </div>
</template>


<script>
import LeftBar from './Leftbar'

export default {
  name: 'home-view',
  components: {
    LeftBar,
  },
}
</script>


<style lang="scss">
  .home-view {
    box-sizing: border-box;
    min-height: 100%;
    .home-content {
      margin: 0 20px 0 220px;
      padding-bottom: 20px;
    }
  }
</style>
