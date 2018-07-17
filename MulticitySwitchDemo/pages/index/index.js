//index.js
//引入城市数据
var city = require('../../utils/city.js');
console.log(city)

Page({
  //定义数据
  data: {
    //选中的城市
    chooseCity: '--',
    //选中的字符索引
    searchLetter: [],
    //窗口高度
    windowHeight: 0,
    //字母高度
    itemHeight: 0,
    //城市数据
    cityList: [],
    //历史记录
    cityHistory: [],
    //热门城市
    hotCity: [],
    //显示的字母
    showLetter: '',
  },

  //页面加载完成
  onLoad: function() {
    //获取屏幕高度
    var windowHeight = wx.getSystemInfoSync().windowHeight;
    //每一个字母的高度
    var itemHeight = (windowHeight - 50) / city.searchLetter.length;
    //获取所有选中过的城市
    var cityHistory = wx.getStorageSync('cityHistory');
    //更新数据
    this.setData({
      searchLetter: city.searchLetter,
      windowHeight: windowHeight,
      itemHeight: itemHeight,
      cityList: city.cityList,
      hotCity: city.hotCity,
      cityHistory: cityHistory,
      //更新选中的城市，如果不存在定义默认值
      chooseCity: cityHistory[0] || '--',
    })
  },

  //点击选中的城市
  updateChooseCity: function(e) {
    //缓存this
    var that = this;
    //获取点击的城市
    var chooseCity = e.target.dataset.city;
    //获取本地存储中当前历史访问城市
    var cityHistory = wx.getStorageSync('cityHistory') || [];
    //首先，移除历史访问中和点击重复的城市
    if (cityHistory.length > 0) {
      for (var i = 0; i < cityHistory.length; i++) {
        if (chooseCity === cityHistory[i]) {
          cityHistory.splice(i, 1);
        }
      }
    }
    //然后，当前点击的城市插入历史访问中的第一个位置
    cityHistory.unshift(chooseCity);
    //限制历史访问城市数量为6个
    cityHistory = cityHistory.slice(0, 6);
    //更新本地存储
    wx.setStorage({
      key: 'cityHistory',
      data: cityHistory,
      //存储成功，则更新视图
      success: function(res) {
        //更新数据
        that.setData({
          chooseCity: chooseCity,
          cityHistory: cityHistory,
        })
      }
    })
  },

  //点击字母，切换视图
  changeShowLetter: function(e) {
    //获取点击的字母
    var letter = e.target.dataset.letter;
    //更新数据
    this.setData({
      showLetter: letter,
    })
    //console.log(e.target.dataset.letter)
  },

  //滑动字母表，切换显示的城市
  letterTouchMove: function(e) {
    //获取手指所在容器元素内的位置
    var pageY = e.touches[0].pageY - 50;
    //获取每一个字母的高度
    var itemHeight = this.data.itemHeight;
    //包含的字母
    var index = Math.floor(pageY / itemHeight);
    //根据索引值获取字母
    var letter = this.data.searchLetter[index];
    //console.log("pageY: "+ pageY +" index: " + index + " letter: " + letter);
    //如果当前letter与this.data.showLetter不同时，更新显示的字母
    //还要保证字母letter存在
    if (letter && letter != this.data.showLetter) {
      //更新显示的字母
      this.setData({
        showLetter: letter,
      })
      //console.log(e.touches[0].pageY);
    }
  }

})