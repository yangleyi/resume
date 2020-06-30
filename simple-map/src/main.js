import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import AMap from 'vue-amap';
// Vue.use(AMap);

import './ui/vant'
import './utils/rem'
// import './utils/wx_config'

import inject from './plugins/inject'
Vue.use(inject)

import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)

// 解决移动端300毫秒的延迟
import fastclick from 'fastclick'
fastclick.attach(document.body)

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
