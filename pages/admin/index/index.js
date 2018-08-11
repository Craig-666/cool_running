// pages/admin/index/index.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datasource: [],
    abCount: 0,
    interval: null
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.interval = setInterval(
      () => {
        this.queryAbnormal()
      },
      1000 * 60)
  },

  onShow: function() {
    this.getList(true)
    this.queryAbnormal()
  },

  onUnload: function() {
    clearInterval(this.data.interva)
  },

  queryAbnormal: function() {
    if (!util.getUserId()) {
      return
    }
    let that = this
    const query = Bmob.Query('order');
    query.equalTo('createdAt', '>', util.getToday())
    query.equalTo('boss_id', '==', util.getUserId())
    query.equalTo('order_status', "==", 3)

    const bq = Bmob.Query('order');
    bq.equalTo('createdAt', '>', util.getToday())
    bq.equalTo('boss_id', '==', util.getUserId())
    bq.equalTo('order_status', "==", 3)
    bq.equalTo('handled', "!=", true)

    Promise.all([query.count(), bq.count()]).then(values => {
      that.setData({
        abCount: values[0],
        waitHandle: values[1]
      })
    })
  },
  getList: function(loading) {
    if (loading) {
      wx.showLoading({
        title: '加载中。。',
      })
    }

    let that = this
    const query = Bmob.Query('_User');
    query.equalTo('boss_id', '==', util.getUserId())
    query.equalTo('isShopManager', '==', true)
    query.find().then(managerList => {
      let aList = new Array()
      managerList.map(manager => {
        var queryObj = Bmob.Query('_User');
        queryObj.equalTo('boss_id', '==', manager.objectId);
        aList.push(queryObj.find())
      })
      Promise.all(aList).then((employeeList) => {
        console.log('emp', employeeList)
        employeeList.map((employee,index)=>{
          if(employee.length == 0){
            return
          }
          let blist = []
          let clist = []
          employee.map((emp) => {
            var bb = Bmob.Query('delivery_count');
            bb.equalTo('createdAt', '>', util.getToday());
            bb.equalTo('user_phone', '==', emp.username);
            blist.push(bb.count())

            var cc = Bmob.Query('order');
            cc.equalTo('boss_id', '==', managerList[index].objectId);
            cc.equalTo('create_phone', '==', emp.username);
            cc.equalTo('createdAt', '>', util.getToday());
            clist.push(cc.count())
          })
        
          Promise.all(blist).then((dd) => {
            console.log(dd)
            dd.map((ff,ddindex)=>{
              employee[ddindex].delivery_count = ff
            })

            Promise.all(clist).then(ee => {
              console.log(ee)
              dd.map((gg, ddindex) => {
                employee[ddindex].order_count = gg
              })
              
              managerList[index].employeeList = employee
              console.log(managerList)
              that.setData({
                datasource: managerList
              }, () => {
                wx.hideLoading()
                wx.stopPullDownRefresh()
              })
            })
          })
        })
      })
    })
  },

  handleTap: function(e) {
    let id = e.currentTarget.id
    switch (id) {
      case 'employee':
        {
          let phone = e.currentTarget.dataset.phone
          wx.navigateTo({
            url: '../deliveryInfo/deliveryInfo?phone=' + phone + '&name=' + e.currentTarget.dataset.name,
          })
        }
        break
      case 'search':
        {
          let phone = e.currentTarget.dataset.phone
          wx.navigateTo({
            url: '../options/options'
          })
        }
        break
      case 'abnormal':
        {
          wx.navigateTo({
            url: '../abnormal/abnormal'
          })
        }
        break
    }

  },

  search: function() {
    wx.navigateTo({
      url: '../options/options'
    })
  },

  onPullDownRefresh: function() {
    this.getList(true)
  }

})