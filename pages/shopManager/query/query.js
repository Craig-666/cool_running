// pages/admin/query/query.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myToast = this.selectComponent(".myToast")

  },
  search:function(e){
    let value = e.detail.value
    if(!util.checkPhoneNum(value.phone)){
      this.myToast.show('手机号不对')
      return
    }
    let that = this
    const query = Bmob.Query("order");
    query.equalTo("phone_num", "==", value.phone);
    query.equalTo("createdAt", ">", util.getBeforeDays());
    query.find().then(res => {
      console.log(res)
      if(res.length == 0){
        that.myToast.show('当天没有该客户电话记录')
      }
      that.setData({
        result:res
      })
    });
  },
  call:function(e){
    let phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  }
})