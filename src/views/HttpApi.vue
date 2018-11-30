<template>
  <div class="http-api">
    <div class="page-title">
      {{ $t('leftbar.api') }}
    </div>
    <el-card class="el-card--self">
      <div slot="header">
        <span>{{ $t('httpApi.introduction') }}</span>
      </div>
      <div class="desc--text" v-html="$t('httpApi.desc')"></div>
    </el-card>
    <el-card class="el-card--self">
      <div slot="header">
        <span v-if="!responseDate">{{ $t('httpApi.reference') }}</span>
        <el-button
          v-if="responseDate"
          type="text"
          class="refresh-btn"
          @click="loadResponse(null, false)">
          <i class="el-icon-arrow-left"></i>
          {{ $t('httpApi.back') }}
        </el-button>
      </div>
      <el-table border v-if="!responseDate" v-loading="$store.state.loading" :data="tableData">
        <el-table-column prop="method" width="120" :label="$t('httpApi.method')"></el-table-column>
        <el-table-column min-width="160" :label="$t('httpApi.path')">
          <template slot-scope="props">
            <a
              href="javascript:;"
              :class="['link', isLink(props.row) ? '' : 'link-disabled']"
              @click="loadResponse(props.row)">
              {{ props.row.path }}
            </a>
          </template>
        </el-table-column>
        <el-table-column min-width="240" :label="$t('httpApi.description')">
          <template slot-scope="props">
            <div v-html="props.row.description"></div>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="responseDate"
        class="response-container">
        <div class="response-header">
          <h3>{{ $t('httpApi.linkAddress') }} :
            <a href="javascript:;">{{ uri }}</a>
          </h3>
          <h3>{{ $t('httpApi.data') }} :</h3>
        </div>
        <div v-html="jsonFormatter" class="response.body"></div>
      </div>
    </el-card>
  </div>
</template>


<script>
import { Button, Table, TableColumn, Card } from 'element-ui'

export default {
  name: 'http-api',
  components: {
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-card': Card,
  },
  data() {
    return {
      popoverVisible: false,
      nodeName: 'emq@127.0.0.1',
      tableData: [],
      nodes: [],
      responseDate: null,
      scrollTop: 0,
      uri: '',
    }
  },
  computed: {
    jsonFormatter() {
      let json = JSON.stringify(this.responseDate, null, '\t')
      json = json.replace(/\n/g, '<br />')
      json = json.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
      return json
    },
  },
  watch: {
    nodeInfo: 'setApiData',
  },
  methods: {
    isLink(row = {}) {
      // could click
      return row.target && row.target.indexOf(':') === -1
    },
    init() {
      const currentNodeName = this.$store.state.nodeName
      this.$httpGet('/nodes').then((response) => {
        this.nodeName = currentNodeName || response.data[0].name
        this.nodes = response.data
        this.setApiData()
      }).catch((error) => {
        this.$message.error(error || this.$t('error.networkError'))
      })
    },
    loadResponse(props, isLoad = true) {
      if (!isLoad) {
        this.responseDate = null
        document.documentElement.scrollTop = this.scrollTop
        return
      }
      if (!this.isLink(props)) {
        return
      }
      this.uri = `/api/v3${props.target}`
      this.scrollTop = document.documentElement.scrollTop
      document.documentElement.scrollTop = 0
      switch (props.method) {
        case 'GET':
          this.$httpGet(props.target).then(this.handleSuccess).catch(this.handleError)
          break
        case 'POST':
          this.$httpPost(props.target).then(this.handleSuccess).catch(this.handleError)
          break
        case 'PUT':
          this.$httpPut(props.target).then(this.handleSuccess).catch(this.handleError)
          break
        default:
          this.responseDate = null
          break
      }
    },
    handleSuccess(response) {
      this.responseDate = response.data
    },
    handleError(error) {
      this.$message.error(error || this.$t('error.networkError'))
    },
    setApiData() {
      this.$httpGet('/').then((response) => {
        this.tableData = []
        let data = JSON.stringify(response.data)
        data = data.replace(/:node/g, this.nodeName)
        data = JSON.parse(data)
        Object.keys(data).forEach((item) => {
          this.tableData.push({
            method: data[item].method,
            path: `/api/v3${data[item].path.startsWith('/') ? data[item].path : `/${data[item].path}`}`,
            target: data[item].path,
            description: data[item].descr,
          })
        })
      })
    },
  },
  created() {
    this.init()
  },
}
</script>


<style lang="scss">
.http-api {
  margin-top: 0 !important;
  .link-disabled {
    cursor: not-allowed;
  }
  .el-card {
    margin-top: 24px;
  }
  .el-table {
    border-width: 0 !important;
  }
  .refresh-btn {
    cursor: pointer;
    font-size: 16px;
    padding: 0 !important;
  }
  .response-container {
    line-height: 1.5;
    h3 {
      font-size: 14px !important;
    }
    a {
      margin-left: 12px;
    }
  }
}
</style>
