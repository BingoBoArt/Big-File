<template>
  <div class="regist-container">
    <el-form ref="regist" :model="ruleForm" :rules="rules" class="regist">
      <el-form-item>
        <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="ruleForm.captcha"
          placeholder="请输入验证码"
        ></el-input>
        <img
          :src="captchaUrl"
          @click="() => (captchaUrl = `/api/captcha?${new Date().getTime()}`)"
          alt=""
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="ruleForm.nickname"
          placeholder="请输入昵称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="ruleForm.passwd" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="ruleForm.repasswd"
          placeholder="请再次输入密码"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click.native.prevent="registBtn(ruleForm)">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import md5 from "md5";
export default {
  layout: "regist",
  data() {
    return {
      captchaUrl: "/api/captcha",
      ruleForm: {
        email: "",
        captcha: "",
        nickname: "bingo",
        passwd: "123",
        repasswd: "123",
      },
      rules: {},
    };
  },
  methods: {
    async registBtn(ruleForm) {
      const passwd = ruleForm.passwd && md5(ruleForm.passwd);
      let obj = { ...ruleForm, passwd };
      console.log("ruleForm", { ...obj });

      let res = await this.$http.post("/user/register", obj);
      console.log("res", res);
      if (res.code === 0) {
        this.$alert("注册成功", {
          confirmButtonText: "去登陆",
          callback: () => {
            // this.$router.push("/login");
          },
        });
      } else {
        this.$message.error(res.message);
        console.log("错误信息:", res);
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
.regist-container {
  border: 1px solid red;
  height: 100%;
  padding: 100px;
}
</style>