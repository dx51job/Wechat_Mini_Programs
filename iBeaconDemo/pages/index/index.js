//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showInfo: '',
  },

  testiBeacon: function() {
    var that = this;
    //判断兼容性
    if (wx.openBluetoothAdapter) {
      //打开蓝牙适配器
      wx.openBluetoothAdapter({
        success: function(res) {
          console.log('蓝牙适配器初始化信息：')
          console.log(res)
          //获取蓝牙适配器状态
          wx.getBluetoothAdapterState({
            success: function(res) {
              console.log('蓝牙适配器状态：')
              console.log(res)
              if (res.available) {
                that.startBLEDevices();
              } else {
                wx.showModal({
                  title: '提示',
                  content: '当前蓝牙适配器不可用，请尝试重新开关蓝牙',
                })
              }
            },
            fail: function(e) {

            },
            complete: function(e) {},
          })
        },
        fail: function(e) {
          wx.showModal({
            title: '提示',
            content: '请打开蓝牙后重试',
          })
        },
        complete: function(e) {},
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级微信到最新版本后重试',
      })
    }
  },

  startBLEDevices: function() {
    var that = this;
    wx.startBeaconDiscovery({
      uuids: ['23A01AF0-232A-4518-9C0E-323FB773F5EF'],
      success: function(res) {
        setInterval(function() {
          wx.getBeacons({
            success: function(res) {
              console.log("获取iBeacon设备：")
              console.log(res.beacons)
              that.setData({
                showInfo: JSON.stringify(res.beacons),
              })
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }, 5000);
        wx.onBeaconUpdate(function(res) {
          //console.log('监听iBeacon设备：')
          //console.log(res.beacons)
        })
      },
      fail: function(res) {
        wx.stopBeaconDiscovery({
          success: function(e) {
            console.log('停止beacon搜索')
            console.log(e)
          }
        })
      },
      complete: function(res) {},
    })
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function() {
    var that = this;
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
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