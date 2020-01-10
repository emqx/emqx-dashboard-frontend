<template>
  <div class="left-bar">
    <div class="bar-title">
      <div>
        <img class="logo" src="../assets/emqlogo.svg">
      </div>
      <h3>Dashboard</h3>
    </div>
    <el-menu
      mode="vertical"
      router
      background-color="#242327"
      text-color="#fff"
      active-text-color="#34C388"
      :default-active="'/' + $route.path.split('/')[1]">

      <!-- MONITORING -->
      <el-submenu index="1">
        <template slot="title">
          <i class="iconfont icon-jiankong"></i>
          <span>{{ $t('leftbar.monitoring') }}</span>
        </template>
        <el-menu-item index="/">
          {{ $t('leftbar.overview') }}
        </el-menu-item>
        <el-menu-item index="/clients">
          {{ $t('leftbar.clients') }}
        </el-menu-item>
        <el-menu-item index="/topics">
          {{ $t('leftbar.topics') }}
        </el-menu-item>
        <el-menu-item index="/subscriptions">
          {{ $t('leftbar.subscriptions') }}
        </el-menu-item>
      </el-submenu>

      <!-- 规则引擎 -->
      <el-submenu index="2">
        <template slot="title">
          <i class="iconfont icon-guize2"></i>
          <span>{{ $t('rule.rule_engine') }}</span>
        </template>
        <!-- 消息规则 -->
        <el-menu-item index="/rules">
          {{ $t('rule.message_rule') }}
        </el-menu-item>
        <el-menu-item index="/resources">
          {{ $t('rule.resource_title') }}
        </el-menu-item>
      </el-submenu>

      <!-- MANAGEMENT -->
      <el-submenu index="3">
        <template slot="title">
          <i class="iconfont icon-guanli"></i>
          <span>{{ $t('leftbar.management') }}</span>
        </template>
        <el-menu-item index="/plugins">
          {{ $t('leftbar.plugins') }}
        </el-menu-item>
        <el-menu-item index="/listeners">
          {{ $t('leftbar.listeners') }}
        </el-menu-item>
        <el-menu-item index="/applications">
          {{ $t('leftbar.applications') }}
        </el-menu-item>
      </el-submenu>

      <!-- TOOLS -->
      <el-submenu index="4">
        <template slot="title">
          <i class="iconfont icon-gongju1"></i>
          <span>{{ $t('leftbar.tools') }}</span>
        </template>
        <el-menu-item index="/websocket">
          {{ $t('leftbar.websocket') }}
        </el-menu-item>
        <el-menu-item index="/http_api">
          {{ $t('leftbar.api') }}
        </el-menu-item>
      </el-submenu>

      <!-- ADMIN -->
      <el-submenu index="5">
        <template slot="title">
          <i class="iconfont icon-xitong"></i>
          <span>{{ $t('leftbar.admin') }}</span>
        </template>
        <el-menu-item index="/users">
          {{ $t('leftbar.users') }}
        </el-menu-item>
        <el-menu-item index="/settings">
          {{ $t('leftbar.settings') }}
        </el-menu-item>
        <el-menu-item index="/help" class="last-item">
          {{ $t('leftbar.help') }}
        </el-menu-item>
      </el-submenu>

      <div class="bar-footer">
        <span>{{ $store.state.user.username }}</span>
        <a href="javascript:;" @click="logout">
          <img src="../assets/exit.png">
        </a>
      </div>
    </el-menu>
  </div>
</template>


<script>
import { Menu, MenuItem, MenuItemGroup } from 'element-ui'
import { mapActions } from 'vuex'

export default {
  name: 'left-bar',
  components: {
    'el-menu': Menu,
    'el-menu-item': MenuItem,
    'el-menu-item-group': MenuItemGroup,
  },
  methods: {
    ...mapActions(['USER_LOGIN']),
    logout() {
      this.USER_LOGIN({ isLogOut: true })
      this.$router.push({ path: '/login' })
    },
  },
}
</script>


<style lang="scss">
.left-bar {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 180px;
  z-index: 1002;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 140px;
  padding-bottom: 45px;
  background-color: #242327;
  box-shadow: 0px 0px 15px #0b0b0b;

  .iconfont {
    margin-right: 8px;
    font-size: 18px;
  }

  .bar-title {
    position: fixed;
    top: 0;
    z-index: 1003;
    width: 180px;
    border-bottom: 1px solid #2B2C30;
    color: #fff !important;
    background-color: #242327;
    text-align: center;
    padding: 24px 0;

    h3 {
      font-size: 18px;
      margin: 0px;
      color: #fff;
    }

    img {
      width: 60px;
      height: 60px;
      margin-bottom: 8px;
    }
  }

  .bar-footer {
    position: fixed;
    bottom: 0;
    width: 180px;
    z-index: 1003;
    padding-left: 20px;
    height: 47px;
    line-height: 47px;
    background: inherit;
    border-top: 1px solid #2B2C30;
    color: #fff !important;

    span {
      font-size: 16px;
      font-weight: bolder;
      margin-right: 12px;
      vertical-align: middle;
    }

    a {
      font-weight: bold;

      img {
        width: 20px;
        height: 20px;
        border: none;
        vertical-align: middle;
      }
    }
  }

  .el-menu {
    width: 180px;
    min-height: 100%;
    border-right: none !important;
  }

  .el-menu-item {
    height: 44px;
    line-height: 44px;
    background: #161616 !important;
    color: #929299 !important;
    padding-left: 51px !important;

    &:hover, &.is-active {
      color: #34C388 !important;
      background-color: #393A3E !important;

      i {
        color: #34C388 !important;
      }
    }
  }

  .last-item {
    margin-bottom: 72px;
  }
}
</style>
