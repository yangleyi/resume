<template>    
    <div class="progress">
        <van-steps :active="steps" active-color="#0000ff">
            <van-step></van-step>
            <van-step></van-step>
            <van-step></van-step>
        </van-steps>
    </div>
</template>
<script>
export default {
    name: 'Progress',
    props: ["steps"],
}
</script>
