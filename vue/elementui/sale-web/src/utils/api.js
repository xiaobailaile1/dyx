import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import {getToken} from '@/utils/auth'
import store from '../store'
// 创建axios实例
const service = axios.create({
  timeout: 15000                  // 请求超时时间2
})
// request拦截器
service.interceptors.request.use(config => {
  //设置根URK
  config.url = process.env.IP_PORT + config.url;
  config.headers.Authorization=sessionStorage.getItem('token');
  if(config.url.indexOf("/login/auth") == -1 && !config.headers.Authorization){
    MessageBox.alert("", "登录失效", {
      confirmButtonText: "跳转登录页面",
      callback: action => {
        // 跳转登录页
        window.location.href = "/login";
      }
    });
    return false;
  }

  return config;
}, error => {
  // Do something with request error
  console.error(error) // for debug
  Promise.reject(error)
})
// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code == "200") {
      return res
    }

    if (res.code == '10002') {
      Message({
        showClose: true,
        message: res.msg,
        type: 'error',
        duration: 3 * 1000,
        onClose: () => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        }
      });
      return Promise.reject(res.msg)
    }else{
      Message({
        message: res.msg,
        type: 'error',
        duration: 3 * 1000
      })
      return res
    }
  },
  error => {
    console.error('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)
export default service

