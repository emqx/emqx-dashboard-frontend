<template>
  <div class="topbar">
    <div class="top-area">
      <div class="topbar-right">
        <div class="help-link">
          <el-tooltip
            effect="light"
            :content="$t('leftbar.help')"
            :open-delay="500"
            placement="bottom">
            <router-link
              :class="['link', activeLink ? 'active' : '']" :to="{ path: '/help' }">
              <i class="iconfont icon-bangzhu"></i>
            </router-link>
          </el-tooltip>
        </div>
          <el-button size="medium" class="enterprise-btn" @click="tryEnterprise">
            {{ $t('topbar.tryEnterprise') }}
            <i class="iconfont icon-arrow"></i>
          </el-button>
      </div>
    </div>

  </div>
</template>


<script>
export default {
  name: 'topbar',

  components: {},

  data() {
    return {
      lang: window.localStorage.getItem('language') || 'en',
    }
  },


  computed: {
    activeLink() {
      return this.$route.path === '/help'
    },
  },

  methods: {
    tryEnterprise() {
      const openLink = this.lang === 'en'
        ? 'https://www.emqx.io/downloads#enterprise'
          : 'https://www.emqx.io/cn/downloads#enterprise'
      window.open(openLink)
    },
  },
}
</script>


<style lang="scss">
.topbar {
  height: 60px;
  line-height: 60px;
  padding-left: 110px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 4;
  .top-area {
    background-color: #242327;
    height: 100%;
    padding: 0 20px;
    text-align: right;
    .topbar-right {
      .help-link {
        display: inline;
        line-height: 32px;
        .link {
          display: inline-block;
          color: #82858F;
          padding: 0 20px;
          border-right: 1px solid #2B2C30;
          position: relative;
          top: 3px;
          .icon-bangzhu {
            font-size: 20px;
          }
        }
        a.active {
          color: #34C388;
        }
      }
      .enterprise-btn.el-button {
        color: #34C388;
        background: transparent;
        border-radius: 40px;
        border-color: #34C388;
        margin-left: 20px;
        font-size: 12px;
        font-weight: 400;
        line-height: 15px;
        .icon-arrow {
          position: relative;
          top: 1px;
        }
      }
      .el-button--medium {
        padding: 9px 20px;
      }
    }
  }
}
</style>
