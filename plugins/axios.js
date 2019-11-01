import { Message } from "element-ui";
// 拦截器
export default function ({ $axios, redirect }) {
  // 请求失败的会到这里
  $axios.onError(error => {
    console.log(error.response)
    // {"statusCode":400,"error":"Bad Request","message":"用户名或者密码无效."}
    // 1 获取失败后的返回值 
    const { statusCode, message } = error.response.data;
    if (statusCode === 400) {
      //2 密码错误
      Message.warning(message)
    }
  })
}