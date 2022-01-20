<template>
  <el-dialog :title="$t('logTrace.viewLog')" :visible.sync="showDialog" custom-class="log-dialog" fullscreen>
    <div v-loading="$store.state.loading" :element-loading-text="nextPageLoading">
      <el-row class="handler-bar">
        <el-col :span="6">
          <el-select v-model="node" class="type-select select-radius" size="medium" @change="initLog">
            <el-option v-for="item in nodes" :value="item.node" :key="item.node" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button plain type="primary" size="medium" @click="download" v-loading="$store.state.loading">
            {{ $t('logTrace.download') }}
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <div :style="{ height: initialHeight + 'px' }" class="m-container" ref="monacoContainer">
          <!-- v-if="showEditor" -->
          <monaco
            ref="monaco"
            id="log-trace"
            v-model="logContent"
            :scroll-loading="true"
            :scroll-func="scrollLoadFunc"
            lang="powershell"
            :disabled="true"
            :line-numbers-min-chars="6"
          />
        </div>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import Monaco from '~/components/Monaco.vue'
import downloadTraceLog from '~/api/downloadTraceLog'

let LOG_VIEW_POSITION = 0
let LAST_ACTIVE_SCROLL_TOP = 0
const MAX_LOG_SIZE = 5 * 1024 * 1024
const BYTE_PER_PAGE = 50 * 1024

export default {
  name: 'log-trace-detail-dialog',

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    traceName: {
      type: String,
    },
  },

  components: {
    Monaco,
  },

  data() {
    return {
      node: '',
      nodes: [],
      initialHeight: 500,
      logContent: '',
      nextPageLoading: '',
      showEditor: false,
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
    async showDialog(val) {
      if (val) {
        this.$nextTick(() => {
          this.countInitialHeight()
          this.initLog()
        })
      } else {
        this.showEditor = false
      }
    },
  },

  methods: {
    async loadNodes() {
      this.$httpGet('/nodes')
        .then((response) => {
          this.nodes = response.data
          this.node = this.nodes[0].node
        })
        .catch((error) => {
          this.$message.error(error || this.$t('error.networkError'))
        })
    },
    async scrollLoadFunc(event) {
      if (
        event.scrollTop + this.initialHeight >= event.scrollHeight &&
        event.scrollTopChanged &&
        event.scrollTop >= LAST_ACTIVE_SCROLL_TOP
      ) {
        if (LOG_VIEW_POSITION <= MAX_LOG_SIZE) {
          LAST_ACTIVE_SCROLL_TOP = event.scrollTop
          this.nextPageLoading = this.$t('logTrace.loadNextPage')
          await this.loadLog()
        } else {
          this.$messages.warning(this.$t('logTrace.tooLargeLog'))
        }
      }
    },
    initLog() {
      LOG_VIEW_POSITION = 0
      LAST_ACTIVE_SCROLL_TOP = 0
      this.logContent = ''
      this.nextPageLoading = ''
      this.loadLog()
    },
    async loadLog() {
      try {
        const params = { position: LOG_VIEW_POSITION, bytes: BYTE_PER_PAGE, node: this.node }
        const { data } = await this.$httpGet(`/trace/${this.traceName}/log`, params)
        if (data.items) {
          const { meta = {} } = data
          this.logContent += data.items
          LOG_VIEW_POSITION += meta.position || BYTE_PER_PAGE
        }
      } catch (error) {
        console.error(error)
      }
    },
    countInitialHeight() {
      const windowHeight = window.innerHeight
      const containerTop = this.$refs.monacoContainer.getBoundingClientRect().top
      this.initialHeight = Math.floor(windowHeight - containerTop - 50)
    },
    download() {
      downloadTraceLog(this.traceName)
    },
  },

  mounted() {
    this.loadNodes()
  },
}
</script>

<style lang="scss">
.log-dialog {
  .handler-bar {
    margin-top: 16px;
  }
  .el-row {
    margin-bottom: 28px;
  }
}
.dark-themes {
  .log-dialog {
    background-color: #161616;
    .el-dialog__title,
    .el-dialog__headerbtn .el-dialog__close {
      color: #fff;
    }
  }
}
</style>
