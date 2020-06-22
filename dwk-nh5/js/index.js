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
    },
    template: `
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
    </div>`
}

var SecondStep = {
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
        // MobileModal,
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
    },
    template: `
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
        <!--<MobileModal :showMobile="showMobile" @closemobilepopup="closePopup" />-->
        <Contact :show="showContact" @closecontact="closeContactEvent" />
    </div>`
}

var ThirdStep = {
    template: `
    <div>
        <div class="success">
            <van-icon name="passed" size="40px" color="#0000ff" />
            <div class="msg">提交成功</div>
            <div class="intro">
                <div>王上，我们将尽快为您配送。</div>
                <div>请在收到卡的<span class="text-blue">10天内激活使用</span>，过期将会被收回哦！</div>
            </div>
        </div>
    </div>
    `
}

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
                <p>在使用河北移动和生活APP提供的各项服务之前，您应当认真阅读并遵守《河北移动和生活APP客户服务协议》（以下简称“本协议”），请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、争议解决条款。免除或者限制责任的条款可能会以加粗字体显示，您应重点阅读。如您对协议有任何疑问，应向河北移动客服咨询。
                当您按照登录页面提示填写信息、阅读并同意本协议且完成全部登录程序后，或您以其他河北移动和生活APP允许的方式实际使用河北移动和生活APP的服务时，即表示您已充分阅读、理解并接受本协议的全部内容，并与河北移动达成协议。您承诺接受并遵守本协议的约定，届时您不应以未阅读本协议的内容或者未获得河北移动对您问询的解答等理由，主张本协议无效，或要求撤销本协议。
                一、协议的目的和范围
                1.1 本协议由您与河北移动和生活APP的运营者共同订立。后者是指您的号码所归属的中国移动通信集团河北有限公司下属相应的地市分公司，在本协议中统称河北移动。
                1.2 本协议包括协议正文、河北移动发布的各种官方信息、业务办理规则、法律声明、公告或通知等，以上文件构成本协议不可分割的组成部分，具有同等法律效力，且文件之间构成相互解释的关系，以下统称本协议。
                1.3 河北移动和生活APP旨在向您提供代表河北移动的官方信息发布、服务信息查询、业务办理服务，并具备一定的网络交易平台功能。除非另行文件说明，河北移动和生活APP提供的以上所有的服务均受本协议约束，您在使用河北移动和生活APP提供的任一服务时，即表示您接受本协议所有条款。
                1.4 河北移动有权根据需要不时地修改本协议的各个组成文件的内容，或新增部分内容，而无需另行单独通知您。变更后的协议一经在网站公布，立即或在文件明确的特定时间生效。您通过河北移动和生活APP接受服务的行为受您接受服务当时的协议内容约束。本协议是对双方权利义务的原则性约定，您如通过河北移动和生活APP或营业厅前台等方式办理各项业务时，还应当遵守办理业务时的具体约定和条款，并以办理时的各项约定为准。如河北移动发布的各种官方信息、业务办理规则、法律声明、公告或通知与实际办理业务时的内容不符或不一致，您应当明确咨询和询问，并以实际办理业务时的各项约定和业务办理规则为准。
                二、主体资格、账号密码和用户信息
                • 主体资格
                2.1 您确认，在您进行登录或以其他河北移动和生活APP允许的方式实际使用河北移动和生活APP的服务时，您应当是具备完全民事行为能力的自然人、法人或其他组织。若您不具备前述主体资格，则您及您的监护人应承担因此而导致的一切后果，且河北移动和生活APP有权注销或永久冻结您的账户，并向您及您的监护人索偿相应损失。
                • 账号和密码
                2.2 您在河北移动和生活APP上的账号和密码是您重要的个人资料，为保障您个人资料信息安全，需要通过服务密码正确验证进行访问，您需记住本身的服务密码，务必注意账号和密码的保密
                2.3 河北移动和生活APP向您提供多种登录方式，包括但不限于手机号码直接登录、凭动态密码登录、凭服务密码登录、凭服务密码+动态密码登录这四类基本登录方式。在使用部分平台时，如河北移动网上商城等，您也可以另行注册用户信息，设置用户名和密码，并使用该用户名和密码登录
                2.4 您应按照机密的原则设置和保管自设密码，避免使用姓名、生日、电话号码等与本人明显相关的信息或过于简单的数字组合（如12345678、6个6、8个8等）作为密码，不应将本人自设密码提供给法律规定必须提供之外的任何人。
                2.5河北移动和生活APP会提供便捷的业务办理和服务功能，您首次登录后会默认记住登录状态，如您不更换终端或注销账户，后续使用等同于已经通过本机本账户登录验证。
                2.6 您应采取合理措施，防止本人密码被窃取，防范他人擅用您终端（包括但不限于手机），由于密码泄露或他人擅用造成的后果由您自行承担。
                2.7 凡通过账号和密码登录河北移动和生活APP办理的一切业务，均视为您亲自办理的业务，您须对在该用户名和密码下发生的所有活动（包括但不限于发布信息、查询信息、点击同意或提交、网上订立协议、网上购买商品或服务等）承担责任。
                2.8 河北移动和生活APP有相应的安全措施来保障您的交易安全，但河北移动不保证其绝对安全。</p>
            </div>
            <div class="contact-foot">
                <button class="close" @click="closeContactModal">关闭</button>
                <button class="agree" @click="closeContactModal(true)">同意</button>
            </div>
        </div>
    </van-popup>`
}