<template>
  <div id="list">
    <!-- <div class="title">附近门店</div> -->
    <div class="title">
      <span>{{data.length}}个门店</span>
      <!-- <Icon name="close" size="22px" color="#000" /> -->
      <img v-show="showCloseIcon" class="close" src="./../assets/close.png" @click="close" />
    </div>
    <div class="list">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <ul>
          <li v-for="(item, index) in list" :key="index">
            <div v-show="isHandle" style="margin-right: 10px;">
              <van-checkbox v-model="item.checked" @change="change(item, index)"></van-checkbox>
            </div>
            <div
              class="describe"
              @click="storeClick(item)"
            >
              <!-- @click="$router.push(`/map/detail?cid=${item.detail.id}&uid=${item.detail.uid}&roomId=${project.nid || project.id || ''}` )" -->
              <div class="fl">
                <img v-lazy="$config.imgSrc + item.detail.imageUrl">
              </div>
              <div class="fr">
                <p class="name" style="font-size: 15px;">{{item.detail.name + item.detail.store}}</p>
                <!-- <p style="margin-top: -3px; padding-bottom: 2px;">
                  <span style="font-size: 13px; color: #747474;">主营业务</span>
                  <van-tag
                    v-for="(type, index) in item.detail.masterWorks"
                    :color="$getColor(type)"
                    plain
                    :key="index"
                  >{{type}}</van-tag>
                </p> -->
                <div class="store-manage">
                  <span>{{item.detail.legalPersonName}}</span>
                  <span class="mobile">1500000000</span>
                </div>
                <p style="font-size: 13px; color: #747474">{{item.detail.address}}</p>
              </div>
            </div>
            <span
              class="match-num"
              v-if="item.detail.matchScore"
            >{{`与${project.name || project.keyword}项目业务匹配度${item.detail.matchScore}%`}}</span>
            <!-- <div class="person">
              <div class="item">
                <p>法人代表</p>
                <p>{{item.detail.legalPersonName}}</p>
              </div>
              <div class="item">
                <p>注册资本</p>
                <p>{{item.detail.regCapital}}</p>
              </div>
              <div class="item">
                <p>成立日期</p>
                <p>{{item.detail.estiblishTime}}</p>
              </div>
            </div>-->
          </li>
        </ul>
      </van-list>
    </div>

    <!-- <div class="btn" v-show="!isHandle && list.length">
      <button v-for="(item, index) in btns" :key="index" @click="handle(item.type)">{{item.name}}</button>
    </div> -->
    <!-- <div class="btn" v-show="isHandle">
      <button @click="cancel">取消</button>
      <button
        v-show="setId.length"
        style="background: linear-gradient(to bottom right, #EB5E60, #F87529);color: #fff;"
        @click="complete"
      >完成</button>
    </div> -->

    <!-- <van-actionsheet v-model="show" :actions="actions" cancel-text="取消" @select="onSelect"/>

    <van-dialog v-model="addShow" title="新建收藏夹" show-cancel-button @confirm="newCollection">
      <div style="padding: 20px;">
        <van-field v-model="addName" label="收藏夹名称" placeholder="请输入收藏夹名称"/>
      </div>
    </van-dialog> -->
  </div>
</template>

