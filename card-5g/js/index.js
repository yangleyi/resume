function throttle (fn, gap) {
    if (gap == null || gap == undefined) {
        gap = 1500
    }
    let last = null
    return function () {
        let _now = +new Date()
        if (_now - last > gap || !last) {
            fn.apply(this, arguments)
            last = _now
        }
    }
}
// 生成uuid
function createUUID () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    })
}
var timer = null
var CodeModal = {
    props: ['mobile', 'show'],
    data: function () {
        return {
            time: 60,
            code: "",
            checked: false
        }
    },
    template: `
        <div class="modal-box" v-show="show">
            <div class="modal">
                <div class="modal-cont">
                    <div class="title">业务提示</div>
                    <div class="subtitle">您即将使用“{{mobile}}”的号码办理</br>“5G畅享套餐承诺合约方案-128元档”</div>
                    <div class="input">
                        <input placeholder="请输入验证码" v-model="code" />
                        <button :disabled="time > -1" @click="doubleGetCode">重新获取<span v-show="time > 0">({{time}})</span></button>
                    </div>
                    <div class="intro">
                        <van-checkbox v-model="checked" shape="square" checked-color="#E8D0A4">
                            <span>我已阅读并同意</span>    
                            <span class="color-main" @click.stop="lookRule">《活动规则》</span>
                        </van-checkbox>
                    </div>
                    <div class="intro">
                        <p>1、活动当月办理次月生效</p>
                        <p>2、活动有效期内，须保证中国移动在网24个月</p>
                    </div>
                </div>
                <div class="modal-foot">
                    <div @click="cancel">取消</div>
                    <div class="confirm" @click="confirm">确定</div>
                </div>
            </div>
        </div>
    `,
    methods: {
        doubleGetCode: throttle(function () {
            this.timeEvent()
        }, 1000),
        timeEvent () {
            this.time = 60
            timer = setInterval(() => {
                if (this.time < 1) {
                    clearInterval(timer)
                }
                this.time --
            }, 1000)
        },
        cancel () {
            clearInterval(timer)
            this.code = ""
            this.$emit('modalcancel')
        },
        confirm () {
            if (!this.code) {
                vant.Toast('请输入验证码')
                return
            }
            if (!this.checked) {
                vant.Toast('请同意活动规则')
                return
            }
            clearInterval(timer)
            this.$emit('modalconfirm', {code: this.code})
            this.code = ""
        },
        lookRule (e) {
            this.$emit('lookrule')
        }
    }
}
var ContactModal = {
    props: ['show'],
    methods: {
        hide () {
            this.$emit('hidecontact')
        }
    },
    template: `
        <div class="modal-box" v-show="show">
            <div class="modal">
                <div class="title">活动规则</div>
                <div class="contact-box">
                    1. 权益如下</br>
                    （1）套餐包含来电显示业务。</br>
                    （2）客户可免费享受12个月云盘500GB空间服务。</br>
                    （3）客户可免费享受3个月视频彩铃业务权益。</br>
                    （4）该套餐享用5G优享服务。</br>
                    2.活动套餐折扣于办理次月生效, 本活动承诺期为12个月。</br>
                    3.方案有效期内，客户不能取消套餐或变更为低于承诺档位的套餐。可以办理更高档5G套餐，但不能变更到其他主套餐序列。</br>
                    4.取消规则：本活动承诺期为12个月。在活动期内取消方案需到营业厅办理，同时缴纳违约金,如在方案生效前取消无需缴纳违约金。</br>
                    5. 本业务为承诺类方案，与部分低消承诺方案不互斥，若同时办理低消承诺方案，每月承诺消费额将叠加。</br>
                    6.套餐超套规则</br>
                    （1）套外语音资费：国内主叫按0.15元/分钟计费。</br>
                    （2）套外流量资费：套餐外流量每5元1GB，用满3GB后每3元1GB，不足部分按照0.03元/MB收取，不使用不收费。</br>
                    （3）温馨提示：客户办理5G智享套餐后，使用5G终端在国内（不含港澳台地区）中国移动5G网络下可登陆5G网络（无需更换电话卡）。</br>
                    7. 客户需要开通4G功能，才能办理5G套餐。</br>
                    8.套餐内包含的网络权益、业务权益、专属权益有效期为一年，到期后可按期顺延，但我公司有权在有效期截止后调整和优化权益方案，并将提前通知客户。</br>
                </div>
                <div class="modal-foot">
                    <div class="confirm" style="width: 100%;" @click="hide">关闭</div>
                </div>
            </div>
        </div>
    `
}
var app = new Vue({
    el: '#list',
    data: {
        list: [1,2,3,4],
        activeIndex: -1,
        mobileCodeModal: false, // 手机验证码
        mobile: '',         // 手机号
        showProject: false, // 显示套餐列表
        contactModal: false, // 规则弹窗

        uuid: null
    },
    mounted () {
        this.uuid = createUUID()
    },
    methods: {
        checkMobile () {
            if (!this.mobile) {
                vant.Toast({icon: "warning-o", message: '请输入办理号码'})
                return
            }
            this.showProject = true
        },
        lookProject () {
            this.mobileCodeModal = true
            this.$refs.modal.timeEvent()
        },
        itemTap (item) {
            this.activeIndex = item
        },
        modalCancel () {
            this.mobileCodeModal = false
        },
        modalConfirm (e) {
            console.log('验证码', e)
            this.mobileCodeModal = false
        },
        hideContact () {
            this.contactModal = false
        }
    },
    components: {CodeModal, ContactModal},
    template: `
    <div>
        <div class="table">
            <div class="mobile">
                <input class="mobile-input" placeholder="请输入北京移动号码" v-model="mobile" maxlength="11" />
            </div>
            <img src="./assets/5g24_5.png" @click="checkMobile" />
        </div>
        <div class="project" v-show="showProject">
            <img src="assets/5g24_2.png" />
            <div class="project-list">
                <div v-for="(item, index) in list" class="project-item" :class="{'active': activeIndex == item}" v-key="index" @click="itemTap(item)">
                    <img src="./assets/5g4.png" />
                    <div class="title">5G畅享套餐承诺合约方案-128元档</div>
                    <div>
                        <p>
                            <span>语音：<i>500分钟</i></span>
                            <span>流量：<i>30GB</i></span>
                        </p>
                        <p class="price">价格：<i>128</i>元/月</p>
                    </div>
                </div>
            </div>
            <div class="footer" v-show="activeIndex > -1">
                <img src="./assets/5g24_6.png" @click="lookProject" />
            </div>
            <code-modal
                ref="modal"
                @modalcancel="modalCancel"
                @modalconfirm="modalConfirm"
                :show="mobileCodeModal"
                :mobile="mobile"
                @lookrule="contactModal = true"
            />
            <contact-modal :show="contactModal" @hidecontact="hideContact" />
        </div>
    </div>
    `,
})
