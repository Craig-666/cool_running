// pages/admin/shopOrders/shopOrders.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    end:util.shortToday(),
    fields:'day',
    startDate: util.shortToday(),
    searchType:'按月',
    shop:{shopName:'选商家'},
    shopList:[],
    orderCount:0
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
        let shopList = []
        res.map(ele=>{
          ele.map(shop=>{
            shopList.push(shop)
          })
        })
        that.setData({
          shopList
        })
      })
    })
  },

  handleChange:function(e){
    console.log(e)
    let target = e.currentTarget
    let dataset = target.dataset
    let fields = this.data.fields
    switch (target.id){
      case 'timePicker': {
        this.setData({
          startDate:e.detail.value
        })
      }break
      case 'shopPicker':{
        let index = parseInt(e.detail.value)
        let shop = this.data.shopList[index]
        this.setData({
          shop
        })
      }break
      case 'typeChange':{
        if(fields == 'day'){
          this.setData({
            fields:'month',
            searchType:'按天',
            startDate:util.shortMonth(),
            end:util.shortMonth()
          })
        }else{
          this.setData({
            fields: 'day',
            searchType: '按月',
            startDate: util.shortToday(),
            end: util.shortToday()
          })
        }
      }break
    }
  },
  query:function(){
    if(!this.data.shop.objectId){
      this.myToast.show("先选商家")
      return
    }
    let createdAt = ''
    if(this.data.fields == 'day'){
      createdAt = this.data.startDate + ' 00:00:00'
    }else{
      createdAt = this.data.startDate + '-01 00:00:00'
    }
    let that = this
    const query = Bmob.Query('shopOrderCount');
    query.equalTo('shop_id', '==', this.data.shop.objectId)
    query.equalTo('createdAt', '>', createdAt)
    query.find().then(res=>{
      console.log(res)
      let orderCount = 0
      res.map(count=>{
        orderCount += count.order_count
      })
      that.setData({
        orderCount
      })
    })
  }
})