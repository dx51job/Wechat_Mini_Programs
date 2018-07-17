//index.js

Page({
  //绑定数据
  data: {
    //图片旋转角度
    rotate: 0,
    //方向
    direction: '--',
    //角度
    angle: '--',
  },

  //页面加载完成
  onLoad: function() {
    //缓存this
    var that = this;
    //获取罗盘数据
    wx.onCompassChange(function(res) {
      //console.log(res);
      //获取旋转角度
      var value = res.direction;
      that.setData({
        //更新图片旋转角度
        rotate: -value,
        //更新方位
        direction: that.getDirectionText(value),
        //更新显示的角度数字
        angle: value.toFixed(2),
      })
    })
    //在5秒钟之后，判断angle与direction默认值是否发生改变，如果没有改变，说明onCompassChange没有执行，提升用户手机不支持罗盘
    setTimeout(function() {
      console.log(that.data.direction);
      if (that.data.direction === '--' && that.data.angle === '--') {
        wx.showModal({
          title: '提示',
          content: '您的手机不支持或者已禁用电子罗盘',
          showCancel: false,
        })
      }
    }, 5000)
  },

  //获取当前角度对应的方位文字
  getDirectionText: function(value) {
    //定义方位文字
    var dir = '正北 东北 正东 东南 正南 西南 正西 西北'.split(' ');
    //定义角度区间值
    var dirAngle = 360 / 8;
    //获取文本索引值
    var index = Math.floor((value + dirAngle / 2) / dirAngle % 8);
    //返回文本
    return dir[index];
  }
})