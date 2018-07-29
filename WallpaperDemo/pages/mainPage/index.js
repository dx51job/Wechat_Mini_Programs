// pages/mainPage/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [],
    network_available: true,
  },

  //跳转壁纸信息页面
  naviWallpaperDetails: function(e) {
    console.log(e)
    var wallpaper_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../wallpaperDetails/index?id=' + wallpaper_id,
      success: function(res) {},
      fail: function(e) {},
      complete: function(e) {}
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '页面加载中',
      mask: true,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 1500)

    if(options.details_id) {
      wx.navigateTo({
        url: '../wallpaperDetails/index?id=' + options.details_id,
        success: function (res) { },
        fail: function (e) { },
        complete: function (e) { }
      })
    }

    var that = this;
    //获取所有壁纸
    wx.request({
      url: 'https://easy-mock.com/mock/5acc4e5c9d45b62054249b24/wallpaper/wallpapers',
      success: function(res) {
        console.log(res.data)
        that.setData({
          items: res.data.data,
        })
      },
      fail: function(res) {
        that.setData({
          network_available: false
        })
        wx.showModal({
          title: '提示',
          content: '网络连接错误，请检查网络',
          showCancel: false,
        })
      },
      complete: function(res) {}
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    console.log(res)
    return {
      title: '壁纸小程序',
      path: '/pages/mainPage/index',
      success: function(e) {
        console.log("转发成功:" + JSON.stringify(e));
      },
      fail: function(e) {
        console.log("转发失败:" + JSON.stringify(e));
      }
    }
  }
})