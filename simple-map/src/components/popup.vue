<template>
  <div
    id="popup"
    :style="[transform(), {top: top + 'px'}, {height: (clientHeight - 30) + 'px'}, {'transition-timing-function': 'ease'}, {'transition-duration': duration + 'ms'}]"
    @touchstart.stop="touchstart"
    @touchmove.stop="touchmove"
    @touchend.stop="touchend"
  >
    <div class="line"></div>
    <!-- <div class="search-box">
      <div class="search-cont">
        <img src="./../assets/sousuo.png" />
        <input class="search" placeholder="请搜索" />
      </div>
    </div> -->
    <div class="navbar" v-show="!excludePath.test($route.path)">
      <van-search
        v-model="value"
        placeholder="请输入项目名称"
        show-action
      >
        <!-- @focus.stop="focus"
        @blur.stop="blur"
        @input="getProject" -->
        <div v-show="cancelShow" slot="action" @click.stop="cancel">取消</div>
        <div v-show="value && posheight == 0" slot="action" @click.stop="removeProject">重置</div>
      </van-search>
      <ul v-show="show && !isSearch">
        <li v-for="(item, index) in tabList" :key="index" @click.stop="toPage(item, index)">
          <img :src="index == activeIndex ? item.active : item.img" alt>
          <p>{{item.title}}</p>
        </li>
      </ul>
    </div>
    <div
      v-show="!isSearch"
      :style="[{height: excludePath.test($route.path) ? 'calc(100vh - 33px)' : '100vh'}]"
    >
      <!-- :style="[{height: excludePath.test($route.path) ? 'calc(100vh - 33px)' : 'calc(100vh - 240px)'}]" -->
      <!-- <router-view class="c-view" v-wechat-title="$route.meta.title"></router-view> -->
      <!-- <history v-show="!show"/> -->
      <List @closePopup="closePopup" v-bind="$attrs" @storeClick="storeClick" />
    </div>
    <ul class="result" v-show="isSearch">
      <li v-for="(item, index) in result" :key="index" @click="changeProject(item)">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
