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

  computed: {
    isUsingDefaultPwd() {
      return this.$store.state.user.isUsingDefaultPwd
    },
  },

  methods: {
    popupMessageBox() {
      this.$msgbox({
        type: 'info',
        message: this.$t('login.defaultPwdTip'),
        confirmButtonText: 'OK',
        customClass: 'default-pwd-tip',
        closeOnClickModal: false,
        callback: () => {
          const route = {
            name: 'users',
            params: { isForChangeDefaultPwd: true },
          }
          if (this.$route.name === 'users') {
            this.$router.replace({
              ...route,
              query: { _t: Date.now() },
            })
          } else {
            this.$router.push(route)
          }
        },
        showClose: false,
      })
    },
  },

  created() {
    if (this.isUsingDefaultPwd) {
      this.popupMessageBox()
    }
  },
}
</script>

<style lang="scss">
.home-view {
  box-sizing: border-box;
  min-height: 100%;
  .home-content {
    margin: 0 32px 0 232px;
    padding: 60px 0 20px 0;
  }
}
.default-pwd-tip {
  width: 380px;
  .el-message-box__content {
    padding-top: 28px;
  }
  .el-message-box__message {
    padding-right: 0;
  }
}
</style>
