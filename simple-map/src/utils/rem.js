// 移动端rem布局方案
(function (doc, win) {
    var docEl = doc.documentElement
    var resizeEvt =
        'orientationchange' in window ? 'orientationchange' : 'resize'
    var recalc = function () {
        var clientWidth = docEl.clientWidth
        if (!clientWidth) return
        docEl.style.fontSize = 20 * (clientWidth / 320) + 'px'
    }
    if (!doc.addEventListener) return
    win.addEventListener(resizeEvt, recalc, false)
    doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window)

// 阻止ios双击放大
window.onload = function () {
    document.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            event.preventDefault()
        }
    })
    var lastTouchEnd = 0
    document.addEventListener('touchend', function (event) {
        var now = (new Date()).getTime()
        if (now - lastTouchEnd <= 300) {
            event.preventDefault()
        }
        lastTouchEnd = now
    }, false)
}