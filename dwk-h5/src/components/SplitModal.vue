<template>
  <div class="form bg">
      <div class="box" :style="{backgroundImage: `url(${bg})`}">
          <div class="row">
              <label>姓名</label>
              <input 
                v-model="name"
                data-name="name"
                placeholder="请输入开卡人姓名"
                @blur="blur"
                />
          </div>
          <div class="row">
              <label>办理身份证</label>
              <input 
                v-model="idCard"
                data-name="idCard"
                placeholder="请输入办理身份证"
                @blur="blur"
                />
          </div>
          <div class="row">
              <label>联系号码</label>
              <input 
                v-model="mobile"
                data-name="mobile"
                placeholder="请输入联系号码"
                @blur="blur"
                maxlength="11"
                />
          </div>
          <div class="row">
              <label>收货省市</label>
              <input
                data-name=""
                placeholder="请选择地区"
                disabled="true"
                @click="showArea = true"
                />
          </div>
            <van-popup v-model="showArea" position="bottom">
                <van-area
                    :area-list="areaList"
                    @confirm="onConfirm"
                    @cancel="showArea = false"
                />
            </van-popup>
        <!-- <van-cell-group>
            <van-field
                v-model="name"
                label="姓名"
                placeholder="请输入开卡人姓名"
                data-name="name"
                @blur="blur"
                :error-message="nameError"
            />
            <van-field
                v-model="idCard"
                label="办理身份证"
                placeholder="请输入办理身份证"
                data-name="idCard"
                @blur="blur"
                :error-message="idError"
            />
            <van-field
                v-model="mobile"
                label="联系号码"
                placeholder="请输入联系号码"
                type="tel"
                data-name="mobile"
                @blur="blur"
                :error-message="mobileError"
                maxlength="11"
            />
        </van-cell-group>
        <van-cell-group>
            <van-field
                readonly
                clickable
                name="area"
                :value="area"
                label="收货省市"
                placeholder="请选择地区"
                @click="showArea = true"
                right-icon="arrow"
                :error-message="areaError"
            />
            <van-field
                v-model="address"
                label="详细地址"
                placeholder="请输入详细地址"
                data-name="address"
                :error-message="addressError"
            />
        </van-cell-group>
        <van-popup v-model="showArea" position="bottom">
            <van-area
                :area-list="areaList"
                @confirm="onConfirm"
                @cancel="showArea = false"
            />
        </van-popup> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'SplitModal',
  data: function () {
    return {
        bg: require('./../assets/xk3.png'),
      name: "",
      idCard: "",
      mobile: "",
      nameError: "",
      idError: "",
      mobileError: "",

      area: "",
      areaError: "",
      address: "",
      addressError: "",
      showArea: false,
      activeData: [],
      cityData: {},
      areaList: {
        province_list: {
        //   110000: '北京市',
        //   120000: '天津市'
        },
        city_list: {
        //   110100: '北京市',
        //   110200: '县',
        //   120100: '天津市',
        //   120200: '县'
        },
        county_list: {
        //   110101: '东城区',
        //   110102: '西城区',
        //   110105: '朝阳区',
        //   110106: '丰台区',
        //   120101: '和平区',
        //   120102: '河东区',
        //   120103: '河西区',
        //   120104: '南开区',
        //   120105: '河北区',
        }
      }
    }
  },
  mounted () {
      axios
        .get('/getArea')
        .then(res => {
            let proData = res.data.data
            this.cityData = proData
            this.activeData = proData
            // let newData = {province_list: {}, city_list: {}, county_list: {}}
            // proData.forEach(pro => {
            //     newData["province_list"][pro.code] = pro.name
            //     pro.childlist.forEach(city => {
            //         newData["city_list"][city.code] = city.name
            //         city.childlist.forEach(ar => {
            //             newData["county_list"][ar.code] = ar.name
            //         })
            //     })
            // })
            // this.areaList = newData
        }).catch(err => {
            console.log('XXX', err)
        })
  },
  methods: {
    onConfirm (e) {
      console.log('onconfirm', e)
      this.showArea = false
      this.area = e[0].name
    },
    next () {
        let data = {
            name: this.name,
            card: this.idCard,
            mobile: this.mobile,
            area: this.area,
            address: this.address
        }
        if (!this.name) {
            this.nameError = '请填写姓名'
        } else {
            this.nameError = ''
        }
        if (!this.idCard) {
            this.idError = '请填写身份证信息'
        } else {
            this.idError = ''
        }
        if (!this.mobile) {
            this.mobileError = '请填写手机号码'
        } else {
            if (/^1[3456789]\d{9}$/.test(this.mobile)) {
                this.mobileError = ''
            } else {
                this.mobileError = '请输入正确的手机号码'
            }
        }
        if (!this.area) {
            this.areaError = '请选择您的配送范围'
        } else {
            this.areaError = ''
        }
        if (!this.address) {
            this.addressError = '请填写详细地址'
        } else {
            this.addressError = ''
        }
        if (!this.name || !this.idCard || !this.mobile || !this.area || !this.address || /^1[3456789]\d{9}$/.test(this.mobile) == false || !this.area || !this.address) return
        this.$emit('next', data)
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
            case "idCard":
                if (!this.idCard) {
                    this.idError = '请填写身份证信息'
                } else {
                    this.idError = ''
                }
                break;
            case "mobile":
                if (!this.mobile) {
                    this.mobileError = '请填写手机号码'
                } else {
                    if (/^1[3456789]\d{9}$/.test(this.mobile)) {
                        this.mobileError = ''
                    } else {
                        this.mobileError = '请输入正确的手机号码'
                    }
                }
                break;
        }
    }
        
  }
}
</script>

<style scoped>
    .row {
        font-size: 14px;
        color: #fff;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;
    }
    .row label {
        width: 6em;
    }
    .row input {
        flex-grow: 1;
        padding: 10px;
        border-radius: 5px;
        background: #fff;
        outline: none;
        border: 1px solid #9A81FF;
        color: #301896;
    }
    .row .select-box {
        flex-grow: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .select {
        width: 32%;
        text-align: center;
        background: #ffffff;
        border: none;
        padding: 10px 0;
        border-radius: 5px;
        color: #301896;
    }
  .bg {
      background: #150B59;
  }
  .box {
      width: calc(100% - 20px);
      margin-left: auto;
      margin-right: auto;
      border-radius: 10px;
      overflow: hidden;
      padding: 10px;
  }
  .van-cell-group {background: transparent!important}
  .van-cell {background: transparent!important;color: #fff;}
  .van-cell .van-field__control input {
      color: #fff!important;
    }
</style>
