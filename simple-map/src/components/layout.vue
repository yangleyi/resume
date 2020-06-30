<template>
  <div id="layout">

    <drawer :show="sidebarShow" :pos="pos" :tran="tran" @change-show="changeDrawerShow">
      <transition :name="transitionName">
        <slot></slot>
      </transition>
    </drawer>
    <div class="loading" v-show="loading">
      <img style="width: 100%;" src="./../assets/loading.gif" alt>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// 左侧过渡效果
import drawer from "./drawer";
// 侧边栏
// import sidebar from "./sidebar";
export default {
  name: "layout",
  data: () => ({
    // 导航条显示
    showNavBar: true,
    // 城市选择加载
    cityLoading: false,
    // 城市code
    cityCode: null,
    // 城市列表
    citys: [],
    // 选择城市
    showCityPopup: false,
    // 点击未禁用tab
    developing: false,
    // 导航栏激活索引
    active: 0,
    // 侧边栏方向
    pos: "left",
    // 过渡效果类型
    tran: "push",
    // 消息角标
    msgNum: 0,
  }),
  computed: {
    ...mapGetters([
      "userInfo",
      //过渡效果
      "transitionName",
      //加载中
      "loading",
      // 左侧菜单是否显示
      "sidebarShow",
      // 城市选择
      "areaCitys",
      // 未读消息总数
      "messageCount"
    ]),
    // city: {
    //   get: function () {
    //     let city = this.$store.state.city
    //     this.setDefaultCity(this.$store.state.city)
    //     return this.$store.state.city
    //   },
    //   set: function (city) {
    //     this.$store.state.city = city
    //   }
    // },
    areaCitys: {
      get: function () {
        return this.$store.state.areaCitys
      },
      set: function (city) {
        this.$store.state.areaCitys = city
      }
    }
  },
  mounted () {
    this.citys = this.areaCitys
  },
  methods: {
    billClick (e) {
      let type = e.target.getAttribute('data-type')
      let dar = document.querySelector('.bill-list')
      if (dar.offsetHeight > 0) {
        dar.style.height = 0
      } else {
        dar.style.height = 72 + 'px'
      }
      // 功能
      if (type == 'fn') {
        this.$wx.miniProgram.reLaunch({
          url: `/pages/deskFunction/index`
        })
      }
      if (type == 'bu') {
        this.$wx.miniProgram.reLaunch({
          url: `/pages/desktop/index`
        })
      }
    },
    rightBtnEvent () {
      let path = this.rightBtnPath
      if (this.active == 0) {
        // 分销名单
        path = `${path}?city=${this.city}`
      }
      if (this.active == 1) {
        // 搜项目
        path = `${path}`
      }
      this.goMp(path)
    },
    // 获取城市列表
    getCitys () {
      this.$api.GetCitys().then(res => {
        if (res.status == 0) {
          let data = res.data
          let city = []
          // let currentCode = ''
          for (let i in data) {
              city.push({
                  city: data[i].city,
                  cityCode: data[i].cityCode
              })
          }
          this.citys = city
          this.areaCitys = city
          this.cityLoading = false
        }
      })
    },
    // 获取经纬度
    getLongLat (city) {
      this.$api.GetLongAndLat({adderss: city})
        .then(res => {
          console.log('获取经纬度', res)
          if (res.status == 0) {
            let lngAndLat = res.data[0].location.split(',')
            this.$store.state.lng = lngAndLat[0]
            this.$store.state.lat = lngAndLat[1]
          }
        })
    },
    // 获取城市,若不是长三角的城市则设置为上海市
    setDefaultCity (city) {
      let citys = this.citys || []
      let cityIndex
      citys.map((item, index) => {
        if (item.city == city) {
          cityIndex = index
        }
      })
      if (cityIndex === undefined) {
        this.city = '上海市'
      }
    },
    // 城市选择确定
    selectCityDown (e) {
      this.city = e.city
      this.cityCode = e.cityCode
      this.hideCityPicker()
      this.getLongLat(decodeURIComponent(e.city))
    },
    // 显示城市选择
    chooseCityEvent () {
      this.showCityPopup = true
      if (this.citys.length < 1) {
        this.cityLoading = true
        this.getCitys()
      }
    },
    // 隐藏城市选择弹框
    hideCityPicker () {
      this.showCityPopup = false
    },
    // 显示dialog
    tabDisabled () {
      this.developing = true
    },
    // 导航栏点击事件
    navBarClick (e) {
      console.log('click', e)
      switch (e) {
        case 0:
          this.$router.push('/map')
          break;
        case 1:
           this.$router.push('/fMap')
          break;
        case 2:
          // this.$router.push('/bird-map')
          break;
      }
    },
    //路由跳转
     goMp (path) {
        this.$wx.miniProgram.navigateTo({
          url: path
        })
      },

    // 点击遮罩层关闭侧边栏
    changeDrawerShow(state) {
      this.$store.state.sidebarShow = state;
    },
  },
  components: {
    drawer,
    // sidebar
  },
  watch: {
    messageCount () {
      this.msgNum = this.$store.state.messageCount
    },
    $route: function() {
      this.$store.state.sidebarShow = false;
      let path = this.$route.path
      if (['/map', '/fMap'].includes(path)) {
        this.showNavBar = true
      } else {
        this.showNavBar = false
      }
      if (path == '/map') {
        this.active = 0
      }
      if (path == '/fMap') {
        this.active = 1
      }
    }
  },
  
};
</script>

