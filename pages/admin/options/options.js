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
  onLoad: function (options) {

  },

  handleTap: function (e) {
    switch (e.currentTarget.id) {
      case 'logout':
        {
          wx.clearStorage()
          wx.reLaunch({
            url: '../../index/index',
          })
        }
        break
      case 'shopManage':{
        wx.navigateTo({
          url: '../shopManager/shopManager',
        })
      }break
			// case "empManage":
      //   {
      //     wx.navigateTo({
			// 			url: '../employee/employee',
      //     })
      //   }
      //   break
      case 'shopOrders':{
        wx.navigateTo({
          url: '../shopOrders/shopOrders',
        })
      }break
      case "query":
        {
          wx.navigateTo({
            url: '../query/query',
          })
        }
        break
      case 'month':
        {
          wx.navigateTo({
            url: '../monthQuery/monthQuery',
          })
        }
        break
      case 'day':
        {
          wx.navigateTo({
            url: '../dayQuery/dayQuery',
          })
        }
        break
    }
  }
})