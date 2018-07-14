// pages/admin/monthQuery/monthQuery.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    curDate: util.shortToday(),
    phoneNum: '',
    endDate: util.shortToday() + ' 23:59:59',
    startDate: util.shortToday() + ' 00:00:00',
    pageNo: 1,
    total: 0,
    dataSource: [],
    limit: 100,
    delivery:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myToast = this.selectComponent(".myToast")
    if(options.phone){
      this.setData({phoneNum:options.phone})
      this.search(true,true)
    }
  },

  handleInput: function (e) {
    switch (e.currentTarget.id) {
      case 'phone': {
        this.setData({
          phoneNum: e.detail.value
        })
      } break
    }
  },
  monthChange: function (e) {
    this.setData({
      curDate: e.detail.value,
      startDate: e.detail.value + ' 00:00:00',
      endDate: e.detail.value + ' 23:59:59',
    })
  },

  doSearch:function(){
    this.search(true,true)
  },  
  search: function (loading, clear) {
    if (this.data.startDate == '') {
      this.myToast.show("先选日期")
      return
    }
    if (this.data.phoneNum != '' && !util.checkPhoneNum(this.data.phoneNum)) {
      this.myToast.show("手机号不对")
      return
    }
    if (loading) {
      wx.showLoading({
        title: '加载中..',
      })
    }
    let that = this
    const query = Bmob.Query("order");
    query.equalTo("createdAt", ">", that.data.startDate)
    query.equalTo("createdAt", "<", that.data.endDate)
    query.equalTo('boss_id', '==', util.getUserId())
    if (that.data.phoneNum != '') {
      query.equalTo("create_phone", "==", that.data.phoneNum)
    }
    query.limit(that.data.limit)
    query.skip(that.data.limit * (that.data.pageNo - 1))
    let dataSource = that.data.dataSource
    if (clear) {
      dataSource = []
    }

    const dquery = Bmob.Query("delivery_count");
    dquery.equalTo("createdAt", ">", that.data.startDate)
    dquery.equalTo("createdAt", "<", that.data.endDate)
    if (that.data.phoneNum != '') {
      dquery.equalTo("user_phone", '==', that.data.phoneNum)
    }
    

    Promise.all([query.find(), query.count(),dquery.count()]).then(res => {
      console.log(res)
      let arr = dataSource.concat(res[0])
      that.setData({
        total: res[1],
        dataSource: arr,
        delivery:res[2]
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    }).catch(e => {
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  onReachBottom: function () {
    if (this.data.total == this.data.dataSource.length) {
      return
    }
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    this.search(true, false)
  },
  onPullDownRefresh: function () {
    this.setData({
      pageNo: 1
    })
    this.search(true, true)
  }
})