<style lang="stylus" scoped>
#layout {
  width: 100%;
  height: 100%;

  .bill-btn {
    position: fixed;
    z-index: 100;
    background: rgba(255, 153, 0, 0.7);
    color: #fff;
    border-radius: 5px;
    top: 60px;
    left: 10px;
    font-size: 14px;
    width: 60px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    
    .bill-list {
      height: 0;
      overflow: hidden;
      transition-duration: .3s;
      position: absolute;
      background: #ff9900;
      top: 36px;
      width: 5em;
      div {
        font-size: 12px;
        line-height: 1em;
        text-align: center;
        line-height: 35px;
        border-bottom: 1px solid #fff;
      }
    }
  }

  .text-main {
    color: #009977;  
  }
  // 分销名单 
  #nameList {
    width: 3.4em;
    height 3.4em;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    background: rgba(0, 153, 119, 0.7);
    color: #fff;
    position: fixed;
    z-index: 100;
    top: 60px;
    right: 10px;
  }

  #dialog {
    font-size: 14px; 
    color: #808080;
    text-align: center;
    padding: 20px 0 10px;
    p {
      line-height: 1.7em;
    }
  }

//start
  .control-bar {
    position: absolute;
    border-top: 1px solid #ededed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    background: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: space-around;

    .person-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      // margin-right: 10px;
      // margin-left: 10px;

      div {
        width: 36px;
        height: 36px;
        background: #ccc;
        border: 2px solid #fff;
        border-radius: 50%;
        background-size: cover;
        background-repeat: no-repeat;
      }

      img {
        height: 26px;
        vertical-align: middle;
      }
    }

    .check-city {
      font-size: 15px;
      font-weight: 900;
      color: #1b1b1b;
      display: inline-flex;
      justify-content: flex-start;
      align-items: center;
    }
    .bar-nav {
      width: 54%;
    }

    .msg-icon {
      // display: inline-flex;
      // justify-content: center;
      // align-items: center;
      width: 25px;
      height: 25px;
      position: relative;
      img {
        width: 25px;
        height: 25px;
      }
      .add-icon {
        font-size: 7px;
        font-weight: 900;
      }
      .msg-badge {
        position: absolute;
        background: #ff0017;
        font-size: 8px;
        color: #fff;
        width: 16px;
        height: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        top: -8px;
        right: -8px;
      }
    }
  }
  // end

  .sidebar {
    width: 40vw;
  }

  .side {
    position: fixed;
    top: 45%;
    background: rgba(0, 0, 0, 0.35);
    height: 80px;
    line-height: 80px;
    border-radius: 0 10px 10px 0;
    padding: 3px;
  }

  .fold-enter-active, .fold-leave-active {
    transition: all 0.5s ease-in;
  }

  .fold-enter, .fold-leave-active {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  .loading {
    width: 65px;
    height: 60px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1000;
  }
}
</style>