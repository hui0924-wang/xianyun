<template>
  <div class="register_form">
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-form-item prop="username">
        <el-input v-model="form.username" placeholder="用户名/手机"></el-input>
      </el-form-item>
      <el-form-item prop="captcha">
        <el-input placeholder="验证码" v-model="form.captcha">
          <template slot="append">
            <div @click="sendCaptcha">发送验证码</div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model="form.nickname" placeholder="你的名字"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" placeholder="密码" show-password></el-input>
      </el-form-item>
      <el-form-item prop="password2">
        <el-input v-model="form.password2" placeholder="确认密码" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" style="width:100%">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    // 确认密码 输入框 当 失去焦点的时候 被调用
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "18818428500",
        captcha: "000000",
        nickname: "花花",
        password: "123456",
        password2: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入手机号码", trigger: "blur" }
        ],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        password2: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    sendCaptcha() {
      // 获取用户的手机号码
      let reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
      if (reg.test(this.form.username)) {
        this.$axios.post("/captchas", { tel: this.form.username }).then(res => {
          console.log(res);
        });
      } else {
        this.$message.warning("手机号码不合法");
      }
    },
    submitForm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 1 构造表单 发送异步请求
          // 2 删除对象的一个属性
          // delete this.form["password2"];
          // console.log(this.form);
          // 3 resForm 等于  this.form 对象中  除了 password2 属性外的剩下的 属性集合 = 对象
          let { password2, ...resForm } = this.form;
          console.log(resForm);
          this.$axios.post("/accounts/register", resForm).then(res => {
            // console.log(res);
            // 可以子向父传参,比较麻烦
            // 这里可以是currentIndex 和 路由参数建立关联来实现页面跳转
            if (res.status === 200) {
              this.$message.success("注册成功");
              setTimeout(() => {
                this.$router.push("/user/login/0");
              }, 500);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
</style>