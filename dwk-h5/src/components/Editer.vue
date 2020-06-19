<template>    
    <div>
        <Progress :steps="step" />
        <FirstStep v-if="step == 0" @next="nextEvent" />
        <SecondStep v-if="step == 1" @next="nextEvent" />
        <ThirdStep v-if="step == 2" />
    </div>
</template>
<script>
import Progress from './Progress'
import FirstStep from './FirstStep'
import SecondStep from './SecondStep'
import ThirdStep from './ThirdStep'
export default {
    name: 'Editer',
    data: () => ({
        step: 0,
    }),
    mounted () {
        console.log(this.$parent)
    },
    components: {
        Progress,
        FirstStep,
        SecondStep,
        ThirdStep
    },
    methods: {
        nextEvent () {
            this.stepIndex += 1
            this.step += 1
        },
    },
}
</script>
