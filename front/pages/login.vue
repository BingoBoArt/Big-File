<template>
  <div class="login-container">
    <el-form ref="login" :model="loginForm" :rules="rules" class="login">
      <el-form-item>
        <span>请输入邮箱</span>
        <el-input v-model="loginForm.email" placeholder="请输入邮箱"/>
      </el-form-item>
      <el-form-item>
        <div>
          <img :src="captchaUrl" @click="() => (captchaUrl = `/api/captcha?${new Date().getTime()}`)" alt=""/>
        </div>
        <el-input v-model="loginForm.captcha" placeholder="请输入验证码"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="loginForm.emailCode" placeholder="请输入邮箱验证码"/>
        <el-button @click="sendEmailCode"  type="pramary">{{sendText}}</el-button>
        <!-- <el-button @click="sendEmailCode" :disabled="send.timer>0" type="pramary">{{sendText}}</el-button> -->
      </el-form-item>
      <el-form-item>
        <span>请输入密码</span>
        <el-input v-model="loginForm.passwd" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item>
        <el-button @click.native.prevent="loginBtn(loginForm)">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from "md5";
export default {
  layout: "login",
  data() {
    return {
      send:{
        timer: 0
      },
      captchaUrl: "/api/captcha",
      loginForm: {
        // 服务端发起邮件的邮箱用163邮箱时，qq邮箱和163邮箱都可收到邮件
        // 服务端发起邮件的邮箱用126邮箱时，qq邮箱可以收到，163邮箱和126邮箱收不到邮件
        email: "",
        captcha: "",
        emailCode: '',
        passwd: "123",
      },
      rules: {},
    };
  },
  computed: {
    sendText() {
      return this.send.timer > 0 ? `${this.send.timer}s后发送` : '发送' 
    }
  },
  methods: {
    async sendEmailCode(){
      await this.$http.get('/sendcode?email='+this.loginForm.email)
      this.send.timer = 10
      this.timer = setInterval(() => {
        this.send.timer -= 1
        if(this.send.timer === 0) clearInterval(this.timer)
      }, 1000);
    },
    async loginBtn(loginForm) {
      const passwd = loginForm.passwd && md5(loginForm.passwd);
      let obj = { ...loginForm, passwd };
      console.log("loginForm", { ...obj });

      let res = await this.$http.post("/user/login", obj);
      console.log("res", res);
      if (res.code === 0) {
        this.$message.success("登录成功");
        localStorage.setItem('token', res.data.token)
        this.$router.push("/uc");
      } else {
        this.$message.error(res.message);
        console.log("错误信息:", res);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.el-form-item {
  margin-bottom: 0px;
}

.login-container {
  border: 1px solid red;
  height: 100%;
  padding: 100px;
  padding-top: 0px;
}
</style>