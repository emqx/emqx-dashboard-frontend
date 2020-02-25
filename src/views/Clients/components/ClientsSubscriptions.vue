<template>
  <div class="clients-subscriptions">
    <el-card class="el-card--self tabs-card">

      <el-row>
        <el-col class="card-subtitle" :span="12">
          {{ this.$t('clients.currentSubs') }}
        </el-col>

        <el-col class="oper-btn-group" :span="12">
          <el-button
            size="mini"
            type="success"
            icon="el-icon-refresh"
            plain
            @click="reload">
            {{ $t('oper.refresh') }}
          </el-button>
          <el-button
            size="mini"
            type="success"
            icon="el-icon-plus"
            plain
            @click="open">
            {{ $t('clients.addSubs') }}
          </el-button>
        </el-col>
      </el-row>

      <el-table class="client-sub-table" v-loading="$store.state.loading" border :data="tableData">
        <el-table-column prop="topic" :label="$t('subscriptions.topic')"></el-table-column>
        <el-table-column prop="qos" :label="$t('subscriptions.qoS')"></el-table-column>
        <el-table-column width="120px" :label="$t('oper.oper')">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              type="danger"
              plain
              @click="handleUnsub(row)">
              {{ $t('oper.unsubscribe') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      :title="$t('clients.addSubs')"
      width="400px"
      :visible.sync="addVisible"
      class="create-subscribe"
      @keyup.enter.native="handleAdd">
      <el-form
        ref="record"
        class="el-form--public"
        :model="record"
        :rules="rules"
        size="small"
        label-position="top">
        <el-form-item prop="topic" :label="$t('subscriptions.topic')">
          <el-input v-model="record.topic" placeholder="Topic"></el-input>
        </el-form-item>
        <el-form-item prop="qos" label="QoS">
          <emq-select
            class="el-select--public"
            popper-class="el-select--public"
            v-model="record.qos"
            size="small"
            :field="{ list: [0, 1, 2] }">
          </emq-select>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button
          type="text"
          class="cache-btn"
          @click="close">
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button
          type="success"
          class="confirm-btn"
          :loading="$store.state.loading"
          @click="handleAdd">
          {{ $t('oper.add') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import EmqSelect from '~/components/EmqSelect'

export default {
  name: 'clients-subscriptions',

  components: {
    EmqSelect,
  },

  props: {
    clientId: {
      type: String,
      required: true,
    },
    tableData: {
      type: Array,
      required: true,
    },
    reload: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      addVisible: false,
      record: {
        topic: '',
        qos: 0,
      },
      rules: {
        clientid: {
          required: true,
          message: this.$t('oper.pleaseEnter'),
        },
        topic: {
          required: true,
          message: this.$t('oper.pleaseEnter'),
        },
      },
    }
  },

  methods: {
    handleUnsub(row) {
      this.$msgbox.confirm(this.$t('oper.unsubscribeConfirm'), this.$t('oper.warning'), {
          type: 'warning',
        }).then(() => {
        const { topic, clientid } = row
        const body = {
          topic,
          clientid,
        }
        this.$httpPost('/mqtt/unsubscribe', body).then(() => {
          this.reload()
        }).catch(() => {})
      }).catch(() => {})
    },
    open() {
      this.addVisible = true
      this.record.clientid = this.clientId
    },
    handleAdd() {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        const body = {}
        Object.assign(body, this.record)
        this.$httpPost('/mqtt/subscribe', body).then(() => {
          this.close()
          this.reload()
        }).catch(() => {})
      })
    },
    close() {
      this.$refs.record.resetFields()
      this.addVisible = false
    },
  },
}
</script>


<style lang="scss">
.clients-subscriptions {
  .oper-btn-group {
    text-align: right;
    margin: 24px 0;
  }
  .client-sub-table {
    margin-bottom: 24px;
  }
  .el-select--public {
    width: 100%;

    .el-input__inner {
      height: 32px !important;
      line-height: 32px !important;
    }
  }
}
</style>
