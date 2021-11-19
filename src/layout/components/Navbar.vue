<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div class="avatar-container el-dropdown" style="margin-right: 50px">
        <div class="avatar-wrapper">
          <div/>
          <div style="height: 40px; cursor: pointer" @click="open('https://github.com/galaxy-future/BridgX/blob/master/docs/developer_api.md')">
            API中心
          </div>
        </div>
      </div>
      <el-dropdown class="avatar-container" style="margin-right: 60px" trigger="click" placement="bottom">
        <div class="avatar-wrapper">
          <div/>
          <div style="height: 40px">
            帮助与支持
          </div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="open('https://github.com/galaxy-future/BridgX/blob/master/README.md')">
            <span style="display:block;">产品概述</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="open('https://github.com/galaxy-future/BridgX/blob/master/docs/getting-started.md')">
            <span style="display:block;">快速指南</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="open('https://github.com/galaxy-future/BridgX/blob/master/docs/user-manual.md')">
            <span style="display:block;">用户手册</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <div style="margin-left: 5px">
            {{ name }}
          </div>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Dashboard
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="modifyPassword">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :visible.sync="show" title="修改密码">
      <el-form ref="form" :model="form" status-icon :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" disabled />
        </el-form-item>
        <el-form-item label="旧密码" prop="old_password">
          <el-input v-model="form.old_password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" prop="new_password">
          <el-input v-model="form.new_password" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item label="确认密码" prop="new_password_again">
          <el-input v-model="form.new_password_again" type="password" autocomplete="off" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="form.new_password !== form.new_password_again" @click="submitForm('form')">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

import { passwordModify } from '@/api/user'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.new_password_again !== '') {
          this.$refs.form.validateField('new_password_again')
        }
        callback()
      }
    }
    const validatePassAgain = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.new_password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        username: '',
        old_password: '',
        new_password: '',
        new_password_again: ''
      },
      avatar: 'http://mms0.baidu.com/it/u=3585539889,839097986&fm=253&app=138&f=JPEG?w=100&h=100',
      rules: {
        new_password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        new_password_again: [
          { validator: validatePassAgain, trigger: 'blur' }
        ]
      },
      show: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name'
    ])
  },
  methods: {
    open(url) {
      window.open(url)
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    async modifyPassword() {
      this.form.username = this.name
      this.show = true
    },
    async submitForm() {
      const res = await passwordModify(this.form.username, this.form.old_password, this.form.new_password)
      if (res.code === 200) {
        this.$message.success('修改成功!')
      } else {
        this.$message.error('修改失败')
      }
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .api-container {
      display: inline-block;
      position: relative;
      color: #606266;
      height: 100%;
      font-size: 14px;
      .api-wrapper {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        display: flex;
        flex-direction: row;
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
