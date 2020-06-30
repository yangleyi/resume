const app = getApp();
function deepObjectMerge(FirstOBJ, SecondOBJ) { // 深度合并对象
  for (let key in SecondOBJ) {
    FirstOBJ[key] = FirstOBJ[key] && FirstOBJ[key].toString() === "[object Object]" ?
      deepObjectMerge(FirstOBJ[key], SecondOBJ[key]) : FirstOBJ[key] = SecondOBJ[key];
  }
  return FirstOBJ;
}

// 扩展page对象
export const wxPage = function(page) {
  // 默认配置生命周期函数 及 自定义事件
  const method = {
    onLoad(options) {
      console.log('修改 page onLoad 生命周期 *********');
      console.log('页面参数',options);
      console.log('页面数据监听');
      this._setWatcher('self');
      this.setData({
        $query: options,
        isLogin: app.globalData.isLogin,
        reLaunch: app.globalData.reLaunch,
      })
    },
    onShow() {
      // 数据监听
      console.log('全局app.globalData数据监听 刷新');
      this._setWatcher('app');
    },
    onReady() {

    },
    showAuthDialog() {

    },
  }
  // 页面默认配置项
  const initConfig = {
    // 每个页面默认引入 全局的 登录状态及是否重新登录表示
    data: {
      isLogin: app.globalData.isLogin,
      reLaunch: app.globalData.reLaunch,
    },

    // 监听全局的 登录状态 及 重新登录状态
    watch: {
      '$app.isLogin': function(newVal, oldVal) {
        console.log('isLogin change');
        this.setData({
          isLogin: newVal,
        })
      },
      // 页面重新登录监听
      '$app.reLaunch': function(newVal, oldVal) {
        this.setData({
          reLaunch: newVal,
        })
        if(newVal) {
          // 检测页面是否存在relaunch事件， 如果存在并返回 true 则不执行后续操作
          if(this.reLaunch && typeof this.reLaunch === 'function') {
            console.log('页面重启，重新执行onLoad');
            if(this.reLaunch()) return;
          }
          // 默认重新加载onShow事件
          console.log('页面重启，重新执行onShow');
          this.onShow();
        }
      }
    },

    // 检测登录状态方法，如果未登录直接重定向至授权页
    checkIsLogin() {
      if(!app.globalData.isLogin || !app.globalData.hasMobileNo) {
        this.redirectTo({
          url: '/pages/authorize/index',
        })
        // this.showAuthDialog()
        return false
      }
      return true
    },

    _setWatcher(type) {
      // type 为 self 时 仅监听 this.data 中的数据, type 为 app 时 仅监听 app.globalData 中的数据, type 为空或等于其他值 则两者都进行监听
      const watch = this.watch;
      Object.keys(watch).forEach(v => {
        let key = v.split('.'); // 将watch中的属性以'.'切分成数组
        let nowData = null; // 要监听的data
        if (key[0] === '$app' && type !== 'self') {
          // $app 代表监听 app.globalData
          key.shift();
          nowData = app.globalData;
        } else if(key[0] !== '$app' && type !== 'app'){
          nowData = this.data;
        }
        if(nowData) {
          for (let i = 0; i < key.length - 1; i++) { // 遍历key数组的元素，除了最后一个！
            nowData = nowData[key[i]]; // 将nowData指向它的key属性对象
          }
          let lastKey = key[key.length - 1];
          this._observe(nowData, lastKey, watch[v]); // 监听nowData对象的lastKey
        }
      })
    },
    /**
     * 监听属性 并执行监听函数
     */
    _observe(obj, key, watchFun) {
      const _this = this;
      let val = obj[key]; // 给该属性设默认值
      Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: true,
        set: function(value) {
          watchFun.call(_this, value, val); // 赋值(set)时，调用对应函数
          val = value;
        },
        get: function() {
          return val;
        }
      })
    }
  };

  // 生命周期方法重写函数 (重写带返回参数的生命周期发法)
  function overWriteLifeCyle(config, key, defaultFunc) {
    let customFunc = config[key];
    // 重写后的方法（即整合了 默认配置的方法 和 页面自定义的方法， 两者合为一个方法，都会执行）
    config[key] = function() {
      let customData = {}, defaultData = {};
      if(defaultFunc && typeof defaultFunc === 'function') {
        defaultData = defaultFunc.call(this, ...arguments);
      }
      if(customFunc && typeof customFunc === 'function') {
        customData = customFunc.call(this, ...arguments);
      }
      if(typeof defaultData != 'undefined' && typeof customData != 'undefined') {
        return deepObjectMerge(defaultData, customData)
      }
    }
  }

  // 重写所有config里的方法，给所有方法 try catch 统一处理报错日志
  function tryCatch(config, key) {
    let func = config[key];
    if(func && typeof func === 'function') {
      config[key] = function() {
        try {
          const funcData = func.call(this, ...arguments);
          if(typeof funcData != 'undefined') {
            return funcData;
          }
        } catch (err) {
          wx.$logger.log({ 'ERROR_common' : err.stack, 'errorInfo': '报错位置在：'+key })
          return;
        }
      }
    }
  }

  return {
    wxPage: function() {
      const pageConfig = arguments[0];
      const otherConfigArr = [];
      for(let i = 0, len = arguments.length; i < len; i++) {
        if(i > 0) {
          otherConfigArr.push(arguments[i]);
        }
      }
      // 整合、合并所有传入的 页面对象
      const otherConfig = Object.assign(initConfig, ...otherConfigArr);
      // 这里与默认配置进行深度合并
      const config = deepObjectMerge(pageConfig, otherConfig);
      console.log('配置 页面对象'); //, config
      // 重写生命周期函数，保证默认配置的生命周期函数 和 页面中定义的生命周期函数 都会执行
      Object.keys(method).forEach(function(key){
        overWriteLifeCyle(config, key, method[key]);
      });
      // 给所有方法 try catch 统一处理报错日志
      Object.keys(config).forEach(function(key){
        tryCatch(config, key);
      });
      return page ? page(config) : Page(config)
    }
  }
}
