// pages/admin/shopOrders/shopOrders.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: util.shortToday(),
    shopList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myToast = this.selectComponent(".myToast")
    this.getShopList()
  },

  getShopList:function(){
    let that = this
    const query = Bmob.Query('_User');
    query.equalTo('boss_id', '==', util.getUserId())
    query.equalTo('isShopManager', '==', true)
    query.find().then(managerList => {
      let aList = new Array()
      managerList.map(manager => {
        var queryObj = Bmob.Query('shops');
        queryObj.equalTo('relation_manager_id', '==', manager.objectId);
        aList.push(queryObj.find())
      })
      Promise.all(aList).then(res=>{
        console.log(res)
        let shopList = []
        res.map(shops=>{
          shops.map(shop=>{
            shopList.push(shop)
          })
        })
        let blist = new Array()
        shopList.map(shop=>{
          let createdAt = this.data.startDate + ' 00:00:00'
          let createEnd = util.dayEnd(this.data.startDate)
          const aa = Bmob.Query('shopOrderCount');
          aa.equalTo('shop_id', '==', shop.objectId)
          aa.equalTo('createdAt', '>', createdAt)
          aa.equalTo('createdAt', '<', createEnd)
          blist.push(aa.find())
        })
        Promise.all(blist).then(count => {
          console.log(count)
          shopList.map((shop,index)=>{
            shop.count = count[index].length > 0 ? count[index][0].order_count :0
          })
          that.setData({
            shopList
					}, () => {
						wx.stopPullDownRefresh()
					})
        })
      })
    })
  },

  handleTap:function(e){
    console.log(e)
    let shop = e.currentTarget.dataset.shop
    wx.navigateTo({
      url: `./detail/detail?shop=${JSON.stringify(shop)}`,
    })
  }
})