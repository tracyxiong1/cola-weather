//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    Loadinghidden:true
  },
  onLoad: function () {
    wx.showLoading({
      title: '加载中...',
    });

    this.loadWeather();
  },
  refresh: function () {
    this.loadWeather();
  },
  loadWeather: function () {
    var that = this;
    var weather = {};
    var typeIcon = {
      "多云": "duoyun.png",
      "霾": "mai.png",
      "晴": "qing.png",
      "雾": "wu.png",
      "雷阵雨": "leizhenyu.png",
      "大雪": "daxue.png",
      "大雨": "dayu.png",
      "暴雪": "baoxue.png",
      "暴雨": "baoyu.png",
      "冰雹": "bingbao.png",
      "小雪": "xiaoxue.png",
      "小雨": "xiaoyu.png",
      "阴": "yin.png",
      "雨夹雪": "yujiaxue.png",
      "阵雨": "zhenyu.png",
      "中雨": "zhongyu.png"
    };
    var background = {
      "大雨": "background-dayu",
      "中雨": "background-dayu",
      "小雨": "background-xiaoyu",
      "暴雨": "background-dayu",
      "雷阵雨": "background-leizhenyu",
      "晴": "background-qing"
    };

    wx.request({
      url: 'https://int.dpool.sina.com.cn/iplookup/iplookup.php?format=json', 
      header: {
          'content-type': 'application/json'
      },
      success: function(res) {
        var city = res.data.city;
        if (city) {
          weather.city = city;
          // 请求接口相关文档 https://www.sojson.com/api/weather.html
          wx.request({
            url: 'https://www.sojson.com/open/api/weather/json.shtml?city=' + city,
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              wx.hideLoading();
              var weatherData = res.data;
              
              if (+weatherData.status === 200 && weatherData.data && weatherData.data.forecast && weatherData.data.forecast.length) {
                var forecast = weatherData.data.forecast; // 天气特征与未来天气 
                var todayWeather = forecast[0]; // 今天的天气
                var typeText = todayWeather.type; // 天气类型
                var today = {
                  wendu: weatherData.data.wendu || '0', // 温度
                  low: todayWeather.low && todayWeather.low.split(' ')[1], //最低温
                  high: todayWeather.high && todayWeather.high.split(' ')[1], //最高温
                  typeText,
                  week: todayWeather.date.slice(3), // 星期
                  typeIcon: typeIcon[typeText],
                  typeBackgorund: background[typeText] || 'background-default' //背景
                };

                var futureList = forecast.map(function (v, i) {
                  var wendu = v.low && v.high && v.low.split(' ')[1] + "-" + v.high.split(' ')[1];
                  return {
                    week: v.date && v.date.slice(3),
                    type: typeIcon[typeText],
                    wendu,
                    typeText: v.type
                  }
                });

                weather.today = today;
                weather.futureList = futureList;

                that.setData({
                  weather
                });
              } else {
                wx.showToast({
                  title: '网络出了小问题...',
                  icon: 'none'
                });
              }
            },
            fail: function (err) {
              wx.showToast({
                title: '网络出了小问题...',
                icon: 'none'
              });
            }
          });
        } else {
          wx.showToast({
            title: '获取城市失败...',
            icon: 'none'
          });
        }
      },
      fail: function(err) {
        wx.showToast({
          title: '获取城市失败...',
          icon: 'none'
        });
      }
    });
  },
  onShareAppMessage: function () {
    return {
      title: '可乐天气',
      path: '/pages/index/index'
    }
  }
})
