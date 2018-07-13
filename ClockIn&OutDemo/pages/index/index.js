//index.js
//获取应用实例
const app = getApp()

const rule = {
  lat: '31.32266', //公司的纬度
  lng: '120.42850', //公司的经度
  maxDistance: 500, //允许的最大距离偏差
  bssid: '28:6c:07:d4:a0:48', //约定的BSSID
}

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    locationChecked: false, //位置星系是否已经确认
    wifiChecked: false, //Wifi是否确认
    isChecked: false, //最终状态
    distance: '', //当前用户的距离
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //按钮绑定的事件处理
  bindGetLocationTap: function() {
    let that = this
    wx.getLocation({
      success: function(res) {
        console.log(res)
        //判断距离
        const distance = that.getDistance(res.latitude, res.longitude);
        console.log(distance)
        if (distance <= rule.maxDistance) {
          //在打卡有效范围内
          that.setData({
            distance: Math.floor(distance),
            locationChecked: true
          })
          that.openWifi()
        } else {
          //不在有效范围
          wx.showModal({
            title: '提示',
            content: '当前位置已经超出打卡范围',
          })
        }
      },
    })
  },

  //计算用户位置与预设位置之间的距离
  getDistance: function(lat, lng) {
    let distance = 0;
    const radLat1 = lat * Math.PI / 180; //纬度单位 度转换为弧度
    const radLat2 = rule.lat * Math.PI / 180;
    const deltaLat = radLat1 - radLat2; //纬度 弧度差
    const deltaLng = lng * Math.PI / 180 - rule.lng * Math.PI / 180; //经度 弧度差
    distance = 2 * Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(deltaLat / 2), 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)
      )
    );
    return distance * 6378137; //6378137为地球赤道半径
  },

  //开启Wifi
  openWifi: function() {
    let that = this
    wx.startWifi({
      success: function(res) {
        console.log(res)
        that.getCurrentWifi()
      },
      fail: function() {
        wx.showModal({
          title: '提示',
          content: 'Wifi当前不可用,请手动开启wifi重试',
        })
      }
    })
  },

  //获取当前连接的Wifi
  getCurrentWifi: function() {
    let that = this
    wx.getConnectedWifi({
      success: function(res) {
        console.log(res)
        that.checkCurrentWifi(res.wifi)
      },
      fail: function(res) {
        wx.showModal({
          title: '提示',
          content: '未连接Wifi',
        })
      }
    })
  },

  //判断当前连接的wifi是否是公司指定打卡Wifi
  checkCurrentWifi: function(wifi) {
    if (rule.bssid === wifi.BSSID) {
      //确认验证成功
      this.setData({
        wifiChecked: true,
        isChecked: true
      })
      wx.showModal({
        title: '提示',
        content: '您已完成打卡',
      })
      //还需要获取当前微信用户的openId，然后最终确认该用户已经完成打卡
      this.getCurrentUserOpenId()
    } else {
      wx.showModal({
        title: '提示',
        content: '您并没有连接到指定的路由器，wifi验证失败',
      })
    }
  },

  //当前微信用户的openId,不安全,千万不要在实际项目中这么做
  getCurrentUserOpenId: function() {

    const appId = '' //此处补上appId
    const appSecret = '' //此处补上appSecret
    wx.login({
      success: function(res) {
        const url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + appSecret + '&js_code='+ res.code +'&grant_type=authorization_code'
        wx.request({
          url: 'url',
          success:function(response) {
              console.log(response)
              wx.showModal({
                title: '成功提示',
                content: '尊敬的用户，您的标识是：' + response.data.openId +',您已经成功打卡，并且已经提交到服务器',
              })
          }
        })
      }
    })
  },

  onLoad: function() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})