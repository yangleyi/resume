import axios from './axios'
const request = axios.request

export default {
    //登陆
    Login: para => request('get', 'mapv2/user/getOpenid', para),
    // 新的登录流程接口
    GetSessionKey: para => request('get', 'mapv2/user/getSessionKey', para), 
    //获取用户
    GetUser: para => request('get', 'mapv2/user/getUser', para),
    //获取地铁
    GetSubway: () => request('get', 'mapv2/user/getSubway'),
    //获取数据
    GetData: para => request('post', 'mapv2/onlineAgentDetail/selectAll ', para),
    // 获取画圈找分销
    GetSaleData: para => request('get', 'mapv2/retailList/selectStoreList', para),
    //获取热门
    GetHot: () => request('get', 'mapv2/newHouse/selectHotList'),
    //获取项目
    GetProject: para => request('get', '/mapv2/newHouse/selectLikeName', para),
    //获取分享项目
    GetShareProject: para => request('get', 'mapv2/newHouse/selectProjectByCondition', para),
    //获取历史记录
    GetHistory: () => request('get', 'mapv2/onlineAgentDetail/selectSearchRecord'),
    //删除历史记录
    DeleteHistory: () => request('get', 'mapv2/onlineAgentDetail/deleteSearchRecord'),
    //获取详情
    GetDetail: para => request('get', 'mapv2/onlineAgentDetail/selectById', para),
    //获取详情公司信息
    GetDetailCompany: para => request('get', 'mapv2/onlineAgentDetail/selectStaffHolderById', para),
    //获取分销公司
    GetCompany: para => request('get', 'mapv2/onlineAgentDetail/selectLikeName', para),
    //分销关系列表
    GetFxList: () => request('get', 'mapv2/user/getBinDingDistributionList'),
    //解除分销关系
    RelieveFx: para => request('get', 'mapv2/user/unBinDingDistribution', para),
    //绑定分销关系
    BindFx: para => request('get', 'mapv2/user/binDingDistribution', para),
    //绑定项目
    BindProject: para => request('get', 'mapv2/user/binDingProject', para),
    //项目列表
    GetProjectList: () => request('get', 'mapv2/user/getbinDingProjectList '),
    //解除项目关系
    RelieveProject: para => request('get', 'mapv2/user/unBinDingProject', para),
    //保存历史记录
    SaveHistory: para => request('get', 'mapv2/onlineAgentDetail/saveSearchRecord', para),
    //获取验证码
    GetCode: phone => request('get', 'mapv2/user/sendcheckcode/' + phone),
    //绑定公司
    BindCompany: para => request('post', 'mapv2/user/updateUser', para),
    //发送通知
    SendMsg: para => request('post', 'mapv2/user/sendNoticeMsg', para),
    //获取公司列表
    GetCompanyList: para => request('get', 'mapv2/onlineAgentDetail/getDetails', para),
    //创建收藏夹
    NewCollect: para => request('post', 'mapv2/collect/createCollect', para),
    //删除收藏夹
    DeleteCollect: para => request('get', 'mapv2/collect/delCollect', para),
    //获取收藏夹
    GetCollect: para => request('get', 'mapv2/collect/getCollectByType', para),
    //获取收藏列表
    GetCollectList: para => request('get', 'mapv2/collect/selectCollectList', para),
    //添加到收藏
    AddCollect: para => request('get', 'mapv2/collect/addCollectDataBatch', para),
    //取消收藏
    CancelCollect: para => request('get', 'mapv2/collect/cancelCollectData', para),
    //设置为已拜访
    SetVisited: para => request('get', 'mapv2/collect/confirmVisit', para),
    //搜索人名
    GetPersonName: para => request('get', 'mapv2/onlineAgentDetail/selectLSHByName', para),
    //获取人名搜索的最近门店的中心点坐标
    GetLatLng: para => request('get', 'mapv2/onlineAgentDetail/selectLatLng', para),
    //获取已绑定的公司搜索
    GetBindCompany: para => request('get', 'mapv2/user/selectBDNHouseLikeName', para),
    //获取分享列表
    GetShareList: para => request('get', 'mapv2/newHouse/selectShareNewHouseList', para),
    //分享详情
    GetShareDetail: para => request('get', 'mapv2/newHouse/selectShareNewHouseByPrimaryKey', para),
    //获取黑名单列表
    GetBlackList: para => request('get', 'mapv2/black/getBlackList', para),
    //新增黑名单
    AddBlack: para => request('post', 'mapv2/black/insertBlack', para),
    //删除黑名单
    DeleteBlack: para => request('get', 'mapv2/black/delBlack', para),
    //获取城市
    GetCity: () => request('get', 'mapv2/newHouse/getCity'),
    //创建或创建修改分享详情
    AddOrModifyShareDetail: para => request('post', 'mapv2/newHouse/insertOrUpdateShareNewHouse', para),
    // 客源迁徙数据请求接口
    GetFlyData: para => request('post', 'map/migrate/selectAll', para),
    //获取周边房源
    GetProjectPosition:  para  => request('post','pro/getProjectPosition',para ),
    //找项目聚合
    // selectNewHousePoint:  para  => request('get','mapv2/newHouse/selectNewHousePoint',para ),
    selectNewHousePoint:  para  => request('post','mapv2/newHouse/selectAllSimple',para ),
    //找项目内的name联想
    selectLikeName:  para  => request('get','mapv2/newHouse/selectLikeName',para ),
    // 长三家城市列表
    GetCitys: para => request('get', 'mapv2/basicDic/getCityBan', para),
    // 获取经纬度
    GetLongAndLat: para => request('get',
    'mapv2/newHouseUser/getLngLatAddress', para),
    // 获取消息通知数据
    GetMsgList: para => request('get', 'mapv2/message/getUserMessageList', para),
    // 检索汇报人信息
    CheckReporterMsg: para => request('get', 'mapv2/usergrant/getUserListToGrant', para),
    // 插入汇报人信息
    InsertReportMsg: para => request('post', 'mapv2/usergrant/insertUserGrant', para),
    // 取消汇报
    DeleteReportMsg: para => request('get', 'mapv2/usergrant/cancelGrant', para),
    // 获取绑定的汇报人信息
    GetReportMsg: para => request('get', 'mapv2/usergrant/getGrantUserInfo', para)
}