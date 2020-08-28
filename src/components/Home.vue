<template>
  <div class="home-view">
    <Leftbar />
    <Topbar />
    <div class="home-content">
      <RouterView />
    </div>
  </div>
</template>

<script>
import Leftbar from './Leftbar'
import Topbar from './Topbar'

export default {
  name: 'home-view',
  components: {
    Leftbar,
    Topbar,
  },
}
</script>

<style lang="scss">
.home-view {
  box-sizing: border-box;
  min-height: 100%;
  .home-content {
    margin: 0 32px 0 212px;
    padding: 60px 0 20px 0;
  }
}
</style>
