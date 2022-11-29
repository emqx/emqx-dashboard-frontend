<template>
  <div class="users-view">
    <div class="page-title">
      {{ $t('leftbar.users') }}
      <el-button
        class="confirm-btn"
        round
        plain
        type="success"
        icon="el-icon-plus"
        size="medium"
        style="float: right"
        :disabled="$store.state.loading"
        @click="handleOperation(true)"
      >
        {{ $t('users.newUser') }}
      </el-button>
    </div>

    <el-table v-loading="$store.state.loading" border :data="users">
      <el-table-column prop="username" :label="$t('users.username')"> </el-table-column>
      <el-table-column prop="tags" :label="$t('users.remark')"> </el-table-column>
      <el-table-column width="140" :label="$t('oper.oper')">
        <template slot-scope="{ row, $index, _self }">
          <el-button size="mini" type="warning" plain @click="handleOperation(false, row)">
            {{ $t('oper.edit') }}
          </el-button>
          <el-popover :ref="`popover-${$index}`" placement="right" trigger="click">
            <p>{{ $t('oper.confirmDelete') }}</p>
            <div style="text-align: right">
              <el-button size="mini" type="text" class="cache-btn" @click="_self.$refs[`popover-${$index}`].doClose()">
                {{ $t('oper.cancel') }}
              </el-button>
              <el-button size="mini" type="success" @click="deleteUser(row, $index, _self)">
                {{ $t('oper.confirm') }}
              </el-button>
            </div>
            <el-button
              slot="reference"
              v-show="row.username !== 'admin' && username !== row.username"
              size="mini"
              type="danger"
              plain
            >
              {{ $t('oper.delete') }}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      width="500px"
      :visible.sync="dialogVisible"
      :title="oper === 'new' ? $t('users.newUser') : $t('users.editUser')"
      :show-close="!isForChangeDefaultPwd"
      :close-on-click-modal="!isForChangeDefaultPwd"
      :close-on-press-escape="!isForChangeDefaultPwd"
      @keyup.enter.native="createUser"
    >
      <el-form class="el-form--public" ref="record" label-position="top" size="medium" :model="record" :rules="rules">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="username" :label="$t('users.username')">
              <el-input v-model="record.username" :disabled="oper === 'edit'"></el-input>
            </el-form-item>
          </el-col>
          <!-- create new User -->
          <el-col v-if="oper === 'new'" :span="24">
            <el-form-item prop="password" :label="$t('users.password')">
              <el-input v-model="record.password" type="password"></el-input>
            </el-form-item>
          </el-col>
          <div v-if="changePassword && oper === 'edit'">
            <el-col :span="24">
              <el-form-item prop="password" :label="$t('users.oldPassword')">
                <el-input v-model="record.password" type="password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="newPassword" :label="$t('users.newPassword')">
                <el-input v-model="record.newPassword" type="password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="repeatPassword" :label="$t('users.confirmNewPassword')">
                <el-input v-model="record.repeatPassword" type="password"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <el-col :span="24">
            <el-form-item prop="tags" :label="$t('users.remark')">
              <el-input v-model="record.tags"></el-input>
            </el-form-item>
          </el-col>
          <!-- toggle-btn -->
          <el-col :span="24">
            <el-form-item>
              <el-button
                v-if="oper === 'edit' && !isForChangeDefaultPwd"
                class="cache-btn change-password"
                type="text"
                @click="changePassword = !changePassword"
              >
                {{ changePassword ? $t('users.dontChangePassword') : $t('users.changePassword') }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button v-if="!isForChangeDefaultPwd" type="text" class="cache-btn" @click="dialogVisible = false">
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button type="success" class="confirm-btn" :loading="$store.state.loading" @click="createUser">
          {{ $t('oper.save') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Dialog, Input, Button, Table, TableColumn, Popover, Form, FormItem, Row, Col } from 'element-ui'
import { mapActions } from 'vuex'
import changeDefaultPwd from '~/mixins/changeDefaultPwd'

export default {
  name: 'users-view',

  mixins: [changeDefaultPwd],

  components: {
    'el-dialog': Dialog,
    'el-input': Input,
    'el-button': Button,
    'el-table': Table,
    'el-table-column': TableColumn,
    'el-popover': Popover,
    'el-form': Form,
    'el-form-item': FormItem,
    'el-row': Row,
    'el-col': Col,
  },

  props: {
    isForChangeDefaultPwd: {
      type: Boolean,
    },
  },

  data() {
    const checkRepeatPassword = (rule, value, callback) => {
      if (value !== this.record.newPassword) {
        callback(new Error(this.$t('users.passwordInconsistent')))
      } else {
        callback()
      }
    }
    const newPwdSameConfirm = (rule, value, callback) => {
      if (value === this.record.password) {
        callback(new Error(this.$t('users.noSameNewPwd')))
      } else {
        callback()
      }
    }
    return {
      changePassword: false,
      dialogVisible: false,
      oper: 'new',
      users: [],
      record: {
        username: '',
        password: '',
        newPassword: '',
        repeatPassword: '',
        tags: '',
      },
      rules: {
        username: [
          { required: true, message: this.$t('users.usernameRequired') },
          { min: 2, max: 32, message: this.$t('users.usernameIllegal'), trigger: 'change' },
        ],
        tags: [{ required: true, message: this.$t('users.remarkRequired') }],
        password: [
          { required: true, message: this.$t('users.passwordRequired') },
          { min: 3, max: 255, message: this.$t('users.passwordIllegal'), trigger: 'change' },
        ],
        newPassword: [
          { required: true, message: this.$t('users.passwordRequired') },
          { min: 3, max: 255, message: this.$t('users.passwordIllegal'), trigger: 'change' },
          { validator: newPwdSameConfirm, trigger: 'blur' },
        ],
        repeatPassword: [
          { required: true, message: this.$t('users.passwordRequired') },
          { validator: checkRepeatPassword, trigger: 'change' },
        ],
      },
    }
  },

  computed: {
    username() {
      return this.$store.state.user.username
    },
    currentUserName() {
      return this.$store.state.user.username
    },
  },

  methods: {
    ...mapActions(['USER_LOGIN']),
    handleOperation(create = true, row) {
      this.changePassword = false
      this.dialogVisible = true
      if (create) {
        this.oper = 'new'
        this.record = {
          username: '',
          password: '',
          newPassword: '',
          repeatPassword: '',
          tags: 'viewer',
        }
        setTimeout(() => {
          this.$refs.record.clearValidate()
        }, 10)
      } else {
        this.oper = 'edit'
        this.record = { ...row }
        this.$set(this.record, 'password', '')
      }
    },
    async loadData() {
      try {
        const { data } = await this.$httpGet('/users')
        this.users = data
      } catch (error) {
        this.$message.error(error || this.$t('error.networkError'))
      }
    },
    createUser() {
      if (this.oper === 'edit') {
        this.updateUser()
        return
      }
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        this.$httpPost('/users', this.record)
          .then(() => {
            this.$message.success(`${this.$t('users.createUser')}`)
            this.loadData()
            this.dialogVisible = false
          })
          .catch((error) => {
            this.$message.error(error || this.$t('error.networkError'))
          })
      })
    },
    updateUser() {
      this.$refs.record.validate((valid) => {
        if (!valid) {
          return
        }
        // change new user
        if (this.changePassword) {
          const user = {
            old_pwd: this.record.password,
            new_pwd: this.record.newPassword,
          }
          this.$httpPut(`/users/${encodeURIComponent(this.record.username)}`, this.record).then(() => {
            // change password
            this.$httpPut(`/change_pwd/${encodeURIComponent(this.record.username)}`, user)
              .then(() => {
                // re login
                if (
                  this.$store.state.user.username === this.record.username &&
                  this.record.password !== this.record.newPassword
                ) {
                  this.$message.success(this.$t('users.jumpLoginTip'))
                  window.setTimeout(() => {
                    this.USER_LOGIN({ isLogOut: true })
                    this.$router.push('/login')
                  }, 1500)
                } else {
                  this.$message.success(`${this.$t('oper.edit')}${this.$t('alert.success')}`)
                  this.dialogVisible = false
                  this.loadData()
                }
              })
              .catch((error) => {
                this.$message.error(error || this.$t('error.networkError'))
              })
          })
        } else {
          this.$httpPut(`/users/${encodeURIComponent(this.record.username)}`, this.record)
            .then(() => {
              // change password
              this.$message.success(`${this.$t('oper.edit')}${this.$t('alert.success')}`)
              this.dialogVisible = false
              this.loadData()
            })
            .catch((error) => {
              this.$message.error(error || this.$t('error.networkError'))
            })
        }
      })
    },
    deleteUser(row, index, self) {
      this.$httpDelete(`/users/${encodeURIComponent(row.username)}`)
        .then(() => {
          this.$message.success(`${this.$t('oper.delete')}${this.$t('alert.success')}`)
          this.loadData()
          self.$refs[`popover-${index}`].doClose()
        })
        .catch((error) => {
          this.$message.error(error || this.$t('error.networkError'))
        })
    },
    /**
     * open when user using default pwd
     */
    openChangePwdDialog() {
      try {
        const user = this.users.find(({ username }) => username === this.currentUserName)
        if (!user) {
          throw new Error('User not found')
        }
        this.handleOperation(false, user)
        this.changePassword = true
      } catch (error) {
        console.error(error)
      }
    },
    confirmForChangeDefaultPwdParam() {
      if (this.isForChangeDefaultPwd) {
        this.openChangePwdDialog()
      }
    },
  },

  watch: {
    isForChangeDefaultPwd(val) {
      if (val) {
        this.openChangePwdDialog()
      }
    },
  },

  async created() {
    await this.loadData()
    this.confirmForChangeDefaultPwdParam()
  },

  beforeRouteLeave(to, from, next) {
    this.preventLeaveWithoutChangeDefaultPwd(to, from, next)
  },
  beforeRouteUpdate(to, from, next) {
    this.preventLeaveWithoutChangeDefaultPwd(to, from, next)
  },
}
</script>

<style lang="scss">
.users-view {
  .el-table {
    margin-top: 24px;
  }

  .change-password {
    text-align: left;
  }
}
</style>
