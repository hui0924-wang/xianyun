
// 1.定义state 函数  返回对象  名称不能改
export const state = () => ({
  userinfo: {
    token: "",
    user: {}
  }
})
// export const state = () => {
//   return {
//     userinfo: {
//       token: "",
//       user: {}
//     }
//   }
// }
// 2.定义mutations
export const mutations = {
  setUser(state, userinfo) {
    state.userinfo = userinfo
  }

}
// 3.定义actions 负责异步数据
export const actions = {
  setUser(context, form) {

    this.$axios.post("/accounts/login", form).then(res => {
      // console.log(res);
      context.commit('setUser', res.data)
      // 把用户信息存入本地存储中
      localStorage.setItem('userinfo', JSON.stringify(res.data))
    });

  }
}