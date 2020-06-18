<template>
  <div>
    <div class="subtitle">请选择号码</div>
    <van-cell-group>
        <van-field
            readonly
            clickable
            name="_d"
            :value="place"
            label="号码归属"
            @click="showArea = true"
            right-icon="arrow"
            input-align="right"
        />
        <van-field
            readonly
            clickable
            :value="mobile"
            label="选择号码"
            @click="showMobile = true"
            input-align="right"
            right-icon="arrow"
        />
    </van-cell-group>
    <van-popup v-model="showArea" position="bottom">
        <van-area
            :area-list="areaList"
            columns-num="2"
            @confirm="onConfirm"
            @cancel="showArea = false"
        />
    </van-popup>
    <div class="contract">
        <van-checkbox style="align-items:flex-start;" v-model="checked">我已同意并阅读<span class="text-blue" @click.stop="lookContract">《客户入网服务协议及业务协议》</span>、<span class="text-blue" @click.stop="lookContract">《关于信息收集使用规则公告》</span></van-checkbox>
    </div>
    <div class="row m-2t">
        <van-button round type="info" size="normal" block @click="next">下一步</van-button>
    </div>
    <MobileModal :showMobile="showMobile" @closemobilepopup="closePopup" />
    <Contact :show="showContact" @closecontact="closeContactEvent" />
</div>
</template>

<script>
import {Toast} from 'vant'
import MobileModal from "./MobileModal"
import Contact from "./Contact"
export default {
  name: 'SecondStep',
  data: () => ({
    place: "上海 上海",
    mobile: "13333333333",
    showArea: false,
    showMobile: false,
    checked: false,
    showContact: false,
    areaList: {
        province_list: {
          110000: '北京市',
          120000: '天津市'
        },
        city_list: {
          110100: '北京市',
          110200: '县',
          120100: '天津市',
          120200: '县'
        }
      }
  }),
  components: {
      MobileModal,
      Contact
  },
  methods: {
        closePopup (mobile) {
            this.showMobile = false
            if (!mobile) return
            this.mobile = mobile.mobile
        },
        onConfirm () {
            this.showArea = false
        },
        lookContract () {
            this.showContact = true
        },
        next () {
            if (!this.checked) {
                Toast('请勾选我同意协议！')
                return
            }
            this.$emit('next')
        },
        closeContactEvent (agree) {
            this.showContact = false
            if (!this.checked) {
                if (agree.agree) {
                    this.checked = true
                }
            }
        }
  }
}
</script>

<style lang="stylus" scoped>
 
</style>
