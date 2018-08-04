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
        for (let i = 0; i < employeeList.length; i++) {
          if (employeeList[i].length > 0) {
            let blist = []
            employeeList[i].map((emp) => {
              var queryObj = Bmob.Query('delivery_count');
              queryObj.equalTo('createdAt', '>', util.getToday());
              queryObj.equalTo('user_phone', '==', emp.username);
              blist.push(queryObj.count())
            })
            let clist = []
            employeeList[i].map(emp => {
              var queryObj = Bmob.Query('order');
              queryObj.equalTo('boss_id', '==', managerList[i].objectId);
              queryObj.equalTo('create_phone', '==', emp.username);
              queryObj.equalTo('createdAt', '>', util.getToday());
              clist.push(queryObj.count())
            })
            Promise.all(blist).then((bb) => {

              Promise.all(clist).then(cc => {

                employeeList[i].delivery_count = bb
                employeeList[i].order_count = cc
                managerList[i].employeeList = employeeList
                console.log(managerList)
                that.setData({
                  employeeList: managerList
                }, () => {
                  wx.hideLoading()
                  wx.stopPullDownRefresh()
                })
              })
            })
          }

        }
      })
    })

    // const query = Bmob.Query('_User');
    // query.equalTo('boss_id', '==', util.getUserId())
    // query.find().then(emplist=>{
    //   let aList = new Array()
    //   emplist.map(emp => {
    //     var queryObj = Bmob.Query('order');
    //     queryObj.equalTo('boss_id', '==', util.getUserId());
    //     queryObj.equalTo('create_phone', '==', emp.username);
    //     queryObj.equalTo('createdAt', '>', util.getToday());
    //     aList.push(queryObj.count())
    //   })
    //   let bList = new Array()
    //   emplist.map(emp => {
    //     var queryObj = Bmob.Query('delivery_count');
    //     queryObj.equalTo('createdAt', '>', util.getToday());
    //     queryObj.equalTo('user_phone', '==', emp.username);
    //     bList.push(queryObj.count())
    //   })
    //   Promise.all(aList).then(alist=>{
    //     Promise.all(bList).then(blist=>{
    //       emplist.map((ele,index)=>{
    //         ele.delivery_count = blist[index]
    //         ele.order_count = alist[index]
    //       })
    //       console.log(emplist)
    //       that.setData({
    //         datasource: emplist
    //       },()=>{
    //         wx.hideLoading()
    //         wx.stopPullDownRefresh()
    //       })
    //     })
    //   })
    // })
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