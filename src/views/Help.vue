<template>
  <div class="help-view">
    <div class="page-title">{{ $t('leftbar.help') }}</div>

    <div class="help-item">
      <h3>{{ $t('help.quickStart') }}</h3>
      <p>{{ $t('help.emqxDesc') }}</p>
      <a target="_blank" href="https://github.com/emqx/emqx">Github</a>
    </div>

    <el-divider></el-divider>

    <div class="help-item">
      <h3>{{ $t('help.emqxEnterprise') }}</h3>
      <p v-html="$t('help.enterpriseDesc')"></p>
      <a target="_blank" :href="learnEnterprise">
        {{ $t('oper.learnMore') }}
      </a>
      <a target="_blank" :href="freeTrial">
        {{ $t('help.freeTrial') }}
      </a>
    </div>

    <el-divider></el-divider>

    <div class="help-item">
      <h3>{{ $t('help.useDocs') }}</h3>
      <p>{{ $t('help.docsDesc') }}</p>
      <a target="_blank" :href="docsLink">
        {{ $t('help.forwardView') }}
      </a>
    </div>

    <el-divider></el-divider>

    <div class="help-item">
      <h3>FAQ</h3>
      <p>{{ $t('help.faqDesc') }}</p>
      <a target="_blank" :href="faqLink">
        {{ $t('help.forwardFaq') }}
      </a>
    </div>

    <el-divider></el-divider>

    <div class="help-item">
      <h3>{{ $t('help.followUs') }}</h3>
      <a target="_blank" class="follow-link" href="https://github.com/emqx/emqx">
        <i class="iconfont icon-git"></i>
      </a>
      <a target="_blank" class="follow-link" href="https://twitter.com/emqtt">
        <i class="iconfont icon-tuite"></i>
      </a>
      <a target="_blank" class="follow-link" href="https://emqx.slack.com/">
        <i class="iconfont icon-slack"></i>
      </a>
      <a target="_blank" class="follow-link" href="https://stackoverflow.com/questions/tagged/emq">
        <i class="iconfont icon-stack-overflow"></i>
      </a>
      <a target="_blank" class="follow-link" href="https://groups.google.com/forum/#!forum/emqtt">
        <i class="iconfont icon-icons-google_groups"></i>
      </a>
      <a target="_blank" class="follow-link" href="https://www.youtube.com/channel/UCDU9GWFk8NTGiTvPx_2XskA">
        <i class="iconfont icon-youtube"></i>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'help-view',

  components: {},

  data() {
    return {
      lang: window.localStorage.getItem('language') || 'en',
    }
  },

  computed: {
    learnEnterprise() {
      return this.lang === 'zh'
        ? 'https://www.emqx.io/cn/products/enterprise'
        : 'https://www.emqx.io/products/enterprise'
    },
    freeTrial() {
      return this.lang === 'zh'
        ? 'https://www.emqx.io/cn/downloads#enterprise'
        : 'https://www.emqx.io/downloads#enterprise'
    },
    docsLink() {
      return this.lang === 'zh' ? 'https://docs.emqx.io/broker/latest/cn' : 'https://docs.emqx.cn/cn/broker/latest/'
    },
    faqLink() {
      return this.lang === 'zh'
        ? 'https://docs.emqx.cn/cn/broker/latest/faq/faq.html'
        : 'https://docs.emqx.io/en/broker/latest/faq/faq.html'
    },
  },

  methods: {},
}
</script>

<style lang="scss">
.help-view {
  width: 80%;

  .help-item {
    h3 {
      font-size: 16px;
    }

    p {
      color: #b0b0b0;
      line-height: 1.8;
    }

    a {
      margin-right: 16px;
    }

    .follow-link {
      display: inline-block;
      width: 64px;
      height: 52px;
      text-align: center;
      line-height: 52px;
      background: #232429;
      color: #9ea3b1;
      margin-bottom: 20px;
      .iconfont {
        font-size: 24px;
      }
    }
  }

  .el-divider {
    margin: 30px 0;
    background-color: #2b2c30;
  }
}

@media (max-width: 996px) {
  .help-view {
    width: 100%;
  }
}
</style>
