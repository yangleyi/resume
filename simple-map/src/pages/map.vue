<template>
  <div id="map">
    <div id="container"></div>
    <img
      class="location"
      v-show="!isDraw && locationShow"
      src="./../assets/location.png"
      @click="setCurrentLocation"
      alt
    >
    <!-- <img class="draw" v-show="!isDraw && !tipShow" src="./../assets/draw.png" alt @click="draw"> -->
    <img class="draw" v-show="isDraw" src="./../assets/draw-active.png" alt @click="cancel_draw">
    <img
      class="clear"
      v-show="isDraw && pixels['1']"
      src="./../assets/clear.png"
      alt
      @click="clear_canvas"
    >
    <div class="btns">
      <button
        v-show="isDraw && total > 0 && !tipShow"
        class="list-btn"
        @click="$refs.popup.eject()"
      >列表</button>
      <button v-show="isDraw && pixels['1']" class="apply-btn" @click="apply">应 用</button>
    </div>
    <van-popup v-model="tipShow" position="top" :overlay="false">
      <div class="tip">超过地图区域最小比例</div>
    </van-popup>
    <!-- <div class="count" v-show="this.total">
      当前范围内符合条件的中介
      <span>{{this.total}}</span>
      家
    </div> -->
    <!-- <select-region @select="setLocation"></select-region>
    <select-person @select="setLocation"></select-person>
    <select-company @select="setLocation"></select-company> -->

    <popup ref="popup"></popup>
  </div>
</template>

<script>
import level1 from "./../assets/level1.png";
import level2 from "./../assets/level2.png";
import level3 from "./../assets/level3.png";
import level4 from "./../assets/level4.png";
import level5 from "./../assets/level5.png";
import did from "./../assets/did.png";
import location1 from "./../assets/location1.png";
import location2 from "./../assets/location2.png";
// import selectRegion from "./../components/selectRegion";
// import selectPerson from "./../components/selectPerson";
// import selectCompany from "./../components/selectCompany";
import popup from "./../components/popup";
import { mapGetters } from "vuex";
// import { setTimeout } from 'timers';

