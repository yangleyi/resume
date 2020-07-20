var Contact = {
    props: ['show'],
    methods: {
        closeContactModal (agree) {
            this.$emit('closecontact', {agree: agree === true ? agree : false})
        }
    },
    template: `
    <van-popup v-model="show" :close-on-click-overlay="false">
        <div class="mobile-modal contact-box">
            <div class="contact">
                <p>1、生效规则 <br>
                本套餐为电信星卡（升级版）；用户激活后立即生效。首月执行过渡期资费，订购当月套餐月基本费按日计扣（入网当日到月底），费用四舍五入到分；本套餐内国内通用流量6GB，100分钟通话。<br>
                2、定向流量、专属权益规则<br>
                2.1 每月可获得200G专属APP流量，订购立即生效。<br>
                2.2专属APP流量包所含流量为国内流量，限在中国大陆境内（不含港澳台地区）使用，不含WLAN（Wi-Fi）上网。该流量的计费层级高于所有流量产品，包括主套餐、各种其他流量包和流量卡，即使用该专属流量时，无条件优先使用此专属流量包内流量，该流量不纳入原套餐流量断网阈值计算范围。同时专属流量包不适用于流量不清零规则。<br>
                2.3、免流APP使用说明：<br>
                （1）所有APP均需要升级到最新版本才能享受免流服务。<br>
                （2）所有APP免费专属流量不包括以下使用范围：<br>
                在无线上网卡、移动WIFI、平板电脑（如ipad）等设备使用时；将手机号码作为手机热点使用时；使用网络加速器、代理服务费、VPN等工具时；在中国香港、中国台湾、中国澳门及国际地区使用时APP内开机广告及第三方广告、图片、网页视频等产生的流量；APP中访问外部链接或转发到外部应用产生的流量；APP内直播业务不免流。<br>
                （3）更多免流APP及免流使用说明请到电信营业厅咨询详情。<br></p>
            </div>
            <div class="contact-foot">
                <button class="close" @click="closeContactModal">关闭</button>
                <button class="agree" @click="closeContactModal(true)">同意</button>
            </div>
        </div>
    </van-popup>`
}
var FirstStep = {
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
    
          province: "啊", // 省
          city: "", // 市
          area: "", // 区
    
          checked: true,
          showContact: false,
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
        // axios
        //     .get('/pyjgLog/scard/getArea')
        //     .then(res => {
        //         let proData = res.data.data
        //         proData.forEach(pro => {
        //             pro.children = pro.childlist
        //             pro.childlist.forEach(city => {
        //                 city.children = city.childlist
        //             })
        //         })
        //         this.areaList = proData
        //         console.log(this.$data)
        //     }).catch(err => {
        //         console.log('XXX', err)
        //     })
    },
    computed: {
        showAreaText: function () {
            if (!this.province) return ""
            return this.province + ' ' + this.city + ' ' + this.area
        }
    },
    methods: {
        lookContract () {
            this.showContact = true
        },
        closeContactEvent (agree) {
            this.showContact = false
            if (!this.checked) {
                if (agree.agree) {
                    this.checked = true
                }
            }
        },
        areaConfirm (e) {
            this.showArea = false
            let a = this.$refs.picker.getColumnValues()
            console.log('area', e, a)
            this.areaError = ""
            this.province = e[0]
            this.city = e[1]
            this.area = e[2]
        },
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
            console.log('>>>>step1', data, this.$parent.uuid)
            // axios.post('/pyjgLog/scard/reservation', {
            //     channel_code: "yk",
            //     combo_id: 2697,
            //     channel_id: 3110,
            //     ad_id: 3110,
            //     contact_person: data.name,
            //     contact_tel: data.phone,
            //     contact_addr: data.address,
            //     name: data.name,
            //     iden_num: data.idenNum,
            //     province: data.province,
            //     city: data.city,
            //     area: data.area
            // }).then(res => {
    
            // }).catch(err => {
                
            // })
            // this.$emit('next', data)
        },
        // 保存用户信息
        saveUser (obj) {
            let params = {
                // code: this.$parent.uuid,
                // name: obj.name,
                // phone: obj.contact_tel,
                // idenNum: obj.iden_num,
                // province: obj.province,
                // city: obj.city,
                // area: obj.area,
                // contact_addr: obj.address
            }
            axios.post('https://log.szpyjg.com/pyjgLog/scard/saveUser', obj)
                .then(res => {

                }).catch(err => {

                })
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
    },
    components: {Contact},
    template: `
    <div>
        <!--<div class="title row m-2t m-2b">
            <h1>你已选择<span>“电信星卡”</span></h1>
            <p>根据国家实名制要求，请提供正确的身份证信息</p>
        </div>-->
        <div style="font-size: 25px;font-weight:900;text-align:center;padding: 20px 0;">领取人信息</div>
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
        <van-checkbox checked-color="#ff8f6d" style="align-items:flex-start;font-size: 12px;color: #808080;padding-left: 10px;margin-top: 10px;" v-model="checked">我已认真阅读并同意<span class="text-warn" @click.stop="lookContract">《电信星卡业务规则》</span></van-checkbox>
        <div class="row m-2t">
            <van-button round type="info" size="normal" color="linear-gradient(to right, #ff5980 0%, #ff8f6d 100%)" block @click="next">0元包邮领取</van-button>
        </div>
        <div class="intro-msg">
        <!--<span>请保持联系电话畅通，我们可能随时联系您，本次为阶段性优惠活动，数量有限，联系号码无本人接听或恶意下单情况，将不予发货。</span>-->
        </div>
        <Contact :show="showContact" @closecontact="closeContactEvent" />
    </div>`
}

var app = new Vue({
    el: '#app',
    data: () => ({
        uuid: "",
        step: 0
    }),
    mounted () {
        let path = window.location.href.split('?')
        if (path.length > 1) {
            this.uuid = path[1].split('=')[1]
            if (!this.uuid) {
                this.setUUID()
            }
        } else {
            this.setUUID()
        }
    },
    components: {
        FirstStep,
    },
    methods: {
        setUUID () {
            this.uuid =  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            })
        },
        nextEvent () {
            // this.stepIndex += 1
            // this.step += 1
        },
    },
    template: `
    <div>
        <FirstStep v-if="step == 0" @next="nextEvent" />
    </div>`
})