<script>
// import search from "./../components/search";
import { mapGetters } from "vuex";
export default {
  name: "list-page",
  props: {
    showCloseIcon: {
      type: Boolean,
      default: true
    },
  },
  data: () => ({
    isHandle: false,
    list: [],
    loading: false,
    finished: false,
    // scrollTop: 0
    pageNum: 0,
    btns: [
      { name: "收藏", type: 1 },
      // { name: "合作", type: 2 },
      { name: "加入任务", type: 3 }
    ],
    type: 1,
    show: false,
    addShow: false,
    addName: "",
    setId: [],
    setCheckedIndex: [],
    actions: [
      {
        name: "新建收藏夹",
        add: true
      }
    ]
  }),
  computed: {
    ...mapGetters(["data", "project"])
  },
  components: {
    // search
  },
  activated() {
    // this.onLoad();
    document.getElementsByClassName("list")[0].scrollTop = this.scrollTop;
  },
  beforeRouteLeave(to, from, next) {
    this.scrollTop = document.getElementsByClassName("list")[0].scrollTop;
    next();
  },
  mounted() {
  },
  methods: {
    close () {
      this.$emit('closePopup');
    },
    storeClick (item) {
      this.$emit('storeClick', item)
    },
    onLoad() {
      setTimeout(() => {
        let length = (this.pageNum + 1) * 10 - 1;
        if (length >= this.data.length) {
          length = this.data.length - 1;
          this.finished = true;
        }
        for (let i = this.pageNum * 10; i < length; i++) {
          let obj = JSON.parse(JSON.stringify(this.data[i]));
          obj.checked = false;
          this.list.push(obj);
        }
        this.pageNum++;
        this.loading = false;
      }, 600);
    },
    handle(type) {
      this.type = type;
      this.isHandle = true;
      this.$api.GetCollect({ type }).then(res => {
        this.actions = [...this.actions, ...res.data];
      });
    },
    cancel() {
      this.isHandle = false;
    },
    complete() {
      this.show = true;
    },
    change(item, index) {
      if (item.checked) {
        this.setId.push(item.detail.uid);
        this.setCheckedIndex.push(index);
      } else {
        let index1 = this.setId.indexOf(item.detail.uid);
        let index2 = this.setCheckedIndex.indexOf(index);
        if (index1 > -1) {
          this.setId.splice(index1, 1);
        }
        if (index2 > -1) {
          this.setCheckedIndex.splice(index2, 1);
        }
      }
      console.log(this.setId);
    },
    onSelect(item) {
      if (item.add) {
        this.addShow = true;
      } else {
        this.addCollect(item.id);
      }
    },
    addCollect(id) {
      this.$api
        .AddCollect({
          oadIds: this.setId.join(","),
          collectId: id
        })
        .then(res => {
          this.$toast(res.msg);
          this.show = false;
          this.isHandle = false;
          this.list.map(i => {
            i.checked = false;
          });
        });
    },
    newCollection() {
      if (!this.addName) {
        this.$toast("收藏夹名称不能为空");
        return false;
      }
      this.$api
        .NewCollect({ name: this.addName, type: this.type })
        .then(res => {
          this.addName = "";
          this.addCollect(res.data);
        });
      // this.show = false;
    }
  },
  watch: {
    data() {
      this.scrollTop = 0;
      this.pageNum = 0;
      this.list = [];
      this.loading = false;
      this.finished = false;
      this.onLoad()
    },
    isHandle(val) {
      if (!val) {
        this.setId = [];
        this.actions = [
          {
            name: "新建收藏夹",
            add: true
          }
        ];
        this.setCheckedIndex.map(i => {
          this.list[i].checked = false;
        });
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
#list {
  .title {
    color: #666;
    font-size: 13px;
    padding: 5px 10px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .close {
      width: 25px;
      height: 25px;
    }
  }

  .list {
    padding: 5px;
    padding-top: 0;
    height: calc(100vh - 82px);
    overflow: scroll;
  }

  ul {
    // padding: 5px;
    // padding-top: 0;
    // height: calc(100vh - 85px);
    // overflow: scroll;
    li {
      // box-shadow: 1px 1px 5px #888;
      // padding: 10px;
      // right: bottom left;
      // background: #fff;
      // border-radius: 5px;
      // margin-bottom: 6px;
      margin: 5px;
      padding: 5px 0;
      border-bottom: 1px solid #eee;
      display: flex;
      align-items: center;

      .describe {
        display: flex;
        width: 100%;

        .fl {
          display: inline-block;
          width: 65px;

          img {
            width: 100%;
            height: 65px;
            margin-top: 3px;
            border-radius: 6px;
          }
        }

        .fr {
          display: inline-block;
          width: 65%;
          margin-left: 10px;

          .title {
            font-size: 16px;
          }
          .store-manage {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            color: #777;
            margin-top: 3px;
            margin-bottom 3px;
          }
          .mobile {color: #60a9fc;}
        }
      }

      .match-num {
        font-size: 13px;
        color: #f8aa71;
        font-weight: bold;
      }
    }
  }

  .btn {
    position: fixed;
    bottom: 0;
    width: 100%;
    display: flex;
    z-index: 1000;
    box-shadow: 0 0 13px #888888;

    button {
      flex: 1;
      height: 45px;
      font-size: 13px;
      border-right: 1px solid #eee;
      background: #fff;

      &:last-child {
        border: none;
      }
    }
  }
}
</style>
