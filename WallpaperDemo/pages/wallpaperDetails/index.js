// pages/wallpaperDetails/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    details: [],
    wallpaper_width: '',
    wallpaper_height: '',
    network_available: true,
    saveImgBtnHidden: false,
    openSettingBtnHidden: true,
  },

  //预览壁纸图片
  previewImage: function() {
    wx.previewImage({
      current: '',
      urls: [this.data.details.url],
      success: function(res) {},
      fail: function(e) {},
      complete: function(e) {},
    })
  },

  //下载图片，检查授权
  save: function() {
    var that = this;
    wx.getSetting({
      success: function(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function(res) {
              //用户同意授权
              console.log(res)
              that.saveToAlbum();
            },
            fail: function(e) {
              //用户取消授权
              console.log(e)
              wx.showModal({
                title: '提示',
                content: '授权被拒绝，请尝试重新授权',
                showCancel: false,
              })
              that.setData({
                saveImgBtnHidden: true,
                openSettingBtnHidden: false
              })
            },
            complete: function(e) {},
          })
        } else {
          //用户已经授权过
          console.log(res)
          that.saveToAlbum();
        }
      },
      fail: function(e) {},
      complete: function(e) {},
    })
  },

  settingCallback: function(e) {
    var that = this;
    console.log(e)
    if (e.detail.authSetting['scope.writePhotosAlbum']) {
      wx.showModal({
        title: '提示',
        content: '授权成功',
        showCancel: false,
      })
      that.setData({
        saveImgBtnHidden: false,
        openSettingBtnHidden: true,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '授权失败，请尝试重新授权',
        showCancel: false,
      })
    }
  },

  //保存图片到相册
  saveToAlbum: function() {
    wx.downloadFile({
      url: this.data.details.url,
      success: function(res) {
        console.log(res)
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(e) {
              console.log(e)
              wx.showModal({
                title: '提示',
                content: '下载图片成功，已保存至相册中',
                showCancel: false,
              })
            },
            fail: function(e) {
              console.log(e)
            },
            complete: function(e) {},
          })
        }
      },
      fail: function(e) {},
      complete: function(e) {},
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '页面加载中',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })

    setTimeout(function() {
      wx.hideLoading()
    }, 1500)

    var that = this;
    console.log(options)
    var id = options.id;
    //获取当前壁纸信息
    wx.request({
      url: 'https://easy-mock.com/mock/5acc4e5c9d45b62054249b24/wallpaper/wallpaper?id=' + id,
      success: function(res) {
        console.log(res)
        //获取当前壁纸尺寸
        wx.getImageInfo({
          src: res.data.data.url,
          success: function(size) {
            that.setData({
              width: size.width,
              height: size.height,
            })
          },
          fail: function(e) {},
          complete: function(e) {}
        })
        that.setData({
          details: res.data.data,
        })
      },
      fail: function(e) {
        that.setData({
          network_available: false
        })
        wx.showModal({
          title: '提示',
          content: '网络连接错误，请检查网络',
          showCancel: false,
        })
      },
      complete: function(e) {}
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
      title: this.data.details.title,
      path: '/pages/mainPage/index?details_id=' + this.data.details.id,
      imageUrl: this.data.details.url,
      success: function(e) {
        console.log("转发成功:" + JSON.stringify(e));
      },
      fail: function(e) {
        console.log("转发失败:" + JSON.stringify(e));
      }
    }
  }
})