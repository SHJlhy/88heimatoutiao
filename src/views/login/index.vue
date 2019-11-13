<template>
  <div class='login'>
      <el-card  style='height:350px;width:450px'>
          <div class='login-title'><img src="../../assets/img/logo_index.png" alt=""></div>
          <el-form :model="loginForm" :rules="rules" ref='loginForm'>
              <el-form-item prop="mobile">
                 <el-input v-model="loginForm.mobile" placeholder="请输入手机号"></el-input>
             </el-form-item>
              <div class='login-code'>
                <el-form-item style='width:250px' prop="code">
                   <el-input v-model='loginForm.code' placeholder="请输入验证码"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button>获取验证码</el-button>
                </el-form-item>
              </div>
              <el-form-item class='checked' prop="checked">
                  <el-checkbox v-model="loginForm.checked"></el-checkbox>
                  <span>我已阅读并同意用户协议和隐私条款</span>
              </el-form-item>
              <el-form-item class="log" >
                  <el-button type="primary" style="width:400px" @click='onLogin'>登录</el-button>
              </el-form-item>
          </el-form>
      </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        mobile: '',
        code: '',
        checked: false
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码' }
        ],
        checked: [{ validator: function (rule, value, callback) {
          if (value) {
            callback()
          } else {
            callback(new Error('请同意'))
          }
        } }
        ]
      }
    }
  },
  methods: {
    onLogin () {
      // 获取表单的输入的内容
      this.$refs.loginForm.validate(isOk => {
        if (isOk) {
          // 调用接口
          this.$axios({
            method: 'POST',
            url: '/authorizations',
            data: this.loginForm
          }).then(res => {
            console.log(res)
            // 登录成功
            // 存储token
            localStorage.setItem('token', res.data.data.token)
            // 跳转到主页
            this.$router.push('/home')
          }).catch(res => {
            // eslint-disable-next-line no-unused-expressions
            this.$message({
              type: 'warning',
              message: '手机号或验证码错误'
            })
          })
        }
      })
    }
  }

}
</script>

<style lang='less' scoped>
// 我们想使用less  需要在style标签中给lang属性赋值  lang='less',
// vue单文件的style样式是全局的，
// 如果不同的组件使用了相同的类选择器设置了style样式，
// 那么只有一个样式会起作用后面的会把前面的样式覆盖调用
// 使用之后各个组件的样式相互不影响

.login {
    background-image: url('../../assets/img/login_bg.jpg');
    background-size: cover;
    height:100vh;
    display: flex;
    // 表单水平居中，垂直居中
    justify-content: center;
    align-items: center;
    .login-title {
        margin-bottom: 20px;
        text-align: center;
        img {
            height: 50px;
        }
    }
    .login-code {
        display: flex;
        justify-content: space-between
    }
    .checked {
        span {
            margin-left: 10px;
        }
    }
    .log {
        text-align: center;

    }

}

</style>
