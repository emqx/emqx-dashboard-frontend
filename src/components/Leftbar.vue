<template>
  <div class="left-bar">
    <div class="bar-title">
      <div>
        <img class="logo" src="../assets/emqlogo.svg" />
      </div>
      <h3>Dashboard</h3>
    </div>
    <el-menu
      mode="vertical"
      router
      background-color="#242327"
      text-color="#A6A6A8"
      active-text-color="#34C388"
      :default-active="'/' + $route.path.split('/')[1]"
    >
      <template v-for="(menu, index) in menus">
        <el-submenu v-if="menu.children && menu.children.length > 0" :key="index" :index="`${index + 1}`">
          <template slot="title">
            <i :class="['iconfont', menu.icon]"></i>
            <el-badge :hidden="!menu.hasNew" is-dot class="menu-dot">
              {{ menu.title }}
            </el-badge>
          </template>
          <el-menu-item
            v-for="(submenu, subindex) in menu.children"
            :key="subindex"
            :index="submenu.index"
            :class="submenu.class"
          >
            <el-badge :hidden="!submenu.hasNew" is-dot class="submenu-dot">
              {{ submenu.title }}
            </el-badge>
          </el-menu-item>
        </el-submenu>
        <el-menu-item v-else-if="!menu.children" :key="index" :index="menu.index" :class="menu.class">
          <template slot="title">
            <i :class="['iconfont', menu.icon]"></i>
            <el-badge :hidden="!menu.hasNew" is-dot class="menu-dot">
              {{ menu.title }}
            </el-badge>
          </template>
        </el-menu-item>
      </template>

      <div class="bar-footer">
        <span>{{ $store.state.user.username }}</span>
        <a href="javascript:;" @click="logout">
          <img src="../assets/exit.png" />
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
  data() {
    return {
      menus: [
        {
          id: 'monitor',
          title: this.$t('leftbar.monitor'),
          icon: 'icon-jiankong',
          index: '/',
        },
        {
          id: 'clients',
          title: this.$t('leftbar.clients'),
          index: '/clients',
          icon: 'icon-guanlianshebei',
        },
        {
          id: 'topics',
          title: this.$t('leftbar.topics'),
          index: '/topics',
          icon: 'icon-zuzhiqunzu',
        },
        {
          id: 'subscriptions',
          title: this.$t('leftbar.subscriptions'),
          index: '/subscriptions',
          icon: 'icon-shebeiguanli',
        },
        {
          id: 'rule_engine',
          title: this.$t('rule.rule_engine'),
          icon: 'icon-guizeyinqing',
          children: [
            {
              id: 'rules',
              title: this.$t('leftbar.rule_engine'),
              index: '/rules',
            },
            {
              id: 'resources',
              title: this.$t('rule.resource_title'),
              index: '/resources',
            },
          ],
        },
        {
          id: 'analysis',
          title: this.$t('leftbar.analysis'),
          icon: 'icon-shujukanban',
          children: [
            {
              id: 'topic_metrics',
              title: this.$t('leftbar.topicMetrics'),
              index: '/topic_metrics',
            },
            {
              id: 'alarms',
              title: this.$t('leftbar.alarms'),
              index: '/alarms',
            },
          ],
        },
        {
          id: 'plugins',
          title: this.$t('leftbar.plugins'),
          index: '/plugins',
          icon: 'icon-kongjian',
        },
        {
          id: 'modules',
          title: this.$t('leftbar.modules'),
          index: '/modules',
          icon: 'icon-changjingguanli',
        },
        {
          id: 'tools',
          title: this.$t('leftbar.tools'),
          icon: 'icon-gongju1',
          children: [
            {
              id: 'websocket',
              title: this.$t('leftbar.websocket'),
              index: '/websocket',
            },
            {
              id: 'http_api',
              title: this.$t('leftbar.api'),
              index: '/http_api',
            },
          ],
        },
        {
          id: 'settings',
          title: this.$t('leftbar.settings'),
          index: '/settings',
          icon: 'icon-icon_shezhi',
        },
        {
          id: 'general',
          title: this.$t('leftbar.general'),
          icon: 'icon-fenzuguanli',
          children: [
            {
              id: 'applications',
              title: this.$t('leftbar.applications'),
              index: '/applications',
            },
            {
              id: 'users',
              title: this.$t('leftbar.users'),
              index: '/users',
            },
            {
              id: 'listeners',
              title: this.$t('leftbar.listeners'),
              index: '/listeners',
            },
            {
              id: 'help',
              title: this.$t('leftbar.help'),
              index: '/help',
              class: 'last-item',
            },
          ],
        },
      ],
    }
  },
  computed: {
    showFeatOnLeftbar() {
      return this.$store.state.showFeatOnLeftbar
    },
  },
  watch: {
    showFeatOnLeftbar: {
      deep: true,
      handler() {
        this.setNewFeatOnleftbar()
      },
    },
  },
  methods: {
    ...mapActions(['USER_LOGIN']),
    logout() {
      this.USER_LOGIN({ isLogOut: true })
      this.$router.push({ path: '/login' })
    },
    setNewFeatOnleftbar() {
      this.menus.forEach((menu) => {
        const { data } = this.showFeatOnLeftbar
        if (menu.children && menu.children.length > 0) {
          menu.children.forEach((submenu) => {
            if (data[submenu.id]) {
              menu.hasNew = true
              submenu.hasNew = true
            } else if (menu.hasNew && submenu.hasNew) {
              menu.hasNew = false
              submenu.hasNew = false
            }
          })
        } else if (data[menu.id]) {
          menu.hasNew = true
        } else if (menu.hasNew) {
          menu.hasNew = false
        }
      })
    },
  },
  created() {
    this.setNewFeatOnleftbar()
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
    border-bottom: 1px solid #2b2c30;
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
    border-top: 1px solid #2b2c30;
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

  .el-submenu__title {
    padding-left: 27px !important;
    height: 40px;
    line-height: 40px;
  }

  .el-submenu {
    .el-menu-item {
      width: 157px !important;
      min-width: initial;
      margin-left: 11px;
    }
  }

  .el-menu-item {
    height: 36px !important;
    line-height: 36px !important;
    background-color: #8f8e8e;
    color: #929299 !important;
    border-radius: 4px;
    width: 168px;
    margin-left: 7px;
    margin-bottom: 4px;
    margin-top: 4px;
    transition: border-color 0.3s, background-color 0.3s, color 0.3s, box-shadow 0.3s;

    &:hover {
      color: #fff !important;
      background-color: #393a3e !important;
      i {
        color: #fff !important;
      }
    }
    &.is-active {
      color: #fff !important;
      background-color: #00b173 !important;
      box-shadow: 0px 0px 5px 0px #02d48a;
      i {
        color: #fff !important;
      }
    }
  }

  .last-item {
    margin-bottom: 72px;
  }

  .menu-dot .el-badge__content.is-fixed.is-dot {
    top: 17px;
    right: 0px;
  }

  .submenu-dot .el-badge__content.is-fixed.is-dot {
    right: 3px;
    top: 14px;
  }
}
</style>
