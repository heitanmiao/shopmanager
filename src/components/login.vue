<template>
  <div class="wrap">
     <el-form label-position="top" label-width="80px" :model="formdata" class="form">
       <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button type="primary" class="btn" @click="handleLogin()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  mounted () {
  },
  methods: {
    async handleLogin () {
      // this.$http
      //   .post('login', this.formdata)
      //   .then((res) => {
      //     const {data: {meta: {msg, status}, data}} = res
      //     if (status === 200) this.$router.push({name: 'home'})
      //     else this.$message.warning(msg)
      //   })
      const res = await this.$http.post('login', this.formdata)
      const {data: {meta: {msg, status}, data}} = res
      if (status === 200) {
        localStorage.setItem('token', data.token)
        this.$router.push({name: 'home'})
      } else this.$message.warning(msg)
    }
  }
}
</script>

<style>
  .wrap{
    height: 100%;
    background: #324152;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .wrap .form{
    background: #fff;
    width: 400px;
    border-radius: 10px;
    padding: 30px;
  }
  .wrap .form .btn{
    width: 100%;
  }
</style>
