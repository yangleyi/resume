<template>
  <div id="login"></div>
</template>

<script>
import querystring from "querystring";
import { mapGetters } from "vuex";
export default {
  mounted() {
    this.login();
  },

  computed: {
    ...mapGetters(["city", "lng", "lat", "messageCount"]),
    messageCount: {
      get: function () {
        return this.$store.state.messageCount
      },
      set: function (count) {
        this.$store.state.messageCount = count
      }
    }
  },

  methods: {
    // 获取消息未读总数
    getMessageData () {
      this.$api.GetMsgList({messageType: 1})
        .then(res => {
          if (res.status != 0) return
          this.messageCount = res.pageData[1].total + res.pageData[2].total + res.pageData[3].total
        })
    },
    login() {
      let str = querystring.parse(
        decodeURI(window.location.search).replace("?", "")
      );
      let para = {};
      try {
        para = JSON.parse(str.p);
        // this.$axios.defaults.headers.common['Session_id'] = para.sessionId
      } catch (err) {
        // if (process.env.NODE_ENV == "production") {
        //   this.$toast("登陆失败!");
        //   return false;
        // }
        // para = { code: "123" };
      }
      // 登录获取session
      this.$api.GetSessionKey({code: para.code}).then(res => {
        // if (str2.sliderShow == 1) {
        //   this.$store.state.sidebarShow = true
        // }
        // this.$axios.defaults.headers.common['Session_id'] = para.sessionid
        this.$axios.defaults.headers.common['SESSIONID'] = res.data.sessionid
        this.$api.GetUser().then(res => {
          this.$store.state.userInfo = res.data;
          // this.$axios.defaults.headers.common['Session_id'] = res.msg
          // 获取消息角标数字
          this.getMessageData()
          let location = [];
          if (para.location) {
            location = para.location;
          } else {
            location = [121.45, 31.23];
          }

          this.$store.state.city = para.locationCity
          this.$store.state.lng = location[0]
          this.$store.state.lat = location[1]
          
          // 从小程序personcard页面进入map地图页面
          if (str.sliderShow) {
            this.$router.push(`/map?lng=${location[0]}&lat=${location[1]}&sliderShow=1`);
            return
          }
          // if (str.searchProject) {
          //   this.$router.push(`/fMap`);
          //   return
          // }
          if (str.customCircle) {
            this.$router.push(`/saleCircle?houseid=${para.houseid}&housename=${para.housename}&lng=${para.projectLocation[0]}&lat=${para.projectLocation[1]}`);
            return
          }
          // 从任务进入绑定公司
          if (str.bindCompany) {
            let path = `/bind-company?mp=${str.bindCompany}`
            if (str.projectId) {
              path = `${path}&projectId=${str.projectId}`
            }
            this.$router.push(path);
            return
          }
          this.$router.push(`/map?lng=${location[0]}&lat=${location[1]}&city=${para.locationCity}`);
        });
      });
    }
  }
};
</script>
