<template>
  <el-dialog
    width="800px"
    :title="$t('logTrace.createLog')"
    :visible.sync="showDialog"
    class="create-log-trace"
    @keyup.enter.native="submit"
  >
    <el-form class="el-form--public" ref="formCom" size="medium" label-position="top" :model="record" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('logTrace.name')" prop="name">
            <el-input v-model="record.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('logTrace.type')" prop="type">
            <el-select v-model="record.type" class="el-select--public type-select" popper-class="el-select--public">
              <el-option v-for="{ value, label } in typeOptions" :key="value" :value="value" :label="label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="record.type === 'topic'">
          <el-form-item label="Topic" prop="topic">
            <el-input v-model="record.topic" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="record.type === 'clientid'">
          <el-form-item label="ClientID" prop="clientid">
            <el-input v-model="record.clientid" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="record.type === 'ip_address'">
          <el-form-item label="IP Address" prop="ip_address">
            <el-input v-model="record.ip_address" />
          </el-form-item>
        </el-col>
        <el-col :span="12" style="clear: both">
          <el-form-item :label="$t('logTrace.startEndTime')" prop="startTime">
            <el-date-picker
              type="datetimerange"
              class="range-datepicker"
              :start-placeholde="$t('logTrace.startTime')"
              :end-placeholde="$t('logTrace.endTime')"
              v-model="record.startTime"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer">
      <el-button type="text" class="cache-btn" @click="cancel">
        {{ $t('oper.cancel') }}
      </el-button>
      <el-button type="success" class="confirm-btn" :loading="$store.state.loading" @click="submit">
        {{ $t('oper.add') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
const typeOptions = [
  {
    value: 'clientid',
    label: 'ClientID',
  },
  {
    value: 'topic',
    label: 'Topic',
  },
  {
    value: 'ip_address',
    label: 'IP Address',
  },
]

const createRawForm = () => ({
  name: '',
  type: typeOptions[0].value,
  clientid: '',
  ip_address: '',
  topic: '',
  startTime: [],
})

export default {
  name: 'create-log-trace-dialog',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    const nameValidator = (rule, value, callback) => {
      if (/[\w-]+/.test(value)) {
        callback()
      } else {
        callback(new Error(this.$t('logTrace.validString')))
      }
    }
    const needStartTime = this.$t('logTrace.needStartTime')
    return {
      typeOptions,
      record: createRawForm(),
      rules: {
        name: [
          { required: true, messages: this.$t('oper.pleaseEnter') },
          { validator: nameValidator, trigger: ['blur', 'change'] },
        ],
        topic: [{ required: true, messages: this.$t('oper.pleaseEnter') }],
        clientid: [{ required: true, messages: this.$t('oper.pleaseEnter') }],
        ip_address: [{ required: true, messages: this.$t('oper.pleaseEnter') }],
        startTime: [
          {
            validator(r, v, cb) {
              v && v[0] && v[1] ? cb() : cb(new Error(needStartTime))
            },
          },
        ],
      },
    }
  },

  computed: {
    showDialog: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },

  watch: {
    showDialog(val) {
      if (val) {
        this.record = createRawForm()
        this.$nextTick(() => {
          this.$refs.formCom.clearValidate()
        })
      }
    },
  },

  methods: {
    getDataToSubmit() {
      const { clientid, ip_address, name, topic, type, startTime } = this.record
      let targetInfo = {}
      switch (type) {
        case typeOptions[0].value:
          targetInfo = { clientid, type }
          break
        case typeOptions[1].value:
          targetInfo = { topic, type }
          break
        case typeOptions[2].value:
          targetInfo = { ip_address, type }
          break
        default:
          break
      }
      const bodyToSend = {
        name,
        ...targetInfo,
        start_at: new Date(startTime[0]).toISOString(),
        end_at: new Date(startTime[1]).toISOString(),
      }
      return bodyToSend
    },
    async submit() {
      await this.$refs.formCom.validate()
      try {
        await this.$httpPost('/trace', this.getDataToSubmit())
        this.$message.success(this.$t('logTrace.createSuc'))
        this.$emit('submitted')
        this.showDialog = false
      } catch (error) {
        console.error(error)
      }
    },
    cancel() {
      this.showDialog = false
    },
  },
}
</script>

<style lang="scss">
.create-log-trace {
  .type-select {
    width: 100%;
  }
  .range-datepicker {
    width: 100%;
  }
}
</style>
