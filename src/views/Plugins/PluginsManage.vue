<template>
  <div class="plugin-manage">
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/plugins' }">{{ $t('leftbar.plugins') }}</el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-name">{{ pluginName }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card class="el-card--self" v-loading="$store.state.loading">
      <template v-if="pluginName === 'emqx_auth_username'">
        <auth-username-table></auth-username-table>
      </template>
      <template v-if="pluginName === 'emqx_auth_clientid'">
        <auth-clientId-table></auth-clientId-table>
      </template>
      <template v-if="pluginName === 'emqx_auth_jwt'">
        <generate-JWT></generate-JWT>
      </template>
    </el-card>
  </div>
</template>


<script>
import {
  Breadcrumb, BreadcrumbItem, Card,
} from 'element-ui'
import AuthUsernameTable from './components/AuthUsernameTable'
import AuthClientIdTable from './components/AuthClientIdTable'
import GenerateJWT from './components/GenerateJWT'

export default {
  name: 'plugin-manage',
  components: {
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
    'el-card': Card,
    AuthUsernameTable,
    AuthClientIdTable,
    GenerateJWT,
  },
  data() {
    return {
      pluginName: this.$route.params.pluginName,
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.pluginName === 'emqx_auth_jwt') {
      this.$confirm(this.$t('plugins.leaveTokenPage'), this.$t('oper.warning'), {
        confirmButtonClass: 'confirm-btn',
        cancelButtonClass: 'cache-btn el-button--text',
        type: 'warning',
      }).then(() => {
        next()
      }).catch(() => {
      })
    } else {
      next()
    }
  },
}
</script>


<style lang="scss">
.plugin-manage {
  .page-title {
    text-transform: initial;
  }
  .el-card {
    margin-top: 24px;
    min-height: 150px;
    .config-null {
      text-align: center;
      margin: 20px auto;
    }
  }
}
</style>
