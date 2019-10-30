<template>
  <div class="login_form">
    <!-- <h1>{{token}}</h1> -->
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="用户名/手机"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" placeholder="密码" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%" @click="submitLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "18818428500",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: "请输入正确11位手机号",
            trigger: "blur"
          }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  computed: {
    token() {
      return this.$store.state.user.userinfo.token;
    }
  },
  methods: {
    submitLogin() {
      this.$refs.form.validate(valid => {
        console.log(valid);
        if (valid) {
          /**
           * 把token 和用户信息存储起来
           * 1.vuex中
           * 2.本地存储
           */
          this.$store.dispatch("user/setUser", this.form).then(res => {
            // 弹出提示
            // 跳转页面
            this.$message.success("登录成功");
            setTimeout(() => {
              this.$router.push("/");
            }, 500);
          });
        }
      });
    }
  }
};
</script>

<style>
</style>