// pages/admin/abnormal/abnormal.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: util.getToday(),
    total: 0,
    dataSource: [],
    limit: 100,
    pageNo: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList(true, true)
  },

  getList: function(loading, clear) {
    if (loading) {
      wx.showLoading({
        title: '加载中..',
      })
    }
    let that = this
    const query = Bmob.Query("order");
    query.equalTo("createdAt", ">", that.data.startDate)
    query.equalTo('order_status', "==", 3)
    query.equalTo('boss_id', '==', util.getUserId())
    query.limit(that.data.limit)
    query.skip(that.data.limit * (that.data.pageNo - 1))
    let dataSource = that.data.dataSource
    if (clear) {
      dataSource = []
    }
    Promise.all([query.find(), query.count()]).then(res => {
      console.log(res)
      let arr = dataSource.concat(res[0])
      that.setData({
        dataSource: arr,
        total:res[1]
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }).catch(()=>{
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  handleTap:function(e){
    let phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  onReachBottom: function() {
    if (this.data.total == this.data.dataSource.length) {
      return
    }
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    this.getList(true, false)
  },
  onPullDownRefresh: function() {
    this.setData({
      pageNo: 1
    })
    this.getList(true, true)
  }
})