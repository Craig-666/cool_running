// pages/admin/shopOrders/shopOrders.js
var Bmob = require('../../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    end: util.shortToday(),
    fields: 'day',
    startDate: util.shortToday(),
    searchType: '按月',
    shopList: [],
    orderCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      shop: JSON.parse(options.shop)
    })
    this.myToast = this.selectComponent(".myToast")
    this.query()
  },


  handleChange: function (e) {
    console.log(e)
    let target = e.currentTarget
    let dataset = target.dataset
    let fields = this.data.fields
    switch (target.id) {
      case 'timePicker': {
        this.setData({
          startDate: e.detail.value
        })
      } break
      case 'typeChange': {
        if (fields == 'day') {
          this.setData({
            fields: 'month',
            searchType: '按天',
            startDate: util.shortMonth(),
            end: util.shortMonth()
          })
        } else {
          this.setData({
            fields: 'day',
            searchType: '按月',
            startDate: util.shortToday(),
            end: util.shortToday()
          })
        }
      } break
    }
  },
  query: function () {
    let createdAt = ''
    if (this.data.fields == 'day') {
      createdAt = this.data.startDate + ' 00:00:00'
    } else {
      createdAt = this.data.startDate + '-01 00:00:00'
    }
    let createEnd = this.data.fields == 'day' ? util.dayEnd(this.data.startDate) : util.monthEnd(this.data.startDate)
    let that = this
    const query = Bmob.Query('shopOrderCount');
    query.equalTo('shop_id', '==', this.data.shop.objectId)
    query.equalTo('createdAt', '>', createdAt)
    query.equalTo('createdAt', '<', createEnd)
    query.find().then(res => {
      console.log(res)
      let orderCount = 0
      res.map(count => {
        orderCount += count.order_count
      })
      that.setData({
        orderCount
      })
    })
  }
})