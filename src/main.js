import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css' // 引入样式
import './styles/index.less'
import axios from 'axios'
// 统一设置axios使用
Vue.prototype.$axios = axios
// 统一设置基地址
axios.defaults.baseURL = ' http://ttapi.research.itcast.cn/mp/'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
