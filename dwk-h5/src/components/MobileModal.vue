<template>
    <!-- <van-popup v-model="showMobile" :close-on-click-overlay="false"> -->
    <div class="my-popup" v-if="showMobile">
        <div class="mobile-modal modal">
            <div class="close-icon" @click.stop="closePopup">
                <van-icon name="cross" size="20px" color="#808080" />
            </div>
            <div class="mobile-title">请选择您的号码</div>
            
            <van-search v-model="search" placeholder="请输入" @search="onSearch" />

            <div class="mobile-box">
                <div class="mobile-item" v-for="(item, index) in mobiles" :key="index" @click.stop="getMobild(item)">
                    <HighLight :words="search" :str="item" />
                </div>
            </div>
            <div class="change-mobiles">换一批</div>
        </div>
    </div>
    <!-- </van-popup> -->
</template>
<script>
import HighLight from "./HighLight"
export default {
    name: 'MobileModal',
    props: ['showMobile'],
    data: () => ({
        search: "",
        mobiles: [
            15899993344,15890294855,13234567876,15899993344,15890294855,13234567876,15899993344,15890294855,13234567876,13677886655
        ]
    }),
    components: {HighLight},
    methods: {
        onSearch () {

        },
        getMobild (item) {
            this.$emit('closemobilepopup', {mobile: item})
        },
        closePopup () {
            this.$emit('closemobilepopup')
        }
    }
}
</script>
<style scoped>
    .my-popup {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0,0,0,0.7);
    }
    .modal {
        /* position: absolute;
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0); */
        background: #fff;
    }
</style>
