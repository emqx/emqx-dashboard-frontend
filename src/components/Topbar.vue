<template>
  <div class="topbar">
    <div class="top-area">
      <div class="topbar-right">
        <div class="help-link">
          <el-tooltip effect="light" :content="$t('leftbar.help')" :open-delay="500" placement="bottom">
            <router-link :class="['link', activeLink ? 'active' : '']" :to="{ path: '/help' }">
              <i class="iconfont icon-bangzhu"></i>
            </router-link>
          </el-tooltip>
        </div>
        <el-button size="medium" class="github-btn" @click="openLink('github')">
          GitHub
          <i class="iconfont icon-git"></i>
        </el-button>
        <el-button size="medium" class="enterprise-btn" @click="openLink('enterprise')">
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
    openLink(type) {
      let link = ''
      if (type === 'enterprise') {
        link =
          this.lang === 'zh'
            ? 'https://www.emqx.com/zh/try?product=enterprise'
            : 'https://www.emqx.com/en/try?product=enterprise'
      } else if (type === 'github') {
        link = 'https://github.com/emqx/emqx'
      }
      const windowUrl = window.open(link)
      windowUrl.opener = null
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
    padding: 0 32px;
    text-align: right;
    .topbar-right {
      .help-link {
        display: inline;
        line-height: 32px;
        .link {
          display: inline-block;
          color: #82858f;
          padding: 0 20px;
          border-right: 1px solid #2b2c30;
          position: relative;
          top: 3px;
          .icon-bangzhu {
            font-size: 20px;
          }
        }
        a.active {
          color: #34c388;
        }
      }
      .el-button {
        border-radius: 40px;
        border-width: 2px;
        margin-left: 20px;
        font-size: 14px;
        font-weight: 400;
        line-height: 15px;
        background: transparent;
        &.enterprise-btn {
          color: #34c388;
          border-color: #34c388;
          .icon-arrow {
            position: relative;
            top: 1px;
          }
        }
        &.github-btn {
          color: #adafb4;
          border-color: #adafb4;
        }
        .iconfont {
          margin-left: 5px;
        }
      }
      .el-button--medium {
        padding: 9px 20px;
      }
    }
  }
}
</style>
