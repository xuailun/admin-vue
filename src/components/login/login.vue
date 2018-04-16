<template>
<div class="login-wrap">
  <el-form class="login-form" label-position="top" ref="form" :model="userForm" label-width="80px">
  <h2 class="heading">用户登录</h2>
  <el-form-item label="用户名">
    <el-input v-model="userForm.username"></el-input>
  </el-form-item>
  <el-form-item label="密码">
    <el-input type="password" v-model="userForm.password"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button class="login-buttton" type="primary" @click="login">立即登录</el-button>
  </el-form-item>
</el-form>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      userForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      // 1. 采集表单数据
      // 2. 表单验证
      // 3. 发请求执行登陆操作
      // 4. 根据响应做交互
      const res = await axios.post('http://localhost:8888/api/private/v1/login', this.userForm)
      const data = res.data
      if (data.meta.status === 200) {
        // 登陆成功，将服务器签发给用户的 Token 身份令牌记录到 localStorage 中
        // 其它需要使用 Token 的都去本地存储获取
        window.localStorage.setItem('admin-token', JSON.stringify(data.data))
        this.$router.push({
          name: 'home'
        })
        this.$message({
          type: 'success',
          message: '登录成功!'
        })
      }
    }
  }
}
</script>

<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-form {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 10px;
}

.login-wrap .login-button {
  width: 100%;
}

.login-wrap .heading {
  font-weight: normal;
  text-align: center;
}
</style>
