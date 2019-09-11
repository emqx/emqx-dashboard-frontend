<template>
  <div class="clients-view">
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/clients' }">
          {{ $t('leftbar.clients') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-name">
          {{ $t('clients.view') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="client-dropdown">
      <span>{{ clientId }}</span>
      <el-dropdown trigger="click" @command="handleCommand">
        <span :class="['el-dropdown-link', basicRecord.connected ? 'connected' : 'disconnected']">
          <span class="online">{{  basicRecord.connected ? $t('oper.online') : $t('oper.offline') }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command="handleDisconnect"
            :disabled="!basicRecord.connected">
            {{ $t('websocket.disconnect') }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-tabs class="normal-tabs" v-model="activeName" type="card">
      <el-tab-pane :label="$t('clients.basicInfo')" name="basic">
        <clients-basic :record="basicRecord">
        </clients-basic>
      </el-tab-pane>
      <el-tab-pane :label="$t('clients.subsInfo')" name="subscription">
        <clients-subscriptions
          :clientId="clientId"
          :tableData="subscriptionsData"
          :reload="loadSubscription">
        </clients-subscriptions>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
import ClientsBasic from './components/ClientsBasic'
import ClientsSubscriptions from './components/ClientsSubscriptions'

export default {
  name: 'clients-view',

  components: {
    ClientsBasic,
    ClientsSubscriptions,
  },

  data() {
    return {
      activeName: 'basic',
      basicRecord: {},
      subscriptionsData: [],
    }
  },

  computed: {
    clientId() {
      return this.$route.params.id
    }
  },

  created() {
    this.loadBasicData()
    this.loadSubscription()
  },

  watch: {
    activeName(val) {
      if (val === 'basic') {
        this.loadBasicData()
      } else if (val === 'subscription') {
        this.loadSubscription()
      }
    },
  },

  methods: {
    handleCommand(command) {
      this[command]()
    },
    handleDisconnect() {
      this.$confirm(this.$t('oper.confirmDisconnect'), this.$t('oper.warning'), {
        confirmButtonClass: 'confirm-btn',
        cancelButtonClass: 'cache-btn el-button--text',
        type: 'warning',
      }).then(() => {
        this.$httpDelete(`/clients/${this.clientId}`).then(() => {
          this.$message.success(this.$t('oper.disconnectSuccess'))
          this.$set(this.basicRecord, 'connected', false)
        }).catch((error) => {
          this.$message.error(error || this.$t('error.networkError'))
        })
      }).catch(() => {})
    },
    loadBasicData() {
      this.$httpGet(`/clients/${this.clientId}`).then((res) => {
        this.basicRecord = res.data[0]
      }).catch(() => {})
    },
    loadSubscription() {
      this.$httpGet(`/subscriptions/${this.clientId}`).then((res) => {
        this.subscriptionsData = res.data
      }).catch(() => {})
    },
  },
}
</script>


<style lang="scss">
.clients-view {
  .client-dropdown {
    float: right;
    margin-top: -32px;
    color: #ADAFB4;

    .el-dropdown-link {
      .online {
        margin-left: 20px;
      }
      .el-icon-arrow-down {
        font-weight: 600;
      }
    }
  }
  .el-card.tabs-card {
    border-radius: 0 0 4px 4px;
  }
  .el-card .el-card__body {
    padding: 10px 36px;
  }
  .card-subtitle {
    color: #F8F8F8;
    font-size: 14px;
    margin: 24px 0;
  }
}
</style>
