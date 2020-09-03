<template>
  <div class="settings-view">
    <div class="page-title">{{ $t('leftbar.settings') }}</div>

    <el-card class="el-card--self">
      <el-row :gutter="20">
        <el-form ref="options" :model="options" label-width="100px" label-position="top">
          <el-col :span="12">
            <el-form-item :label="$t('settings.themes')">
              <el-radio-group v-model="options.themes" @change="themesToggle">
                <el-radio label="dark-themes">Dark</el-radio>
                <el-radio label="light-themes">Light</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :label="$t('settings.language')">
              <el-radio-group v-model="options.language">
                <el-radio label="en">EN</el-radio>
                <el-radio label="zh">中文</el-radio>
                <el-radio label="ja">日本語</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col class="operation-area" :span="24">
            <el-form-item>
              <el-button class="confirm-btn" type="success" :disabled="notChanged" @click="applySetting">
                {{ $t('settings.apply') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { Radio, RadioGroup, Button, Form, FormItem, Row, Col, Card } from 'element-ui'

import { setThemes } from '../common/themes'

export default {
  name: 'settings-view',
  components: {
    'el-radio': Radio,
    'el-radio-group': RadioGroup,
    'el-button': Button,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-row': Row,
    'el-col': Col,
    'el-card': Card,
  },
  data() {
    return {
      options: {
        themes: '', // true: dark
        language: '', // true: en
      },
      defaultConfig: '',
      defaultThemes: '',
      defaultLanguage: '',
    }
  },
  computed: {
    notChanged() {
      return this.defaultConfig === JSON.stringify(this.options)
    },
  },
  methods: {
    init() {
      let currentThemes = window.localStorage.getItem('themes') || 'dark-themes'
      currentThemes = currentThemes === 'light-themes' ? 'light-themes' : 'dark-themes'
      this.options.themes = currentThemes
      this.defaultThemes = currentThemes
      this.options.language = window.localStorage.getItem('language') || 'en'
      this.options.language = ['zh', 'en', 'ja'].includes(this.options.language) ? this.options.language : 'en'
      this.defaultLanguage = this.options.language
      this.defaultConfig = JSON.stringify(this.options)
    },
    // toggle theme
    themesToggle() {
      setThemes(this.options.themes)
    },
    applySetting() {
      this.$message.success(this.$t('settings.success'))
      this.themesToggle()
      this.defaultThemes = this.options.themes
      window.localStorage.setItem('language', this.options.language)
      window.localStorage.setItem('themes', this.options.themes)
      if (this.defaultLanguage !== this.options.language) {
        setTimeout(() => {
          location.reload()
        }, 600)
      }
      this.defaultConfig = JSON.stringify(this.options)
    },
  },
  created() {
    this.init()
  },
  beforeRouteLeave(to, from, next) {
    if (this.defaultThemes !== this.options.themes) {
      setThemes(this.defaultThemes)
    }
    next()
  },
}
</script>

<style lang="scss">
.settings-view {
  .el-card {
    margin-top: 24px;
  }
  .el-switch {
    &.is-checked {
      .el-switch__core {
        background-color: #42d885;
        border-color: #42d885;
      }
    }
  }
  .confirm-btn {
    .el-form-item {
      margin-bottom: 4px !important;
    }
  }
}
</style>
