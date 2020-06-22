<template>
  <div>
    <div class="title row m-2t m-2b">
        <h1>你已选择<span>“电信星卡”</span></h1>
        <p>根据国家实名制要求，请提供正确的身份证信息</p>
    </div>
    <van-cell-group>
        <van-field
            v-model="name"
            label="姓名"
            placeholder="请输入证件姓名"
            data-name="name"
            @blur="blur"
            :error-message="nameError"
        />
        <van-field
            v-model="idenNum"
            label="身份证"
            placeholder="请输入身份证号码"
            data-name="idenNum"
            @blur="blur"
            :error-message="idError"
        />
        <van-field
            v-model="phone"
            label="联系电话"
            placeholder="请输入收货联系电话"
            type="tel"
            data-name="phone"
            @blur="blur"
            :error-message="phoneError"
            maxlength="11"
        />
    </van-cell-group>
    <div class="subtitle">请填写配送地址<span>（支持全国配送，新疆、西藏仅限省内配送）</span></div>
    <van-cell-group>
        <van-field
            readonly
            clickable
            name="area"
            :value="showAreaText"
            label="收货地址"
            placeholder="请选择地区"
            @click="showArea = true"
            right-icon="arrow"
            :error-message="areaError"
        />
        <van-field
            v-model="address"
            placeholder="街道/镇村/小区/写字楼+门牌号"
            :error-message="addressError"
            data-name="address"
            @blur="blur"
        />
    </van-cell-group>
    <van-popup v-model="showArea" position="bottom">
        <!-- <van-area
            :area-list="areaList"
            @confirm="onConfirm"
            @cancel="showArea = false"
        /> -->
        <van-picker
            ref="picker"
            show-toolbar
            value-key="name"
            title="标题"
            :columns="areaList" 
            @confirm="areaConfirm"
            @cancel="showArea = false"
        />
    </van-popup>
    <div class="row m-2t">
        <van-button round type="info" size="normal" block @click="next">下一步</van-button>
    </div>
    <div class="intro-msg">
        <span>请保持联系电话畅通，我们可能随时联系您，本次为阶段性优惠活动，数量有限，联系号码无本人接听或恶意下单情况，将不予发货。</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'FirstStep',
  data: function () {
    return {
      name: "",
      idenNum: "",
      phone: "",
      nameError: "",
      idError: "",
      phoneError: "",

      area: "",
      areaError: "",
      address: "",
      addressError: "",
      showArea: false,

      province: "", // 省
      city: "", // 市
      area: "", // 区

      areaList: [],
      params: {
        channel_code: "yk",
        combo_id: 2697,
        channel_id: 3110,
        ad_id: 3110
      }
    }
  },
  mounted () {
      axios
        .get('/pyjgLog/scard/getArea')
        .then(res => {
            let proData = res.data.data
            proData.forEach(pro => {
                pro.children = pro.childlist
                pro.childlist.forEach(city => {
                    city.children = city.childlist
                })
            })
            this.areaList = proData
            console.log(this.$data)
        }).catch(err => {
            console.log('XXX', err)
        })
  },
  computed: {
      showAreaText: function () {
          if (!this.province) return ""
          return this.province + ' ' + this.city + ' ' + this.area
      }
  },
  methods: {
      areaConfirm (e) {
          this.showArea = false
          let a = this.$refs.picker.getColumnValues()
          console.log('area', e, a)
          this.areaError = ""
          this.province = e[0]
          this.city = e[1]
          this.area = e[2]
      },
    // onConfirm (e) {
    //   console.log('onconfirm', e)
    //   this.showArea = false
    //   this.province = e[0].name
    // },
    next () {
        let data = {
            name: this.name,
            idenNum: this.idenNum,
            phone: this.phone,
            province: this.province,
            city: this.city,
            area: this.area,
            address: this.address
        }
        if (!this.name) {
            this.nameError = '请填写姓名'
        } else {
            this.nameError = ''
        }
        if (!this.idenNum) {
            this.idError = '请填写身份证信息'
        } else {
            this.idError = ''
        }
        if (!this.phone) {
            this.phoneError = '请填写手机号码'
        } else {
            if (/^1[3456789]\d{9}$/.test(this.phone)) {
                this.phoneError = ''
            } else {
                this.phoneError = '请输入正确的手机号码'
            }
        }
        if (!this.province) {
            this.areaError = '请选择您的配送范围'
        } else {
            this.areaError = ''
        }
        if (!this.address) {
            this.addressError = '请填写详细地址'
        } else {
            this.addressError = ''
        }
        if (!this.name || !this.idenNum || !this.phone || !this.province || !this.address || /^1[3456789]\d{9}$/.test(this.phone) == false || !this.province || !this.address) return
        console.log('>>>>step1', data)
        axios.post('/pyjgLog/scard/reservation', {
            channel_code: "yk",
            combo_id: 2697,
            channel_id: 3110,
            ad_id: 3110,
            contact_person: data.name,
            contact_tel: data.phone,
            contact_addr: data.address,
            name: data.name,
            iden_num: data.idenNum,
            province: data.province,
            city: data.city,
            area: data.area
        }).then(res => {

        }).catch(err => {
            
        })
        // this.$emit('next', data)
    },
    blur (e) {
        let name = e.target.dataset.name
        switch (name) {
            case "name":
                if (!this.name) {
                    this.nameError = '请填写姓名'
                } else {
                    this.nameError = ''
                }
                break;
            case "idenNum":
                if (!this.idenNum) {
                    this.idError = '请填写身份证信息'
                } else {
                    this.idError = ''
                }
                break;
            case "phone":
                if (!this.phone) {
                    this.phoneError = '请填写手机号码'
                } else {
                    if (/^1[3456789]\d{9}$/.test(this.phone)) {
                        this.phoneError = ''
                    } else {
                        this.phoneError = '请输入正确的手机号码'
                    }
                }
                break;
            case "address":
                if (!this.address) {
                    this.addressError = '请填写详细地址'
                } else {
                    this.addressError = ''
                }
        }
    }
        
  }
}
</script>

<style lang="stylus" scoped>
  
</style>
