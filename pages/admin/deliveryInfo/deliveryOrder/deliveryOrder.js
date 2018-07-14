// pages/admin/deliveryInfo/deliveryOrder/deliveryOrder.js
var Bmob = require('../../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../../utils/util.js')
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
    const query = Bmob.Query('order');
    query.equalTo('delivery_id', '==', options.objid)
    query.find().then(res => {
      that.setData({
        orderList:res
      })
    })
  },

  
})