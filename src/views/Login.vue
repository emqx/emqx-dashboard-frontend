<template>
  <div class="login-view">
    <el-card>
      <div slot="header">
        {{ $t('login.title') }}
      </div>
      <el-form class="el-form--public" size="medium" label-position="top" :model="user" @keyup.enter.native="login">
        <el-form-item :label="$t('login.username')">
          <el-input
            v-model="user.username"
            :class="{ error: loginError.username }"
            :placeholder="loginError.username"
            @focus="loginError.username = ''"
          >
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('login.password')">
          <el-input
            type="password"
            v-model="user.password"
            :class="{ error: loginError.password }"
            :placeholder="loginError.password"
            @focus="loginError.password = ''"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <div class="login-footer">
        <el-checkbox v-model="remember">
          {{ $t('login.remember') }}
        </el-checkbox>
        <el-button
          type="success"
          class="confirm-btn"
          :loading="$store.state.loading"
          :disabled="$store.state.loading"
          @click="login"
          >{{ $t('login.loginButton') }}
        </el-button>
      </div>
      <div class="clear-fix"></div>
    </el-card>
  </div>
</template>

<script>
import { Col, Row, Card, Form, FormItem, Input, Checkbox, Button } from 'element-ui'
import { mapActions } from 'vuex'

export default {
  name: 'login-view',
  components: {
    'el-col': Col,
    'el-row': Row,
    'el-card': Card,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-input': Input,
    'el-checkbox': Checkbox,
    'el-button': Button,
  },
  data() {
    return {
      remember: false,
      user: {
        username: '',
        password: '',
      },
      loginError: {
        username: '',
        password: '',
      },
    }
  },
  methods: {
    ...mapActions(['USER_LOGIN']),
    login() {
      if (!this.user.username) {
        this.loginError.username = this.$t('login.usernameRequired')
        return false
      } else if (!this.user.password) {
        this.loginError.password = this.$t('login.passwordRequired')
        return false
      }
      this.$axios
        .post('/auth', this.user)
        .then(() => {
          this.USER_LOGIN({ user: this.user, remember: this.remember })
          this.$router.push(this.$route.query.redirect || '/')
        })
        .catch(() => {
          this.loginError.username = this.$t('login.error')
          this.user = {
            username: '',
            password: '',
          }
        })
    },
  },
}
</script>

<style lang="scss">
.login-view {
  width: 100%;
  height: 100%;
  background-color: #181818;
  .el-card {
    width: 420px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .el-card__header {
      font-size: 16px;
    }
  }
  .error input {
    border: 2px solid #e0b4b4;
  }
  .login-footer {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
