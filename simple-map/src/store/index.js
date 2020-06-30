import Vue from 'vue'
import Vuex from 'vuex'
import * as types from './types'

Vue.use(Vuex)

const state = {
    /* 判断前进后退 */
    count: 1,
    transitionName: 'slide-right',
    routeChain: [],
    // 当前所在城市
    city: null,
    // 当前所在城市code
    cityCode: null,
    /* END */
    // 经纬度
    lng: null,
    lat: null,
    //用户信息
    userInfo: null,
    //数据
    data: [],
    // 搜项目数据
    fmapData: [],
    //选择的项目
    project: {},
    //已选择人名
    personName: '',
    //已选择公司
    companyName: '',
    //热门项目
    hotList: [],
    //加载中
    loading: false,
    //左侧菜单是否显示
    sidebarShow: false,
    //区域找分销选择框是否显示 
    selectRegionShow: false,
    //人名找分销选择框是否显示  
    selectPersonShow: false,
    //公司找分销选择框是否显示  
    selectCompanyShow: false,
    //封闭区面积集合
    enclosedArea: {},
    //获取范围数据请求参数
    params: {},
    //弹出层高度
    posheight: 0,
    // 消息通知未读数
    messageCount: 0,
    // 长三角城市数组
    areaCitys: [],
}

const getters = {
    // 当前城市，从小程序获取
    city: state => state.city,
    // 当前城市code
    cityCode: state => state.cityCode,
    // 当前经纬度
    lng: state => state.lng,
    lat: state => state.lat,
    //用户信息
    userInfo: state => state.userInfo,
    //数据
    data: state => state.data,
    // 搜项目数据
    fmapData: state => state.fmapData,
    //选择的项目
    project: state => state.project,
    //已选择人名
    personName: state => state.personName,
    //已选择公司
    companyName: state => state.companyName,
    //热门项目
    hotList: state => state.hotList,
    //当前所选星级
    level: state => state.level,
    //获取范围数据请求参数
    params: state => state.params,
    //封闭区面积集合
    enclosedArea: state => state.enclosedArea,
    //过渡效果
    transitionName: state => state.transitionName,
    //加载中
    loading: state => state.loading,
    // 左侧菜单是否显示
    sidebarShow: state => state.sidebarShow,
    //区域找分销是否显示 
    selectRegionShow: state => state.selectRegionShow,
    //人名找分销选择框是否显示 
    selectPersonShow: state => state.selectPersonShow,
    //公司找分销选择框是否显示 
    selectCompanyShow: state => state.selectCompanyShow,
    //弹出层高度
    posheight: state => state.posheight,

    // 消息通知未读数
    messageCount: state => state.messageCount,
    // 长三角城市数组
    areaCitys: state => state.areaCitys,
}

const mutations = {
    /* 设置路由前进后退的效果 */
    [types.ADD_ROUTE_CHAIN](state, route) {
        state.routeChain.push(route);
    },
    [types.POP_ROUTE_CHAIN](state) {
        state.routeChain.pop();
    },
    [types.SET_TRANSITION_NAME](state, dir) {
        state.transitionName = dir;
    },
    /* end */
}

const actions = {}

const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
})

export default store