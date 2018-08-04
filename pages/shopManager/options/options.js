// pages/admin/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  handleTap: function(e) {
    switch (e.currentTarget.id) {
      case 'logout':
        {
          wx.clearStorage()
          wx.reLaunch({
            url: '../../index/index',
          })
        }
        break
      case "shops":
        {
          wx.navigateTo({
            url: '../shops/shops',
          })
        }
        break
      case "empManage":
        {
          wx.navigateTo({
            url: '../employee/employee',
          })
        }
        break
      case "empOrderNum":
        {
          wx.navigateTo({
            url: '../employeeOrderNum/employeeOrderNum',
          })
        }
        break
      case 'shopOrderNum':
        {
          wx.navigateTo({
            url: '../shopOrderNum/shopOrderNum',
          })
        }
        break
    }
  }
})