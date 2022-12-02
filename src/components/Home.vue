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
import changeDefaultPwd from '~/mixins/changeDefaultPwd'

export default {
  name: 'home-view',

  mixins: [changeDefaultPwd],

  components: {
    Leftbar,
    Topbar,
  },

  data() {
    return {
      isPwdMsgBoxClosed: true,
    }
  },

  computed: {
    isUsingDefaultPwd() {
      return this.$store.state.user.isUsingDefaultPwd
    },
  },

  methods: {
    popupMessageBox() {
      this.isPwdMsgBoxClosed = false
      this.$msgbox({
        type: 'info',
        message: this.$t('login.defaultPwdTip'),
        confirmButtonText: 'OK',
        customClass: 'default-pwd-tip',
        closeOnClickModal: false,
        closeOnHashChange: false,
        callback: () => {
          this.isPwdMsgBoxClosed = true
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

  beforeRouteUpdate(to, from, next) {
    if (!this.isPwdMsgBoxClosed) {
      this.$msgbox.close()
      this.isPwdMsgBoxClosed = true
    }
    this.preventLeaveWithoutChangeDefaultPwd(to, from, next)
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
