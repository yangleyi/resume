function dotRequest (obj) {
    let data = obj || {}
    $.ajax({
        url: 'https://log.szpyjg.com/pyjgLog/up25g/log',
        type: "POST",
        data: {...obj},
        success: function (result) {}
    })
}
$(function () {
    $('#checkbox').click(function (e) {
        let val = $(this).is(':checked')
        let type = e.type
        dotRequest({value: val, type: type, html: this.outerHTML})
    })
    $('.main p span').click(function (e) {
        let type = e.type
        dotRequest({type: type, html: this.outerHTML})
    })
    // another
    $('.rule span').click(function (e) {
        let type = e.type
        dotRequest({type: type, html: this.outerHTML})
    })
    $('.main3 .iconfont.icon-guanbi1').click(function (e) {
        let type = e.type
        dotRequest({type: type, html: this.outerHTML, desc: '活动规则关闭按钮'})
    })
    // 业务办理完成弹窗 - 校验手机号
    $('.main4 .iconfont.icon-guanbi1').click(function (e) {
        let type = e.type
        dotRequest({type: type, html: this.outerHTML, desc: '业务提示弹窗关闭'})
    })
    // another
    $('.main4 div div').click(function (e) {
        let type = e.type
        dotRequest({type: type, html: this.outerHTML, desc: '业务提示弹窗确定'})
    })
    $('.main3 div').click(function (e) {
        let type = e.type
        if ($(this).html() == '关闭') {
            dotRequest({type: type, html: this.outerHTML, desc: '活动规则关闭按钮'})
        }
    })
    $('#telephone').blur(function (e) {
        let type = e.type
        let val = $(this).val()
        dotRequest({phone: val, html: this.outerHTML, desc: '手机号输入框'})
    })
    $('.main img').click(function (e) {
        let type = e.type
        let val = $('#telephone').val()
        dotRequest({phone: val, type: type, html: this.outerHTML, desc: '查询套餐'})
    })
    // another
    $('.main div div').click(function (e) {
        let type = e.type
        let val = $('#telephone').val()
        dotRequest({phone: val, type: type, html: this.outerHTML, desc: '查询套餐'})
    })
    $('.ListData').on('click', '.list', function (e) {
        let type = e.type
        let name = $(this).find(".TilteName").html()
        let id = $(this).find(".activity_id").val();
        dotRequest({value: JSON.stringify({name: name, id: id}), type: type, desc: '选择套餐'})
    })
    // another
    $('.main1 .list').on('click', '.select', function (e) {
        let type = e.type
        let name = $(this).find(".activity_name").val()
        let id = $(this).find(".activity_id").val();
        dotRequest({value: JSON.stringify({name: name, id: id}), type: type, desc: '选择套餐'})
    })
    $('.footer .handle').click(function (e) {
        let type = e.type
        let ac = $('.activeClass').eq(0)
        let name = $(ac).find(".TilteName").html()
        let id = $(ac).find(".activity_id").val();
        dotRequest({value: JSON.stringify({name: name, id: id}), type: type, html: this.outerHTML, desc: '套餐确定'})
    })
    // other
    $('.footer .btn').click(function (e) {
        let type = e.type
        let ac = $('.active').eq(0)
        let name = $(ac).find(".activity_name").val()
        let id = $(ac).find(".activity_id").val();
        dotRequest({value: JSON.stringify({name: name, id: id}), type: type, html: this.outerHTML, desc: '套餐确定'})
    })
    
    $('.main2 .iconfont.icon-guanbi1').click(function (e) {
        let type = e.type
        // 关闭
        dotRequest({type: type, html: this.outerHTML, desc: '验证码弹窗关闭'})
    })
    $('#code').blur(function (e) {
        let type = e.type
        let val = $(this).val()
        dotRequest({value: val, type: type, html: this.outerHTML, desc: '验证码输入框失去焦点'})
    })
    $('#codeButton').on('click', function (e) {
        // 获取验证码
        let type = e.type
        dotRequest({type: type, html: this.outerHTML, desc: '重新获取验证码'})
    })
    $('.main2 .bottom div').eq(0).on('click', function (e) {
        // 取消
        let type = e.type
        dotRequest({type: type, html: this.outerHTML, desc: '验证码弹窗-取消'})
    })
    $('.main2 .bottom div').eq(1).on('click', function (e) {
        let type = e.type
        // 确认
        // let name = $('.list.activeClass').find(".TilteName").html()
        // if (!name) {
        //     name = $('.select.active').find(".activity_name").val()
        // }
        let id = $('.list.activeClass').find(".activity_id").val();
        if (!id) {
            id = $('.select.active').find(".activity_id").val();
        }
        let obj = {
            card_no: $('#telephone').val(),
            smsCode: $("#code").val(),
            // ordernum: ordernum,
            activity_id: id,
            account: GetQueryString('account'),
            out_source: GetQueryString('out_source'),
            source: 'zx'
        }

        dotRequest({value: JSON.stringify(obj), type: type, html: this.outerHTML, desc: '验证码弹窗-确定'})
    })
})