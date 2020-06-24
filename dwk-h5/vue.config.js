module.exports = {
    outputDir: 'dist',   //build输出目录
    assetsDir: 'pyjgLog/assets', //静态资源目录（js, css, img）
    lintOnSave: false, //是否开启eslint
    devServer: {
        open: false, //是否自动弹出浏览器页面
        host: "192.168.31.57", 
        port: '8081', 
        https: true,   //是否使用https协议
        hotOnly: false, //是否开启热更新
        // proxy: "https://log.szpyjg.com"
        proxy: {        
            '/pyjgLog/scard/getArea': {    //将www.example.com映射为/apis
                target: 'https://log.szpyjg.com',  // 接口域名
                secure: true,  // 如果是https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
                pathRewrite: {
                    '^getArea': ''   //需要rewrite的,
                }       
            },
            '/pyjgLog/scard/reservation': {    //将www.example.com映射为/apis
                target: 'https://log.szpyjg.com',  // 接口域名
                secure: true,  // 如果是https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
                pathRewrite: {
                    '^reservation': ''   //需要rewrite的,
                }       
            },
            '/pyjgLog/scard/saveUser': {    //将www.example.com映射为/apis
                target: 'https://log.szpyjg.com',  // 接口域名
                secure: true,  // 如果是https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
                pathRewrite: {
                    '^saveUser': ''   //需要rewrite的,
                }       
            },
        }
    }
}