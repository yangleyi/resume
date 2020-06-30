<template>
  <div id="app">
    <layout>
      <keep-alive :include="['map-page', 'list-page']">
        <router-view class="view" v-wechat-title="$route.meta.title"></router-view>
      </keep-alive>
    </layout>
  </div>
</template>

<script>
import layout from "./components/layout";
export default {
  name: "app",
  components: { layout }
};
</script>

<style lang="stylus">
@import './assets/common/common.stylus';
@import './assets/common/vant.stylus';

// .text {
// position: fixed;
// top: 14rem;
// }
html {
  overflow-scrolling: touch;
  -webkit-overflow-scrolling: touch;
}

#app {
  width: 100%;
  height: 100vh;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #3E4A59;
  position: relative;
}

/* app页面切换效果 */
.view {
  position: absolute;
  width: 100%;
  height: 100vh;
  overflow: scroll;
  transition: all 0.35s cubic-bezier(0.35, 0, 0.1, 1);
  background: #F2F2F2;
}

.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(300px, 0);
  transform: translate(300px, 0);
}

.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-300px, 0);
  transform: translate(-300px, 0);
}

/* end */
</style>
