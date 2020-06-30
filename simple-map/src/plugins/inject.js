import api from './../api'
import axios from './../api/axios'
import config from './../config'
// import getColor from './../utils/getColor'
import wx from 'weixin-js-sdk'

export default {
    install: (Vue) => {
        Vue.config.productionTip = false
        Vue.prototype.$api = api
        Vue.prototype.$config = config
        Vue.prototype.$wx = wx
        // Vue.prototype.$getColor = getColor
        Vue.prototype.$axios = axios.axios
    }
}