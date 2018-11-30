<template>
  <div class="left-bar">
    <div class="bar-title">
      <img class="logo" src="../assets/emqlogo.png">
      <span>Dashboard</span>
    </div>
    <el-menu
      mode="vertical"
      unique-opened
      router
      background-color="#242327"
      text-color="#a7a7a7"
      active-text-color="#227d51"
      :default-active="'/' + $route.path.split('/')[1]">
      <!-- MONITORING -->
      <el-menu-item-group :title="$t('leftbar.monitoring')">
        <el-menu-item index="/">
          <i class="fa fa-bar-chart"></i>
          {{ $t('leftbar.overview') }}
        </el-menu-item>
        <el-menu-item index="/connections">
          <i class="fa fa-microchip"></i>
          {{ $t('leftbar.connections') }}
        </el-menu-item>
        <el-menu-item index="/sessions">
          <i class="fa fa-exchange"></i>
          {{ $t('leftbar.sessions') }}
        </el-menu-item>
        <el-menu-item index="/topics">
          <i class="fa dash-topic">
            <img src="../assets/topic-black.svg" class="black">
            <img src="../assets/topic-green.svg" class="green">
          </i>
          {{ $t('leftbar.topics') }}
        </el-menu-item>
        <el-menu-item index="/subscriptions">
          <i class="fa fa-rss-square"></i>
          {{ $t('leftbar.subscriptions') }}
        </el-menu-item>
      </el-menu-item-group>

      <!-- MANAGEMENT -->
      <el-menu-item-group :title="$t('leftbar.management')">
        <el-menu-item index="/plugins">
          <i class="fa fa-plug"></i>
          {{ $t('leftbar.plugins') }}
        </el-menu-item>
        <el-menu-item index="/listeners">
          <i class="fa fa-superpowers"></i>
          {{ $t('leftbar.listeners') }}
        </el-menu-item>
        <!--&lt;!&ndash; 资源 &ndash;&gt;-->
        <!--<el-menu-item index="/resource">-->
        <!--<i class="fa fa-server"></i>-->
        <!--资源-->
        <!--</el-menu-item>-->

        <!--<el-menu-item index="/auth">-->
        <!--<i class="fa fa-universal-access"></i>-->
        <!--认证规则-->
        <!--</el-menu-item>-->

        <!--&lt;!&ndash; 消息规则 &ndash;&gt;-->
        <!--<el-menu-item index="/rule">-->
        <!--<i class="fa fa-random"></i>-->
        <!--消息规则-->
        <!--</el-menu-item>-->

        <!--<el-menu-item index="/trigger">-->
        <!--<i class="fa fa-level-down"></i>-->
        <!--触发器-->
        <!--</el-menu-item>-->
      </el-menu-item-group>

      <!-- TOOLS -->
      <el-menu-item-group :title="$t('leftbar.tools')">
        <el-menu-item index="/websocket">
          <i class="fa fa-html5"></i>
          {{ $t('leftbar.websocket') }}
        </el-menu-item>
        <el-menu-item index="/http_api">
          <i class="fa fa-code"></i>
          {{ $t('leftbar.api') }}
        </el-menu-item>
      </el-menu-item-group>

      <!-- APPLICATIONS -->
      <el-menu-item-group :title="$t('leftbar.applications')">
        <el-menu-item index="/applications">
          <i class="fa fa-archive"></i>
          {{ $t('leftbar.applications') }}
        </el-menu-item>
      </el-menu-item-group>

      <!-- ADMIN -->
      <el-menu-item-group :title="$t('leftbar.admin')">
        <el-menu-item index="/users">
          <i class="fa fa-user-o"></i>
          {{ $t('leftbar.users') }}
        </el-menu-item>
        <el-menu-item index="/settings" class="last-item">
          <i class="fa fa-cog"></i>
          {{ $t('leftbar.settings') }}
        </el-menu-item>
      </el-menu-item-group>

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
  width: 200px;
  z-index: 1002;
  overflow-y: auto;
  overflow-x: hidden;
  padding-top: 56px;
  background-color: #242327;
  .el-menu {
    width: 200px;
    min-height: 100%;
    border-right: none !important;
  }
  .bar-title {
    position: fixed;
    top: 0;
    z-index: 1003;
    padding-left: 20px;
    height: 55px;
    line-height: 55px;
    width: 180px;
    border-bottom: 1px solid #161616;
    color: #fff !important;
    background-color: #242327;
    span {
      font-size: 16px;
      margin-left: 8px;
    }
    img {
      margin-top: 6px;
      width: 48px;
      height: 42px;
      float: left;
    }
  }
  .bar-footer {
    position: absolute;
    bottom: 0;
    width: 180px;
    z-index: 1003;
    padding-left: 20px;
    height: 47px;
    line-height: 47px;
    border-top: 1px solid #161616;
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
  .el-menu-item {
    height: 40px;
    line-height: 40px;
    i {
      color: #6e6e75 !important;
    }
    &:hover, &.is-active {
      color: #227d51 !important;
      background-color: #37363b !important;
      i {
        color: #227d51 !important;
      }
    }
  }
  .last-item {
    margin-bottom: 72px;
  }
  .el-menu-item-group__title {
    font-weight: bolder;
    margin-bottom: 10px;
    margin-top: 15px;
    font-size: 14px;
  }
  i {
    width: 20px;
  }
  .dash-topic img {
    position: absolute;
    top: 12px;
    width: 14px;
    height: 15px;
    &.green {
      display: none;
    }
    .black {
      display: block;
    }
  }
  .el-menu-item-group__title {
    color: #fff !important;
  }
  .is-active, .el-menu-item:hover {
    & > .dash-topic {
      .black {
        display: none;
      }
      .green {
        display: block;
      }
    }
  }
}
</style>
