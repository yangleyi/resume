function dotRequest (obj) {
    let data = obj || {}
    data.url = window.location.href
    console.log(data)
    return
    $.ajax({
        url: 'https://log.szpyjg.com/pyjgLog/up25g/log',
        type: "POST",
        data: {...data},
        success: function (result) {}
    })
}
$(function () {
    $('#name').blur(function (e) {
        let type = e.type
        let val = $(this).val()
        dotRequest({value: val, html: this.outerHTML, desc: '姓名输入框失去焦点-花卡', type: type})
    })
    $('#code').blur(function (e) {
        let type = e.type
        let val = $(this).val()
        dotRequest({value: val, html: this.outerHTML, desc: '身份证输入框失去焦点-花卡', type: type})
    })
    $('#tel').blur(function (e) {
        let type = e.type
        let val = $(this).val()
        dotRequest({value: val, html: this.outerHTML, desc: '联系电话输入框失去焦点-花卡', type: type})
    })
    $('.main ul li').click(function(e) {
        let type = e.type
        if ($(this).html().indexOf('选择号码') >= 0) {
            dotRequest({desc: '点击选择号码-花卡', type: type})
        }
    })
    $('.PhoneNumber').on('click', 'li', function(e) {
        let type = e.type
        let val = $(this).html()
        dotRequest({value: val, html: this.outerHTML, desc: '点击选择号码-花卡', type: type})
    })
    $('.SelectNumber').on('click', 'i', function(e) {
        let type = e.type
        dotRequest({html: this.outerHTML, desc: '点击换一换-花卡', type: type})
    })
    $('.SelectNumber div span').click(function(e) {
        let type = e.type
        let phone = $('.PhoneNumber .active').html()
        dotRequest({value: phone, html: this.outerHTML, desc: '确定选择的手机号-花卡', type: type})
    })
    $('#areaLabel').click(function (e) {
        let type = e.type
        dotRequest({html: this.outerHTML, desc: '请选择收货地址-花卡', type: type})
    })
    $("#province").on('click', 'li', function (e) {
        let pro = $(this).html()
        let type = e.type
        dotRequest({value: pro, html: this.outerHTML, desc: '选择省-花卡', type: type})
    })
    $("#city").on('click', 'li', function (e) {
        let city = $(this).html()
        let type = e.type
        dotRequest({value: city, html: this.outerHTML, desc: '选择市-花卡', type: type})
    })
    $("#area").on('click', 'li', function (e) {
        let area = $(this).html()
        let type = e.type
        dotRequest({value: area, html: this.outerHTML, desc: '选择区-花卡', type: type})
    })
    $("#town").on('click', 'li', function (e) {
        let town = $(this).html()
        let type = e.type
        dotRequest({value: town, html: this.outerHTML, desc: '选择街道-花卡', type: type})
    })
    $('#cancel').click(function (e) {
        let type = e.type
        dotRequest({html: this.outerHTML, desc: '关闭省市区弹窗-花卡', type: type})
    })
    // $('.province').change(function (e) {
    //     let type = e.type
    //     let val = $('.province option:selected').html()
    //     dotRequest({value: val, desc: '选择省-花卡', type: type})
    // })
    // $('.city').change(function (e) {
    //     let type = e.type
    //     let val = $('.city option:selected').html()
    //     dotRequest({value: val, desc: '选择市-花卡', type: type})
    // })
    // $('.area').change(function (e) {
    //     let type = e.type
    //     let val = $('.area option:selected').html()
    //     dotRequest({value: val, desc: '选择区-花卡', type: type})
    // })
    $('#address').blur(function (e) {
        let type = e.type
        let val = $(this).val()
        dotRequest({value: val, html: this.outerHTML, desc: '地址输入框失去焦点-花卡', type: type})
    })
    $('.rule span').click(function(e) {
        let type = e.type
        dotRequest({html: this.outerHTML, desc: '点击入网协议-花卡', type: type})
    })
    $('.main3 .iconfont.icon-guanbi1').click(function(e) {
        let type = e.type
        dotRequest({html: this.outerHTML, desc: '关闭入网协议弹窗-花卡', type: type})
    })
    $('.main3 div').click(function(e) {
        let type = e.type
        let text = $(this).html()
        if (text == '关闭') {
            dotRequest({html: this.outerHTML, desc: '关闭入网协议弹窗-花卡', type: type})
        }
    })
    $('#checkbox').click(function (e) {
        let val = $(this).is(':checked')
        let type = e.type
        dotRequest({value: val, type: type, html: this.outerHTML, desc: '点击协议复选框-花卡'})
    })
    $('.btn div').click(function (e) {
        let type = e.type
        let data = {
            ad_id: GetQueryString("ad_id"),
            phone: $("#phone").val(),
            phonenum: $("#tel").val(),
            realName: $("#name").val(),
            cardId: $("#code").val(),
            addressProvinceName: '',
            addressCityName: '',
            addressCountyName: '',
            address: $("#Addr").val()+ $('#address').val(),
            addname: $("#name").val(),
            // serialNumber: value2,
            activity_type: ''
        }
        dotRequest({value: JSON.stringify(data), type: type, html: this.outerHTML, desc: '免费领取-花卡'})
    })

    $('.footer').on('click', 'a', function (e) {
        let type = e.type
        dotRequest({type: type, html: this.outerHTML, desc: '点击底部按钮-花卡'})
    })
})