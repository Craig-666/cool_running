// pages/admin/deliveryInfo/deliveryInfo.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    const query = Bmob.Query('delivery_count');
    query.equalTo('createdAt', '>', util.getToday())
    query.equalTo('user_phone', '==', options.phone)
    query.limit(1000)
    query.find().then(res=>{
      console.log(res)
      res.map(ele=>{
        ele.timeDiff = util.timeDiff(ele.createdAt, ele.updatedAt)
      })
      that.setData({
        phone:options.phone,
        name:options.name,
        delveryList:res
      })
    })
  },
  
  tap:function(e){
    let objectId = e.currentTarget.dataset.objid
    wx.navigateTo({
      url: './deliveryOrder/deliveryOrder?objid='+objectId,
    })
  }
})