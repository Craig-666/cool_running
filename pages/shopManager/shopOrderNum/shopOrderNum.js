// pages/shopManager/employeeOrderNum/employeeOrderNum.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  onShow:function(){
    this.getShopList()
  },

  getShopList: function () {
    let that = this
    const query = Bmob.Query('shops');
    query.equalTo('relation_manager_id', '==', util.getUserId())
    query.limit(1000)
    query.find().then(res => {
      let list = []
      res.map(ele => {
        const eq = Bmob.Query('shopOrderCount')
        eq.equalTo('shop_id', '==', ele.objectId)
        list.push(eq.find())
      })
      Promise.all(list).then(aa => {
        res.map((bb, index) => {
          let cc = aa[index]
          if (cc.length > 0) {
            bb.count = cc[0].order_count
          }else{
            bb.count = '无'
          }
        })
        console.log(res)
        that.setData({
          list: res
        })
      })
    })
  },
  add: function () {
    wx.navigateTo({
      url: './addCount/addCount',
    })
  }

})