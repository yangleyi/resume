import request from './../api/request'
import wx from 'weixin-js-sdk'

const wx_config = () => {
  window.wx = wx
  request('get', `/js/signature?url=${encodeURIComponent(location.href.split('#')[0])}`).then(res => {
    const { appid, timestamp, noncestr, signature } = res.data
    wx.config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: appid, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: noncestr, // 必填，生成签名的随机串
      signature: signature, // 必填，签名，见附录1
      jsApiList: ['chooseImage', 'previewImage', 'uploadImage', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'getLocation','openLocation','chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    })
  })
}

wx_config()