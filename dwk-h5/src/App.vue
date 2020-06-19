<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    transitionName: 'slide-left',
    uuid: null
  }),
  mounted() {
    this.uuid =  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    })
  },
  watch: {
    $route(to, from) {
      if (to.meta.index > from.meta.index) {
            this.transitionName = "slide-left";
      } else {
          this.transitionName = "slide-right";
      }
    }
  },
  components: {}
}
</script>

<style>
@import './assets/css/common.css';
.view {
    position: absolute;
    width:100%;
    transition: all .4s ;
}
.slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
}
.slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%, 0);
}
</style>
