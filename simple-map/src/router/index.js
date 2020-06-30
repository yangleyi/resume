import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import store from './../store'
import * as types from './../store/types'
Vue.use(Router)


const router = new Router({ routes })
router.beforeEach((to, from, next) => {
    // (!store.state.userInfo && to.path != '/') && next('/')
    
    // 定义一个可以记录路由路径变化的数组，这里在vuex，其实也可以用sessionStorage,或者在window.routeChain等变量
    // 不一定要用到vuex
    let routeLength = store.state.routeChain.length;
    // 当前页面如果为画图找分销那么路由变化就返回
    let cRoute = store.state.routeChain[routeLength - 1]
    if (cRoute && cRoute.path === '/saleCircle') {
        Vue.prototype.$wx.miniProgram.navigateBack({delta: 1})
        return
    } else {

        if (routeLength === 0) {
            store.commit(types.SET_TRANSITION_NAME, 'fade')
            if (to.path === from.path && to.path === '/') {
                //当直接打开根路由的时候
                store.commit(types.ADD_ROUTE_CHAIN, to)
            } else {
                //直接打开非根路由的时候其实生成了两个路径，from其实就是根路由
                store.commit(types.ADD_ROUTE_CHAIN, from)
                store.commit(types.ADD_ROUTE_CHAIN, to)
            }
        } else if (routeLength === 1) {
            store.commit(types.SET_TRANSITION_NAME, 'slide-left')
            store.commit(types.ADD_ROUTE_CHAIN, to)
        } else {
            let lastBeforeRoute = store.state.routeChain[routeLength - 2]
            // 如果页面返回，若上个页面是根目录，则返回小程序上个页面
            if (routeLength === 2) {
                if (lastBeforeRoute.path === '/' && to.path === '/') {
                    Vue.prototype.$wx.miniProgram.navigateBack({delta: 1})
                }
            }
            if (lastBeforeRoute.path === to.path) {
                store.commit(types.POP_ROUTE_CHAIN)
                store.commit(types.SET_TRANSITION_NAME, 'slide-right')
            } else {
                store.commit(types.ADD_ROUTE_CHAIN, to);
                store.commit(types.SET_TRANSITION_NAME, 'slide-left')
            }
        }
    }
    next()
})

export default router