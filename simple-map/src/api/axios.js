import axios from 'axios'
import config from './../config'
import store from './../store'
import Vue from 'vue'

const vbus = new Vue()

//配置api地址
axios.defaults.baseURL = config.baseUrl
//请求凭证
axios.defaults.withCredentials = true
//配置默认请求超时
axios.defaults.timeout = 120000

//请求拦截器
axios.interceptors.request.use(config => {
    store.state.loading = true
    //在请求发出之前进行一些操作
    return config
}, function (error) {
    //Do something with request error
    store.state.loading = false
    return Promise.reject(error);
})

//响应拦截器
axios.interceptors.response.use(res => {
    store.state.loading = false
    //在这里对返回的数据进行处理
    if (res.data.status == 0) {
        //在这里对返回的数据进行处理
        return res;
    } else {
        vbus.$toast(res.data.msg)
        return Promise.reject(res)
    }
}, function (error) {
    console.log(error)
    //Do something with response error
    store.state.loading = false
    return Promise.reject(error);
})

const request = (method, url, data) => {
    const config = {
        method,
        url
    }
    if (method == 'post') {
        Object.assign(config, {
            data
        })
    } else if (method == 'from') {
        config = Object.assign(config, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }]
        })
    } else {
        Object.assign(config, {
            params: data
        })
    }
    return new Promise((resolve, reject) => {
        axios(config)
            .then(res => {
                if (res) {
                    resolve(res.data)
                }
            }, err => {
                reject(err)
            }).catch(err => {
                reject(err)
            })
    })
}

export default { axios, request }