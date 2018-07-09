// pages/me/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu: [
      { header: true },
      { icon: 'money_bag.png', name: '钱包' },
      { name: '', header: true },
      { icon: 'like.png', name: '收藏' },
      { header: true },
      { icon: 'photos.png', name: '相册' },
      { icon: 'card_bag.png', name: '卡包' },
      { icon: 'smile.png', name: '表情' },
      { header: true },
      { icon: 'menu_settings.png', name: '设置' },
    ]
  },

  bindNavigation: function(e) {
    console.log(e.currentTarget.dataset.index)
    if (1 == e.currentTarget.dataset.index) {
      wx.navigateTo({
        url: '/pages/wallet/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})