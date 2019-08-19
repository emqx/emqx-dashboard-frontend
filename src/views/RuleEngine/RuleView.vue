<template>
  <div class="rule-view">
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/rules' }">
          {{ $t('rule.message_rule') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-name">{{ id }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>


    <el-card class="el-card--self">
      <div slot="header" class="config-dialog">
        {{ $t('rule.basic_info') }}
      </div>

      <el-form
        :model="record"
        label-position="left"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item :label="$t('rule.trigger_events')">
          <span>{{ record.for.join(',') }}</span>
        </el-form-item>

        <el-form-item :label="$t('rule.description')">
          <span>{{ record.description }}</span>
        </el-form-item>

        <el-form-item :label="$t('rule.rule_sql')">
          <code>{{ record.rawsql }}</code>
        </el-form-item>

      </el-form>

    </el-card>


    <el-card class="el-card--self">
      <div slot="header" class="config-dialog">
        {{ $t('rule.metrics') }}
      </div>
      <el-table border :data="record.metrics">
        <el-table-column prop="node" :label="$t('rule.node')"></el-table-column>
        <el-table-column prop="matched" sortable :label="$t('rule.rule_matched_1')"></el-table-column>
        <el-table-column prop="speed" sortable :label="$t('rule.speed_current')"></el-table-column>
        <el-table-column prop="speed_max" :label="$t('rule.speed_max_1')"></el-table-column>
        <el-table-column prop="speed_last5m" :label="$t('rule.speed_last5m_1')"></el-table-column>
      </el-table>
    </el-card>

    <el-card class="el-card--self">
      <div slot="header" class="config-dialog">
        {{ $t('rule.set_action') }}
      </div>

      <rule-actions
        :record="record"
        :operations="[]">
      </rule-actions>
    </el-card>
  </div>
</template>


<script>
import RuleActions from './components/RuleActions'

export default {
  name: 'RuleView',

  components: { RuleActions },

  props: {},

  data() {
    return {
      record: {
        actions: [
          {
            id: 'inspect_1562305995013447740',
            metrics: [
              {
                failed: 0,
                node: 'emqx@127.0.0.1',
                success: 0,
              },
            ],
            name: 'inspect',
            params: {},
          },
        ],
        description: '',
        enabled: true,
        for: [
          'message.publish',
        ],
        id: 'rule:b35e3e59',
        metrics: [
          {
            matched: 0,
            node: 'emqx@127.0.0.1',
            speed: 0,
            speed_last5m: 0,
            speed_max: 0,
          },
        ],
        rawsql: 'SELECT\n  *\nFROM\n  "message.publish"\nWHERE\n  topic =~ \'#\'',
      },
    }
  },

  methods: {
    async loadData() {
      if (!this.id) {
        return
      }
      const data = await this.$httpGet(`/rules/${this.id}`)
      this.record = data.data
    },
  },

  created() {
    this.loadData()
  },

  computed: {
    id() {
      return this.$route.params.id
    },
  },
}
</script>


<style lang="scss">
.rule-view {
  .el-card {
    margin-top: 24px;
    min-height: 150px;
  }

  .page-title .el-breadcrumb {
    text-transform: none;
  }
}
</style>