// import History from "./history";
import List from "./../pages/list";
import { mapGetters } from "vuex";
export default {
  data: () => ({
    timer: null,
    value: "",
    isSearch: false, // false
    result: [],
    excludePath: /detail|company-list/,
    show: false,
    cancelShow: false,
    clientHeight: document.documentElement.clientHeight,
    maxHeight: document.documentElement.clientHeight - 65,
    top: 0,
    start: {}, // 记录起始位置
    end: {}, // 记录终点位置
    // posheight: 0, // 记录位移
    oldPosheight: 0,
    tracking: false, // 是否在滑动，防止多次操作，影响体验
    LastDistanceY: 0,
    duration: 200,
    isTop: false,
    isTouch: false,
    tabList: [],
    activeIndex: -1
  }),
  mounted() {
    this.top = this.maxHeight;
    this.cancel()
  },
  // components: { History },
  components: {List},
  computed: {
    ...mapGetters(["project", "posheight"])
  },
  methods: {
    closePopup () {
      console.log('close')
      this.$store.state.posheight = 0
    },
    storeClick (store) {
      this.$parent.storeClick(store)
      // let obj = {detail: store.detail, lnglat: store.lnglat}
      // this.$emit('storeClick', obj)
    },
    touchstart(e) {
      // this.cancelShow = false;
      // document.querySelector(".van-field__control").blur();
      let scrollTop1 = document.querySelector(".c-view")
        ? document.querySelector(".c-view").scrollTop
        : 0;
      let scrollTop2 = document.querySelector(".list")
        ? document.querySelector(".list").scrollTop
        : 0;
      this.duration = 0;
      if (this.tracking) {
        return;
      }
      // 是否为touch
      if (e.type === "touchstart") {
        if (e.touches.length > 1) {
          this.tracking = false;
          return;
        } else {
          // 记录起始位置
          this.start.x = e.targetTouches[0].clientX;
          this.end.x = e.targetTouches[0].clientX;
          this.start.y = e.targetTouches[0].clientY;
          this.end.y = e.targetTouches[0].clientY;
          this.oldPosheight = this.posheight;
        }
        // pc操作
      }
      // else {
      //   this.start.x = e.clientX;
      //   this.end.x = e.clientX;
      //   this.start.y = e.clientY;
      //   this.end.y = e.clientY;
      //   this.oldPosheight = this.posheight;
      // }
      // if (Math.abs(this.temporaryData.posheight) == this.maxHeight - 30) {
      //   if (this.basicdata.start.y < 80) {
      //     this.temporaryData.tracking = true;
      //   } else {
      //     this.temporaryData.tracking = false;
      //   }
      // } else {
      //   this.temporaryData.tracking = true;
      // }
      let isScroll = false;
      if (scrollTop1 > 0 || scrollTop2 > 0) {
        isScroll = true;
      }
      if (isScroll && Math.abs(this.posheight) == this.maxHeight - 30) {
        this.tracking = false;
      } else {
        this.tracking = true;
      }
    },
    touchmove(e) {
      // 记录滑动位置
      if (
        this.tracking &&
        this.posheight <= 0 &&
        Math.abs(this.posheight) <= this.maxHeight - 30
      ) {
        if (e.type === "touchmove") {
          this.isTouch = true;
          this.end.x = e.targetTouches[0].clientX;
          this.end.y = e.targetTouches[0].clientY;
        } else {
          this.end.x = e.clientX;
          this.end.y = e.clientY;
        }

        //是否横向滑动
        let isTouchX =
          Math.abs(this.end.x - this.start.x) >
          Math.abs(this.end.y - this.start.y);
        if (isTouchX) {
          return;
        }

        this.isTop = this.end.y - this.start.y < 0 ? true : false;
        // 计算滑动值
        let distanceY =
          Math.abs(this.end.y - this.start.y) - Math.abs(this.LastDistanceY);
        if (this.isTop) {
          if (Math.abs(this.posheight) == this.maxHeight - 30) {
            this.$store.state.posheight += 0;
          } else {
            this.$store.state.posheight -= distanceY;
          }
        } else {
          e.preventDefault();
          this.$store.state.posheight += distanceY;
        }
        this.LastDistanceY = this.end.y - this.start.y;
        // }
      }
    },
    touchend() {
      //最终滑动距离
      let distanceY = this.end.y - this.start.y;
      this.duration = 200;
      this.LastDistanceY = 0;
      if (this.isTouch && Math.abs(distanceY) > 120) {
        // if (
        //   Math.abs(this.temporaryData.posheight) >
        //   this.clientHeight / 2 + 100
        // ) {
        //   this.temporaryData.posheight = -(this.maxHeight - 30);
        // } else if (
        //   Math.abs(this.temporaryData.posheight) > 100 &&
        //   Math.abs(this.temporaryData.posheight) < this.clientHeight / 2 + 100
        // ) {
        //   this.temporaryData.posheight = -(this.clientHeight / 2 - 50);
        // } else {
        //   this.temporaryData.posheight = 0;
        // }
        if (this.isTop) {
          if (Math.abs(this.posheight) > this.clientHeight / 2) {
            this.$store.state.posheight = -(this.maxHeight - 30);
          } else {
            this.value = "";
            // this.isSearch = false;
            this.activeIndex = -1;
            this.$store.state.posheight = -(this.clientHeight / 2 - 50);
            if (!this.excludePath.test(this.$route.path)) {
              // this.$router.push("/map?lng=121.45&lat=31.23");
            }
          }
        } else {
          // console.log(this.$route.path != "/map/detail")
          if (
            Math.abs(this.posheight) > this.clientHeight / 2 &&
            Math.abs(this.posheight) < this.maxHeight - 150
          ) {
            this.value = "";
            // this.isSearch = false;
            this.activeIndex = -1;
            this.$store.state.posheight = -(this.clientHeight / 2 - 50);
            if (!this.excludePath.test(this.$route.path)) {
              // this.show = false;
              // this.$router.push("/map?lng=121.45&lat=31.23");
            }
          } else {
            this.reset();
          }
          this.cancelShow = false;
        }
        if (Math.abs(this.posheight) > this.maxHeight - 30) {
          this.$store.state.posheight = -(this.maxHeight - 30);
        }
        if (this.posheight > 0) {
          this.reset();
        }
      } else if (this.isTouch) {
        this.$store.state.posheight = this.oldPosheight;
      }
      this.isTouch = false;
      this.tracking = false;
      // this.isTouch = true
      // if (Math.abs(this.temporaryData.posheight) > 350) {
      //   if (this.temporaryData.posheight < 0) {
      //     this.bottom += this.maxHeight;
      //   } else {
      //     this.bottom -= this.maxHeight;
      //   }
      //   this.temporaryData.posheight = 0;
      // } else if (Math.abs(this.temporaryData.posheight) > 150) {
      //   if (this.temporaryData.posheight < 0) {
      //     this.bottom += this.maxHeight / 2;
      //   } else {
      //     this.bottom -= this.maxHeight / 2;
      //   }
      // }
      // this.temporaryData.posheight = 0;
      // 滑动结束，触发判断
    },
    // 首页样式切换
    transform() {
      // 处理3D效果
      let style = {};
      style["transform"] = `translate3D(0px,${this.posheight}px,0px)`;
      return style;
    },
    focus() {
      if (Math.abs(this.posheight) == this.maxHeight - 30 && this.show) {
        return;
      }
      this.eject();
    },
    blur() {
      window.scrollTo(0, 0);
    },
    cancel() {
      this.value = "";
      // this.show = false;
      this.cancelShow = false;
      // this.isSearch = false;
      this.activeIndex = -1;
      this.duration = 200;
      this.$store.state.posheight = -(this.clientHeight / 2 - 50);
      this.$router.push("/map?lng=121.45&lat=31.23");
    },
    removeProject() {
      this.$dialog
        .confirm({
          title: "提示",
          message: "<p>确定要重置项目吗？</p>"
        })
        .then(() => {
          this.value = "";
          this.$store.state.project = {};
        });
    },
    toPage(item, index) {
      this.activeIndex = index;
      if (item.link) {
        this.$router.push(item.link);
      } else {
          if(item.type == 'downloadName' ){
            this.$wx.miniProgram.navigateTo({
              url: "../msgDetail/chooseDistribution/chooseDistribution"
              })
          }
        this.$store.state[item.type] = true;
      }
    },
    reset() {
      this.activeIndex = -1;
      this.cancelShow = false;
      this.$store.state.posheight = 0;
      // this.isSearch = false;
      this.value = this.project.name || this.project.keyword;
      if (!this.excludePath.test(this.$route.path)) {
        // this.show = false;
        // this.$router.push("/map?lng=121.45&lat=31.23");
      }
    },
    eject() {
      this.value = "";
      this.show = true;
      this.duration = 300;
      this.cancelShow = true;
      // this.$store.state.posheight = -(this.maxHeight - 30);
       this.$store.state.posheight = 0
      // if (this.$route.path === '/map/list') return
      // this.$router.push("/map/list");
    },
    getProject() {
      if (this.value) {
        this.isSearch = true;
        this.timer = setTimeout(() => {
          clearTimeout(this.timer);
          this.$api.GetProject({ name: this.value }).then(res => {
            this.result = res.data;
          });
        }, 1000);
      } else {
        // this.isSearch = false;
        clearTimeout(this.timer);
        this.result = [];
      }
    },
    changeProject(item) {
      this.$store.state.project = item;
      this.value = item.name || item.keyword;
      this.result = [];
      // item.name && this.$api.SaveHistory({ keyword: item.name, id: item.id });
      this.reset();
    }
  },
  watch: {
    value(v) {
      if (!v) {
        // this.isSearch = false;
      }
    },
    $route(to) {
      if (to.path == "/map/list") {
        this.activeIndex = -1;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
#popup {
  width: 100%;
  background: #fff;
  position: fixed;
  z-index: 1000;
  border-radius: 8px 8px 0 0;

  .search-box {
    padding-top: 10px;
    padding-bottom: 10px;
    background: #fff;
    .search-cont {
      width: calc(100% - 40px);
      box-sizing: border-box;
      padding-left: 10px;
      padding-right: 10px;
      margin-right: auto;
      margin-left: auto;
      background: #f5f5f5;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
      }
      .search {
        background: #f5f5f5;
        height: 30px;
        border-radius: 2px;
        flex-grow: 1;
        margin-left: 10px;
      }
    }
  }

  .navbar {
    ul {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 1px solid #eee;

      li {
        width: 20%;
        text-align: center;
        padding: 5px 0;

        img {
          width: 40px;
        }
        p {
          font-size: 12px;
          margin-top: -5px;
        }
      }
    }
  }

  .line {
    width: 35px;
    height: 3px;
    background: #eee;
    margin: 0 auto;
    border-radius: 10px;
    margin-top: 6px;
  }
}

.c-view {
  height: 100%;
  overflow: scroll;
}

.result {
  font-size: 15px;
  padding-left: 15px;
  width: 100%;

  li {
    padding: 10px 0;
    border-bottom: 1px solid #eee;
  }
}
</style>
