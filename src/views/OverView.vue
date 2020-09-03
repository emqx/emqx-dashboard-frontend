<template>
  <div class="overview-view">
    <div class="page-title">
      {{ $t('leftbar.overview') }}
      <el-select v-model="nodeName" class="select-radius" :placeholder="$t('select.placeholder')" @change="loadData">
        <el-option v-for="node in nodes" :key="node.node" :label="node.node" :value="node.node"> </el-option>
      </el-select>
    </div>

    <!-- Broker -->
    <div class="card-box" style="margin-top: 54px;">
      <div class="card-title">{{ $t('overview.broker') }}</div>
      <el-row class="broker-card" :gutter="10">
        <el-col :span="6">
          <div class="card-item">
            <div class="icon">
              <i class="iconfont icon-systemname"></i>
            </div>
            <div class="desc">
              <h3>{{ $t('overview.systemName') }}</h3>
              <p>{{ brokers.sysdescr }}</p>
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="card-item">
            <div class="icon">
              <i class="iconfont icon-version" style="font-weight: 600;"></i>
            </div>
            <div class="desc">
              <h3>{{ $t('overview.version') }}</h3>
              <p>{{ brokers.version }}</p>
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="card-item">
            <div class="icon">
              <i class="iconfont icon-uptime"></i>
            </div>
            <div class="desc">
              <h3>{{ $t('overview.uptime') }}</h3>
              <p>{{ brokers.uptime }}</p>
            </div>
          </div>
        </el-col>

        <el-col :span="6">
          <div class="card-item">
            <div class="icon" style="line-height: 46px;">
              <i class="iconfont icon-Systemtime" style="font-size: 36px; top: 2px;"></i>
            </div>
            <div class="desc">
              <h3>{{ $t('overview.systemTime') }}</h3>
              <p>{{ brokers.datetime }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- Nodes -->
    <div class="card-box">
      <div class="card-title">{{ $t('overview.nodes') }}({{ nodes.length }})</div>
      <el-table :data="nodes" border>
        <el-table-column prop="node" min-width="200" :label="$t('overview.name')"> </el-table-column>
        <el-table-column prop="otp_release" min-width="200" :label="$t('overview.erlangOTPRelease')"> </el-table-column>
        <el-table-column :label="$t('overview.erlangProcesses')">
          <el-table-column min-width="150" prop="process" label="(used/avaliable)">
            <template slot-scope="scope">
              {{ scope.row.process_used + ' / ' + scope.row.process_available }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="$t('overview.cpuInfo')">
          <el-table-column min-width="180" label=" (1load/5load/15load)">
            <template slot-scope="scope">
              {{ scope.row.load1 + ' / ' + scope.row.load5 + ' / ' + scope.row.load15 }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column min-width="200" :label="$t('overview.memoryInfo')">
          <el-table-column min-width="180" label=" (used/total)">
            <template slot-scope="scope">
              {{ scope.row.memory_used + ' / ' + scope.row.memory_total }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="max_fds" min-width="120" :label="$t('overview.maxFds')"> </el-table-column>
        <el-table-column min-width="120" :label="$t('overview.status')">
          <template slot-scope="props">
            <span :class="[props.row.node_status === 'Running' ? 'running' : 'stopped', 'status']">
              {{ props.row.node_status }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Stats -->
    <div class="card-box">
      <div class="card-title">{{ $t('overview.stats') }}({{ stats.length }})</div>
      <el-table :data="stats" border class="stats-table">
        <el-table-column prop="node" min-width="150" :label="$t('overview.name')"> </el-table-column>
        <el-table-column :label="$t('overview.connectionsCount')">
          <el-table-column min-width="150" label="(count/max)">
            <template slot-scope="{ row }">
              {{ row.connections_count }} / {{ row.connections_max }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="$t('overview.topicsCount')">
          <el-table-column min-width="150" label="(count/max)">
            <template slot-scope="{ row }">
              {{ row.topics_count }} / {{ row.topics_max }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="$t('overview.retainedCount')">
          <el-table-column min-width="150" label="(count/max)">
            <template slot-scope="{ row }">
              {{ row.retained_count }} / {{ row.retained_max }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="$t('overview.sessionsCount')">
          <el-table-column min-width="150" label="(count/max)">
            <template slot-scope="{ row }">
              {{ row.sessions_count }} / {{ row.sessions_max }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="$t('overview.subscriptionsCount')">
          <el-table-column min-width="150" label="(count/max)">
            <template slot-scope="{ row }">
              {{ row.subscriptions_count }} / {{ row.subscriptions_max }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="$t('overview.subscriptionsSharedCount')">
          <el-table-column min-width="150" label="(count/max)">
            <template slot-scope="{ row }">
              {{ row.subscriptions_shared_count }} / {{ row.subscriptions_shared_max }}
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>

    <!-- metrics -->
    <div class="card-box">
      <div class="card-title">{{ $t('overview.metrics') }}</div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-table :data="metrics.client">
            <el-table-column min-width="200" prop="key" :label="$t('overview.client')"> </el-table-column>
            <el-table-column sortable prop="value" label=""></el-table-column>
          </el-table>
        </el-col>

        <el-col :span="8">
          <el-table :data="metrics.delivery">
            <el-table-column min-width="160" prop="key" :label="$t('overview.delivery')"> </el-table-column>
            <el-table-column sortable prop="value" label=""></el-table-column>
          </el-table>
        </el-col>

        <el-col :span="8">
          <el-table :data="metrics.session">
            <el-table-column min-width="200" prop="key" :label="$t('overview.session')"> </el-table-column>
            <el-table-column sortable prop="value" label=""></el-table-column>
          </el-table>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-table :data="metrics.packets">
            <el-table-column min-width="200" prop="key" :label="$t('overview.packetsData')"> </el-table-column>
            <el-table-column sortable prop="value" label=""></el-table-column>
          </el-table>
        </el-col>

        <el-col :span="8">
          <el-table :data="metrics.messages">
            <el-table-column min-width="200" prop="key" :label="$t('overview.messagesData')"> </el-table-column>
            <el-table-column sortable prop="value" label=""></el-table-column>
          </el-table>
        </el-col>

        <el-col :span="8">
          <el-table :data="metrics.bytes">
            <el-table-column min-width="160" prop="key" :label="$t('overview.bytesData')"> </el-table-column>
            <el-table-column sortable prop="value" label=""></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { Select, Option, Table, TableColumn, Row, Col } from 'element-ui'
import { mapActions } from 'vuex'

export default {
  name: 'overview-view',
  components: {
    'el-select': Select,
    'el-option': Option,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-row': Row,
    'el-col': Col,
  },
  data() {
    return {
      nodeName: '',
      brokers: {},
      nodes: [],
      stats: [],
      timer: 0,
      metrics: {
        packets: [],
        messages: [],
        bytes: [],
        client: [],
        session: [],
        delivery: [],
      },
    }
  },
  methods: {
    ...mapActions(['CURRENT_NODE']),
    init() {
      // load nodes every page
      this.$httpGet('/nodes')
        .then(response => {
          // set default of select not clan
          this.nodeName = this.$store.state.nodeName || response.data[0].node
          this.nodes = response.data
          this.CURRENT_NODE(this.nodeName)
          this.refreshInterval()
        })
        .catch(error => {
          this.$message.error(error || this.$t('error.networkError'))
          setTimeout(() => {
            this.init()
          }, 1000 * 20)
        })
    },
    refreshInterval() {
      this.loadData()
      clearInterval(this.timer)
      this.timer = setInterval(this.loadData, 1000 * 10)
    },
    loadData() {
      this.CURRENT_NODE(this.nodeName)
      // nodes[]
      this.$httpGet('/nodes').then(response => {
        this.nodes = response.data.sort(($1, $2) => {
          if ($1.node === this.nodeName) {
            return -1
          }
          if ($1.uptime > $2.uptime) {
            return -1
          }
          return 1
        })
      })
      // stats[]
      this.$httpGet('/stats').then(response => {
        const { data } = response
        data.forEach(item => {
          const $item = {
            node: item.node,
            ...item.stats,
          }
          Object.entries($item).forEach(d => {
            const [k, v] = d
            const realKey = k.replace(/\./g, '_')
            item[realKey] = v
            if (k.includes('.')) {
              delete item[k]
            }
          })
        })
        this.stats = data
      })
      // brokers[]
      this.$httpGet(`/brokers/${this.nodeName}`).then(response => {
        this.brokers = response.data
      })
      // metrics[{}, {}, {}]
      this.$httpGet(`/nodes/${this.nodeName}/metrics`).then(response => {
        this.metrics = {
          packets: [],
          messages: [],
          bytes: [],
          client: [],
          session: [],
          delivery: [],
        }
        const dict = { ...response.data }
        const indexTable = {
          packets: [
            'received',
            'sent',
            'connect',
            'connack',
            'auth',
            'disconnect.sent',
            'disconnect.received',
            'pingreq',
            'pingresp',
            'publish.received',
            'publish.sent',
            'puback.received',
            'puback.sent',
            'puback.missed',
            'pubcomp.received',
            'pubcomp.sent',
            'pubcomp.missed',
            'pubrec.received',
            'pubrec.sent',
            'pubrec.missed',
            'pubrel.received',
            'pubrel.sent',
            'pubrel.missed',
            'subscribe',
            'suback',
            'unsubscribe',
            'unsuback',
          ],
          messages: [
            'received',
            'sent',
            'dropped',
            'retained',
            'qos0.received',
            'qos0.sent',
            'qos1.received',
            'qos1.sent',
            'qos2.received',
            'qos2.expired',
            'qos2.sent',
            'qos2.dropped',
          ],
          bytes: ['received', 'sent'],
          client: [
            'connected',
            'authenticate',
            'auth.anonymous',
            'check_acl',
            'subscribe',
            'unsubscribe',
            'disconnected',
          ],
          session: ['created', 'resumed', 'takeovered', 'discarded', 'terminated'],
          delivery: [
            'dropped',
            'dropped.no_local',
            'dropped.too_large',
            'dropped.qos0_msg',
            'dropped.queue_full',
            'dropped.expired',
          ],
        }
        Object.keys(indexTable).forEach(item => {
          indexTable[item].forEach(item2 => {
            const indexKey = `${item}.${item2}`
            delete dict[indexKey]
            if (response.data[indexKey] !== undefined) {
              this.metrics[item].push({ key: item2, value: response.data[indexKey] })
            }
          })
        })
        Object.keys(dict).forEach(key => {
          const item = key.split('.')[0]
          if (this.metrics[item] && dict[key] !== undefined) {
            this.metrics[item].push({
              key: key
                .split('.')
                .slice(1)
                .join('.'),
              value: dict[key],
            })
          }
        })
      })
    },
  },
  created() {
    this.init()
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer)
    next()
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
}
</script>

<style lang="scss">
.overview-view {
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  .el-select .el-input__inner {
    padding-left: 10px;
  }

  .card-box {
    position: relative;
    margin-top: 74px;

    .card-title {
      position: absolute;
      height: 24px;
      line-height: 24px;
      width: 100%;
      top: -34px;
      left: 0;
      font-size: 16px;
    }

    .el-table {
      margin-top: 0;
      .caret-wrapper {
        left: -8px;
      }
    }

    .stats-table.el-table--medium th,
    .el-table--medium td {
      padding: 4px 0;
    }

    @media screen and (max-width: 1280px) {
      .el-col-6 {
        width: 50% !important;
        margin-top: 10px !important;
      }
    }
    @media screen and (max-width: 740px) {
      .el-col-6 {
        width: 100% !important;
        margin-top: 10px !important;
      }
    }

    .broker-card {
      &.el-row {
        overflow-x: auto;
      }

      .el-col {
        .card-item {
          height: 90px;
          min-width: 250px;
          line-height: 90px;
          padding: 18px 20px 0 20px;
          border-radius: 4px;

          .icon {
            float: left;
            width: 54px;
            height: 54px;
            line-height: 50px;
            text-align: center;
            border: 2px solid;
            border-radius: 50%;

            i {
              font-size: 26px;
            }
          }

          .desc {
            line-height: normal;
            float: right;
            text-align: right;
            height: 70px;

            h3 {
              font-size: 14px;
              font-weight: bold;
            }

            p {
              margin-top: 12px;
              max-width: 150px;
            }
          }
        }
      }
    }
  }

  span {
    line-height: 10px;
  }

  .box-card {
    margin-top: 20px;
  }

  .el-row {
    margin-top: 20px;
  }

  .iconfont {
    position: relative;
  }
}
</style>
