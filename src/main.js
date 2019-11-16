import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import axios from 'axios'
import Bigint from 'json-bigint'
import 'element-ui/lib/theme-chalk/index.css' // 引入样式
import './styles/index.less'

// 第三方包用于解决
// axios 返回的结果是字符串  axios内部自己把json字符串转为对象
// / 但是id对应的值超过js规定的最大数  返回的数据就会失真
// 统一设置axios使用
Vue.prototype.$axios = axios
// 统一设置基地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // config是本次请求的相关配置对象 也是最后发送给后端的数据，所以在发送请求之前设置请求头
  // Do something before request is sent
  const token = localStorage.getItem('token')
  config.headers.Authorization = `Bearer ${token}`
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})
axios.defaults.transformResponse = [function (data, headers) {
  // Do whatever you want to transform the data
  // axios 默认使用 JSON.parse(data)
  // 我们这里手动配置使用 JSONbig.parse(data)
  try {
    return Bigint.parse(data)
  } catch (err) {
    console.log(err)
    // 一旦 try 里面的代码执行引发异常，那么就进入 catch 执行
    return {}
  }
}]

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
