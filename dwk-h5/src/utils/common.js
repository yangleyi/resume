export function debounce (fn, delay) {
    return function () {
        let that = this
        clearTimeout(fn.id)
        fn.id = setTimeout(() => {
            fn.call(that, arguments)
        }, delay)
    }
}