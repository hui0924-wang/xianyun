<template>
  <div class="header">
    <div class="main">
      <div class="main_pages">
        <nuxt-link to="/" class="pages_logo">
          <img src="http://157.122.54.189:9093/images/logo.jpg" alt="闲云旅游" />
        </nuxt-link>
        <nuxt-link to="/" class="pages_item">首页</nuxt-link>
        <nuxt-link to="/post" class="pages_item">旅游攻略</nuxt-link>
        <nuxt-link to="/hotel" class="pages_item">酒店</nuxt-link>
        <nuxt-link to="/air" class="pages_item">国内机票</nuxt-link>
      </div>
      <div class="main_login">
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-bell"></i> 消息
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>消息</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <nuxt-link to="/user/login/0" class="login_link">
          <div class="login_user" v-if="userinfo.token">
            <el-dropdown>
              <span class="el-dropdown-link">
                <img :src="$axios.defaults.baseURL+userinfo.user.defaultAvatar" alt />&nbsp;
                <span>
                  {{userinfo.user.username
                  }}
                </span>&nbsp;
                <i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>
                  <div @click="handleLoginOut">退出</div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="login_text" v-else>登录 / 注册</div>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    userinfo() {
      return this.$store.state.user.userinfo;
    }
  },
  mounted() {
    // 因为页面一刷新vuex的数据就会跟着刷新，所以需要在页面一加载时就判断有没有是否登陆过，登录过的话就把用户数据传给vuex
    let userStr = localStorage.getItem("userinfo");
    if (userStr) {
      // 存在
      let userinfo = JSON.parse(userStr);
      // 把值设置给vuex
      this.$store.commit("user/setUser", userinfo);
    }
  },
  methods: {
    handleLoginOut() {
      // 删除本地存储信息
      // 删除vuex中的用户信息
      localStorage.removeItem("userinfo");
      this.$store.commit("user/setUser", { token: "", user: {} });
      this.$message.success("退出成功");
      setTimeout(() => {
        this.$router.push("/user/login/0");
      },500);
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  width: 100%;
  border-bottom: 1px solid #ccc;
  a {
    color: inherit;
    text-decoration: none;
  }
  .main {
    height: 60px;
    width: 1000px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    .main_pages {
      display: flex;

      .pages_item {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20px;
        &:hover {
          color: #0094ff;
          background-color: #fff;
          position: relative;
          &::before {
            position: absolute;
            content: "";
            bottom: 0;
            left: 0;
            width: 100%;
            height: 5px;
            background-color: #0094ff;
          }
        }
      }
      .nuxt-link-exact-active {
        background-color: #0094ff !important;
        color: #fff !important;
      }
      .pages_logo {
        display: flex;
        align-items: center;
        background-color: #fff !important;
        img {
          width: 156px;
        }
      }
    }
    .main_login {
      display: flex;
      align-items: center;
      justify-content: center;
      .login_link {
        font-size: 14px;
        color: #606266;
        margin-left: 15px;
        &:hover {
          color: #0094ff;
        }
      }
      .login_user {
        .el-dropdown-link {
          img {
            width: 36px;
          }
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>