export default {
 
  name: "map-page",
  data: () => ({
    show: true,
    //地图实例
    map: null,
    //地图配置
    mapConfig: {
      //是否监控地图容器尺寸变化
      resizeEnable: true,
      //初始化地图层级
      zoom: 16,
      //初始化地图中心点
      center: []
    },
    //数据总数
    total: 0,
    //画图的次数
    draw_count: 0,
    //画图的坐标集合
    pixels: {},
    //是否为画图模式
    isDraw: false,
    //canvas实例
    canvas: null,
    //画布
    cvs: null,
    // //是否显示筛选条件导航栏
    // filterBarShow: true,
    //级别icon
    levelsIcon: {
      "1": level1,
      "2": level2,
      "3": level3,
      "4": level4,
      "5": level5
    },
    markers: [],
    cluster: null,
    //筛选显示级别
    filter_level: [1, 2, 3, 4, 5],
    //当前可视范围的坐标
    southWest: [],
    northEast: [],
    // //当前点击覆盖物的详情
    // currentDetail: {},
    //当前定位
    currentLocation: [],
    //手动选择的位置
    changeLocation: [],
    locationIcon: location1,

    timer: null,
    detailShow: false,
    tipShow: false,
    promptShow: true,
    locationShow: false
    // dataShow: false
  }),
  mounted() {
     //初始化地图
     this.mapInit()
    // this.currentLocation = [this.$route.query.lng, this.$route.query.lat];
    // // this.currentLocation = [this.$store.state.lng, this.$store.state.lat];
   
    // this.mapConfig.center = this.currentLocation;
    // this.map = new AMap.Map("container", this.mapConfig);
    // this.map.on("moveend", this.isMoveMap);
    // this.setCurrentLocation();
    // // this.getData();
    // // 当有 sliderShow 这个参数的时候，展示侧边栏
    // if (this.$route.query.sliderShow) {
    //   this.$store.state.sidebarShow = true;
    // }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path != "/") {
      next();
    } else {
      next("/map");
    }
  },
  computed: {
    ...mapGetters(["data", "project", "level", "enclosedArea", "params","userInfo", "lng"])
  },
  components: {
    // search,
    // selectRegion,
    // selectPerson,
    // selectCompany,
    popup
  },
  created() {
    // setTimeout(()=>{
    //   //为/fmap 提供数据
    //      this.userInfo.Location=this.currentLocation;
    //     // console.log(this.userInfo,"mapuserInfo")
    //     this.userInfo.store = this.$store
    // },0)
    
  },
  methods: {

    storeClick (store) {
      var infoWindow = new AMap.InfoWindow();
      infoWindow.setContent(store.detail.name);
      infoWindow.open(this.map, store.lnglat);
    },

    //路由跳转
    goMp (path) {
       let city = this.$store.state.city
        this.$wx.miniProgram.navigateTo({
          url: `${path}?city=${city}`
        })
    },
    reLaunch (path) {
        this.$wx.miniProgram.reLaunch({
          url: path
        })
    },

    mapInit () {
      if (this.$store.state.lng) {
        this.currentLocation = [this.$store.state.lng, this.$store.state.lat];
      } else {
        this.currentLocation = [this.$route.query.lng, this.$route.query.lat];
      }
      this.mapConfig.center = this.currentLocation;
      this.map = new AMap.Map("container", this.mapConfig);
      this.map.on("moveend", this.isMoveMap);
      this.setCurrentLocation();
      // this.getData();
      // 当有 sliderShow 这个参数的时候，展示侧边栏
      if (this.$route.query.sliderShow) {
        this.$store.state.sidebarShow = true;
      }
    },
    
    //设置定位
    setLocation(data) {
      // console.log(data);
      this.locationIcon = location2;
      if (this.isDraw) {
        this.isDraw = false;
        this.clear_canvas();
      }
      if (!data.adcode) {
        let id = data.id || data.companyId;
        this.$api
          .GetLatLng({
            id: id,
            lng: this.currentLocation[0],
            lat: this.currentLocation[1]
          })
          .then(res => {
            if (data.personId) {
              this.$store.state.personName = `${data.personName} (${
                data.name
              })`;
              this.$store.state.params.personId = data.personId;
              this.$store.state.selectPersonShow = false;
            } else if (data.companyId) {
              this.$store.state.companyName = data.name;
              this.$store.state.params.companyId = data.companyId;
              this.$store.state.selectCompanyShow = false;
            }
            this.changeLocation = res.data;
            this.setLocationMarker();
            this.getData();
          });
      } else {
        this.changeLocation = [data.location.lng, data.location.lat];
        this.setLocationMarker();
        this.getData();
      }
      this.$refs.popup.reset();
    },
    //设置定位到当前位置
    setCurrentLocation() {
      this.changeLocation = this.currentLocation;
      this.locationIcon = location1;
      this.setLocationMarker();
    },
    //设置定位图标
    setLocationMarker() {
      //移除地图缩放事件
      this.map.off("zoomend", this.getData);
      //移除地图拖动事件
      this.map.off("moveend", this.getData);
      this.map.clearMap();
      this.map.setZoom(this.mapConfig.zoom);
      this.map.setCenter(this.changeLocation);
      let marker = new AMap.Marker({
        icon: this.locationIcon,
        position: this.changeLocation,
        offset: new AMap.Pixel(-13, -30)
      });
      marker.setMap(this.map);
      this.getData();
    },
    //判断是否移动了地图
    isMoveMap() {
      let { lng, lat } = this.map.getCenter();
      let center = [lng, lat];
      if (
        center[0] != this.currentLocation[0] ||
        center[1] != this.currentLocation[1]
      ) {
        this.locationShow = true;
      } else {
        this.locationShow = false;
      }
    },
    //切换到画圈模式
    draw() {
      let self = this;
      self.isDraw = true;
      self.count = 0;
      // self.filterBarShow = false;
      self.clearMapMaker();
      self.map.setStatus({
        dragEnable: false
      });
      self.canvas = document.createElement("canvas");
      self.canvas.width = document.documentElement.clientWidth;
      self.canvas.height = document.documentElement.clientHeight;
      self.cvs = self.canvas.getContext("2d");

      let CanvasLayer = new AMap.CanvasLayer({
        canvas: self.canvas,
        bounds: self.map.getBounds(),
        zooms: self.mapConfig.zoom
      });

      CanvasLayer.setMap(self.map);

      self.map.on("touchstart", self.start_draw);
    },
    //开始画圈
    start_draw(e) {
      let self = this;
      self.draw_count++;

      self.$set(self.pixels, self.draw_count, []);
      this.$store.state.enclosedArea[self.draw_count] = [];

      /*找到鼠标（画笔）的坐标*/
      let start_x =
        e.clientX - self.canvas.offsetLeft + document.body.scrollLeft;
      let start_y = e.clientY - self.canvas.offsetTop + document.body.scrollTop;

      self.cvs.beginPath(); //开始本次绘画
      self.cvs.moveTo(start_x, start_y); //画笔起始点

      /*设置画笔属性*/
      self.cvs.lineCap = "round";
      self.cvs.lineJoin = "round";
      self.cvs.strokeStyle = "#3385ff"; //画笔颜色
      self.cvs.lineWidth = 3; //画笔粗细

      self.map.on("touchmove", this.stroke);
      self.map.on("touchend", this.finish_draw);
    },
    //渲染绘画
    stroke(e) {
      let self = this;

      // 触发事件的地理坐标，AMap.LngLat 类型
      let lnglat = e.lnglat;
      // 触发事件的像素坐标，AMap.Pixel 类型
      let pixel = e.pixel;

      // 找到鼠标（画笔）的坐标
      self.cvs.lineTo(pixel.x, pixel.y);

      //保存画圈时经过的坐标
      self.pixels[self.draw_count].push({ x: pixel.x, y: pixel.y });

      //保存画圈时经过的地图坐标
      this.$store.state.enclosedArea[self.draw_count].push([
        lnglat.lng,
        lnglat.lat
      ]);

      self.cvs.stroke(); //立即渲染
    },
    //结束画圈
    finish_draw(e) {
      let self = this;

      //清空画布
      self.cvs.clearRect(0, 0, self.canvas.width, self.canvas.height);
      self.cvs.lineWidth = 1;

      for (let i in self.pixels) {
        self.cvs.beginPath();
        self.pixels[i].map(pixel => {
          self.cvs.lineTo(pixel.x, pixel.y);
          self.cvs.stroke();
        });
        self.cvs.closePath(); //结束本次绘画
      }
      self.map.off("touchmove", this.stroke);
      self.map.off("touchend", this.finish_draw);
    },
    //添加点标记
    addMarker(item) {
      let self = this;
      var zj_marker = new AMap.Marker({
        map: self.map,
        icon: self.levelsIcon[item.detail.agentGrade],
        // icon: did,
        position: item.lnglat,
        offset: new AMap.Pixel(-13, -30),
        // content: item.detail.name
      });
      zj_marker.content = item.detail.name
      zj_marker.on("click", function(ev) {
        var infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
        infoWindow.setContent(ev.target.content);
        infoWindow.open(self.map, item.lnglat);

        // self.currentDetail = item.detail;
        // self.detailShow = true;
        // self.$refs.popup.eject();
        // self.$router.push(
        //   `/map/detail?cid=${item.detail.id}&uid=${
        //     item.detail.uid
        //   }&roomId=${self.project.nid || self.project.id || ""}`
        // );
      });
      // this.markers.push(zj_marker);
    },
    //添加点聚合
    addCluserMarker() {
      let self = this;
      let _renderCluserMarker = function(context) {
        let count = self.markers.length;
        let factor = Math.pow(context.count / count, 1 / 18);
        let div = document.createElement("div");
        let Hue = 180 - factor * 180;
        let bgColor = "#4192f1";
        let fontColor = "#fff";
        let shadowColor = "#ccc";
        let size = Math.round(30 + Math.pow(context.count / count, 1 / 5) * 60);
        div.classList = "circle";
        div.style.width = div.style.height = size + "px";
        div.style.lineHeight = size + "px";
        div.innerHTML = `<div>${context.count}个</div>`;
        context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2));
        context.marker.setContent(div);
    
      };
      self.cluster && self.cluster.setMap(null);
      self.cluster = new AMap.MarkerClusterer(self.map, self.markers, {
        gridSize: 80,
        renderCluserMarker: _renderCluserMarker
      });
    },
    //应用
    apply() {
      this.map.off("zoomend", this.getData);
      this.map.off("moveend", this.getData);
      this.map.off("touchstart", this.start_draw);

      let lngs = [];
      let lats = [];
      for (let i in this.enclosedArea) {
        this.enclosedArea[i].map(i => {
          lngs.push(i[0]);
          lats.push(i[1]);
        });
      }

      //东北经纬度
      let NorthEast = [Math.max.apply(null, lngs), Math.min.apply(null, lats)];
      //西南经纬度
      let SouthWest = [Math.min.apply(null, lngs), Math.max.apply(null, lats)];

      //设置地图显示范围自适应所画的圈
      let mybounds = new AMap.Bounds(NorthEast, SouthWest);
      this.map.setBounds(mybounds);

      //获取数据
      this.getData();
      // sessionStorage.setItem("enclosedArea", JSON.stringify(this.enclosedArea));
    },
    //获取数据
    getData() {
      this.map.remove(this.markers);
      this.markers = [];
      this.cluster && this.map.remove(this.cluster);
      this.tipShow = true;
      this.total = 0;

      if (this.map.getZoom() < this.mapConfig.zoom) {
        return;
      } else {
        this.tipShow = false;
      }
      //获取当前地图比例显示等级
      // this.getLevels();

      //移除地图缩放事件
      this.map.off("zoomend", this.getData);
      //移除地图拖动事件
      this.map.off("moveend", this.getData);

      this.$store.state.params.xy = [];
      this.$store.state.params.roomId =this.project.nid || this.project.id || "";
      //  console.log(this.$store.state.params,"this.$store.state.params")
      this.getBounds();
      this.$store.state.params.xy = [[this.southWest, this.northEast]];
      this.$api.GetData(this.$store.state.params).then(res => {
        // console.log(res,"res")
        let data = res.data.filter(i => i.lnglat[0] && i.lnglat[1]);
        if (data.length == 0) {
          this.$toast("暂无数据");
          this.clearMapMaker();
          //绑定地图拖动事件
          this.map.on("moveend", this.getData);
          return false;
        }
        if (!this.isDraw) {
          this.$store.state.data = data;
          this.data.map(i => {
            this.addMarker(i);
          });
          //绑定地图拖动事件
          this.map.on("moveend", this.getData);
        } else {
          let matchData = [];
          data.map(i => {
            for (let j in this.enclosedArea) {
              if (
                AMap.GeometryUtil.isPointInRing(i.lnglat, this.enclosedArea[j])
              ) {
                matchData.push(i);
                this.addMarker(i);
              }
            }
          });
          this.$store.state.data = matchData;
        }

        this.$refs.popup.eject();

        this.total = this.data.length;

        if (this.data.length > 100) {
          this.addCluserMarker();
        }

        this.pixels = {};
        this.map.setStatus({
          dragEnable: true
        });
        // this.filterBarShow = true;
        //绑定地图缩放事件
        this.map.on("zoomend", this.getData);
      });
    },
    // 根据地图缩放比例来判断当前需要显示的门店等级，
    // 避免地图缩放和筛选门店条件后显示的门店等级冲突。
    // getLevels() {
    //   let arr = [];
    //   let num = 6;
    //   for (let i = this.mapConfig.zoom - 1; i < this.map.getZoom(); i++) {
    //     num--;
    //     arr.push(num);
    //   }
    //   this.$store.state.params.agentGrade = this.unique(arr, this.filter_level);
    //   this.$store.state.params.agentGrade = this.params.agentGrade.length
    //     ? this.params.agentGrade.join()
    //     : -1;
    // },
    //获取当前地图可视区范围
    getBounds() {
      let tmapBounds = this.map.getBounds();
      this.southWest = [tmapBounds.southwest.lng, tmapBounds.southwest.lat];
      this.northEast = [tmapBounds.northeast.lng, tmapBounds.northeast.lat];
    },
    //取消画圈
    cancel_draw() {
      this.draw_count = 0;
      this.clear_canvas();
      this.isDraw = false;
      // this.filterBarShow = true;
      this.map.off("touchstart", this.start_draw);
      this.map.setStatus({
        dragEnable: true
      });
      this.pixels = {};
      this.$store.state.enclosedArea = {};
      this.getData();
    },
    //清除地图上的点标记
    clearMapMaker() {
      this.map.remove(this.markers);
      this.markers = [];
      this.cluster && this.map.remove(this.cluster);
      this.total = 0;
      this.$store.state.data = [];
    },
    //清除canvas
    clear_canvas() {
      this.draw_count = 0;
      this.clearMapMaker();
      this.pixels = {};
      this.$store.state.enclosedArea = {};
      this.cvs.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    //取重复的值
    // unique(arr1, arr2) {
    //   let result = [];
    //   arr1.map(i => {
    //     arr2.map(j => {
    //       if (i == j) {
    //         result.push(i);
    //       }
    //     });
    //   });
    //   return result;
    // }
  },
  watch: {
    lng (val) {
      this.mapInit()
    },
    project(val) {
      console.log(111)
      if (val.id || val.nid) {
        if (this.isDraw) {
          this.isDraw = false;
          this.clear_canvas();
        }
        this.$refs.popup.reset();
        // this.dataShow = true;
        this.$dialog
          .confirm({
            title: "提示",
            message: "<p>是否显示项目附近</p><p>与项目匹配的分销门店</p>"
          })
          .then(() => {
            this.changeLocation = this.project.lnglat;
            this.locationIcon = location2;
            this.setLocationMarker();
          })
          .catch(() => {
            this.getData();
          });
      } else {
        if (!this.isDraw) {
          this.getData();
        }
      }
    }
  }
};
</script>

