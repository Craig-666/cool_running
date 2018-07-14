// pages/admin/index/index.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datasource:[],
    abCount:0,
    interval:null
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList(true)
    this.data.interval = setInterval(
      ()=>{
        this.queryAbnormal()
      },
      1000 * 60)
  },

  onUnload:function(){
    clearInterval(this.data.interva)
  },

  queryAbnormal:function(){
    let that = this
    const query = Bmob.Query('order');
    query.equalTo('createdAt', '>', util.getToday())
    query.equalTo('boss_id', '==', util.getUserId())
    query.equalTo('order_status',"==" ,3)
    query.count().then(res=>{
      console.log(res)
      that.setData({
        abCount:res
      })
    })
  },


  getList:function(loading){
    if(loading){
      wx.showLoading({
        title: '加载中。。',
      })
    }
    let that = this
    const query = Bmob.Query('order');
    query.equalTo('createdAt', '>', util.getToday())
    query.equalTo('boss_id', '==', util.getUserId())

    const queryDC = Bmob.Query('delivery_count');
    queryDC.equalTo('createdAt', '>', util.getToday())
    
    Promise.all([
      query.find(),
      queryDC.find()
    ]).then(values=>{
      let orderList = util.groupby(values[0], 'create_phone','create_name')
      let countList = util.groupby(values[1], 'user_phone')
      orderList.map(ele=>{
        countList.map(val=>{
          if (val.key == ele.key){
            ele.delivery_count = val.count
          }
        })
      })
      that.setData({
        datasource:orderList
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }).catch(()=>{
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },

  handleTap:function(e){
    let id = e.currentTarget.id
    switch (id){
      case 'employee':{
        let phone = e.currentTarget.dataset.phone
        wx.navigateTo({
          url: '../deliveryInfo/deliveryInfo?phone=' + phone + '&name=' + e.currentTarget.dataset.name,
        })
      }break
      case 'search': {
        let phone = e.currentTarget.dataset.phone
        wx.navigateTo({
          url: '../options/options'
        })
      } break
      case 'abnormal': {
        wx.navigateTo({
          url: '../abnormal/abnormal'
        })
      } break
    }
    
  },

  search:function(){
    wx.navigateTo({
      url: '../options/options'
    })
  },

  onPullDownRefresh:function(){
    this.getList(true)
  }

})