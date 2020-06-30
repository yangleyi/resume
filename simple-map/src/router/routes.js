//路由懒加载
const asyncload = path => {
    return resolve => require([`./../pages/${path}`], resolve)
}

//登陆
const Login = asyncload('login')
//注册
const _Map = asyncload('map')
//列表
const List = asyncload('list')
const routes = [
    // {
    //     path: '/saleCircle',
    //     component: Ccircle,
    //     meta: {
    //         title: '地图找分销'
    //     }
    // },
    {
        path: '/',
        component: Login,
        meta: {
            title: ''
        }
    },
    // {
    //     path: '/fMap',
    //     component: fMap,
    //     meta: {
    //         title: '搜项目'
    //     }
    // },
    {
        path: '/map',
        component: _Map,
        meta: {
            title: '找分销'
        },
        children: [
            {
                path: 'list',
                component: List,
                meta: {
                    title: '分销门店列表'
                }
            }
            // {
            //     path: 'hot',
            //     component: Hot,
            //     meta: {
            //         title: '热门项目'
            //     }
            // }
        ]
    }
]
export default routes