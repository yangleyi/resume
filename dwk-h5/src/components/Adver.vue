<template>
    <div class="ad-page">
        <div class="ad">
            <img src="./../assets/telstar1.png" />
            <!-- <split-modal /> -->
            <img src="./../assets/telstar2.png" />
        </div>
        <div class="ad-btn">
            <van-button round block type="warning" text="咨询电话：400666666" @click="adClick" />
        </div>
    </div>
</template>

<script>
import {debounce} from "./../utils/common.js";
import SplitModal from "./../components/SplitModal"
export default {
    data: () => ({
        // showAd: true
    }),
    components: {SplitModal},
    mounted () {
        window.addEventListener('scroll', this.scroll, true)
    },
    methods: {
        scroll: debounce(function () {
            if (this.$route.path == "/") {
                let top = Math.floor(document.body.scrollTop || document.documentElement.scrollTop || window.pageXOffset)
                console.log('scroll top', top, this.$route.path)
            }
        }, 500),
        adClick () {
            // this.showAd = false
            this.$router.push('/edit')
        },
    }
}
</script>
<style scoped>
.ad-page {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
}
.ad img {
    width: 100%;
    height: auto;
    vertical-align: middle;
}
.ad-btn {
    position: fixed;
    bottom: 30px;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;
    z-index: 10;
}
</style>
