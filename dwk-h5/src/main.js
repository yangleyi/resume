import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant'
import 'vant/lib/index.css'
import './utils/rem'
import router from './router/index'
Vue.use(Vant)
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