<style lang="stylus">
#map {
  // 分销名单 
  .quick-link {
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
  }
  .nameList {
    right: 10px;
  }
  .desktop-link {
    left: 10px;
  }
  #search {
    background: rgba(255, 255, 255, 0.9);

    .hot {
      .tag {
        background: transparent;
      }
    }
  }

  .van-search--show-action {
    background: #fff !important;
  }

  #filter-bar {
    background: transparent;
  }

  .draw, .clear, .location {
    width: 65px;
    height: 65px;
    position: fixed;
    z-index: 999;
    right: 10px;
  }

  .draw {
    bottom: 5.2rem;
  }

  .clear {
    bottom: 7.8rem;
  }

  .location {
    width: 60px;
    height: 60px;
    left: 5px;
    bottom: 4.5rem;
  }

  .btns {
    box-shadow: 0 0 13px #888888;
    position: fixed;
    right: 14px;
    bottom: 3rem;
    display: flex;
    justify-content: center;
    z-index: 1000;
    border-radius: 50%;

    button {
      width: 53px;
      height: 53px;
      font-size: 13px;
      border-radius: 50%;
    }

    .list-btn {
      background: rgba(255, 255, 255, 0.9);
      color: #FF5F00;
    }

    .apply-btn {
      background: linear-gradient(to bottom right, #EB5E60, #F87529);
      color: #fff;
    }
  }

  #container {
    width: 100%;
    height: 100vh;
  }

  .amap-icon img, .amap-marker-content img {
    width: 25px;
    height: 35px;
  }

  .marker {
    position: absolute;
    top: -20px;
    right: -118px;
    color: #fff;
    padding: 4px 10px;
    box-shadow: 1px 1px 1px rgba(10, 10, 10, 0.2);
    white-space: nowrap;
    font-size: 12px;
    font-family: '';
    background-color: #25A5F7;
    border-radius: 3px;
  }

  .circle {
    background-color: rgba(65, 146, 241, 0.8);
    border-radius: 50%;
    box-shadow: rgb(204, 204, 204) 0px 0px 1px;
    color: #fff;
    font-size: 14px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .input-card {
    width: 32rem;
    z-index: 170;
  }

  .input-card .btn {
    margin-right: 0.8rem;
  }

  .input-card .btn:last-child {
    margin-right: 0;
  }

  .detail {
    background: #fff;
    padding: 0 6px;

    div {
      font-size: 15px;
      padding: 6px 0;
      display: inline-block;
    }

    .cover {
      width: 100%;
      height: 200px;
    }
  }

  .tip {
    font-size: 15px;
    padding: 10px;
    text-align: center;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
  }

  .count {
    width: 100%;
    position: absolute;
    bottom: 65px;
    z-index: 999;
    font-size: 16px;
    text-align: center;
    background: rgba(255, 255, 255, 0.8);
    padding: 6px;
    margin-bottom: 1px;

    span {
      color: #FF5F00;
    }

    .btn {
      width: 100%;
      height: 55px;
      background: rgba(255, 255, 255, 0.9);
      color: #FF5F00;
    }
  }
}
</style>
