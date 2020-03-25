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
        <username-table></username-table>
      </template>
    </el-card>
  </div>
</template>


<script>
import {
  Breadcrumb, BreadcrumbItem, Card,
} from 'element-ui'
import UsernameTable from './components/UsernameTable'

export default {
  name: 'plugin-manage',
  components: {
    'el-breadcrumb': Breadcrumb,
    'el-breadcrumb-item': BreadcrumbItem,
    'el-card': Card,
    UsernameTable,
  },
  data() {
    return {
      pluginName: this.$route.params.pluginName,
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
