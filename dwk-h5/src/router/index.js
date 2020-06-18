import Vue from "vue"
import VueRouter from "vue-router"
// import Adver from "./../components/Adver"
// import Editer from "./../components/Editer"

Vue.use(VueRouter)

export default new VueRouter({
    routes: [
        {
            path: "/",
            component: resolve => require(['./../components/Adver.vue'], resolve),
            meta: {
                index: 1
            }
        },
        {
            path: "/edit",
            component: resolve => require(['./../components/Editer.vue'], resolve),
            meta: {
                index: 2
            }
        }
    ]
})