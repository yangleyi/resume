<template>    
    <div v-html="setColor"></div>
</template>
<script>
export default {
    name: 'HighLight',
    props: ['words', 'str'],
    computed: {
        setColor () {
            if (!this.words) {
                return this.str
            }
            if (!this.str) return ""
            let _str = this.str + ''
            let _words = this.words + ""
            let arr = _str.split(_words)
            let line = _str
            if (arr.length > 1) {
                line = arr.join(`<span class="text-blue">${_words}</span>`)
            }
            return line
        }
    },
}
</script>
