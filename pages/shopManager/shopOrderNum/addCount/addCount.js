// pages/shopManager/employeeOrderNum/employeeOrderNum.js
var Bmob = require('../../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopList: [],
    shopInfo: {},
    count: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myToast = this.selectComponent(".myToast")
    this.getshopList()
  },

  getshopList: function () {
    let that = this
    const query = Bmob.Query('shops');
    query.equalTo('relation_manager_id', '==', util.getUserId())
    query.find().then(res => {
      that.setData({
        shopList: res
      })
    })
  },

  save: function () {
    if (this.data.shopInfo == {}) {
      this.myToast.show('先选店铺')
      return
    }
    if (this.data.count == '') {
      this.myToast.show('输入单量')
      return
    }
    let that = this
    const query = Bmob.Query("shopOrderCount");
    query.equalTo('shop_id', '==', this.data.shopInfo.objectId)
    query.equalTo('createdAt', '>=', util.getToday())
    query.find().then(res => {
      if (res.length > 0) {
        that.myToast.show('当天已添加过该商家单量')
      } else {
        const bq = Bmob.Query("shopOrderCount");
        bq.set('order_count', parseInt(this.data.count))
        bq.set('shop_id', this.data.shopInfo.objectId)
        bq.save().then(re => {
          that.myToast.show('保存成功')
        })
      }
    })
  },
  handleChange: function (e) {
    let index = parseInt(e.detail.value)
    this.setData({
      shopInfo: this.data.shopList[index]
    })
  },
  handleInput: function (e) {
    this.setData({
      count: e.detail.value
    })
  }
})