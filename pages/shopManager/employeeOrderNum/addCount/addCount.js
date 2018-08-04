// pages/shopManager/employeeOrderNum/employeeOrderNum.js
var Bmob = require('../../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    employeeList: [],
    employeeInfo: {},
    count: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myToast = this.selectComponent(".myToast")
    this.getEmployeeList()
  },

  getEmployeeList: function () {
    let that = this
    const query = Bmob.Query('_User');
    query.equalTo('boss_id', '==', util.getUserId())
    query.find().then(res => {
      that.setData({
        employeeList: res
      })
    })
  },

  save: function () {
    if (this.data.employeeInfo == {}) {
      this.myToast.show('先选员工')
      return
    }
    if (this.data.count == '') {
      this.myToast.show('输入单量')
      return
    }
    let that = this
    const query = Bmob.Query("employeeOrderCount");
    query.equalTo('employee_id', '==', this.data.employeeInfo.objectId)
    query.equalTo('createdAt', '>=', util.getToday())
    query.find().then(res => {
      if (res.length > 0) {
        that.myToast.show('当天已添加过该员工单量')
      } else {
        const bq = Bmob.Query("employeeOrderCount");
        bq.set('order_count', parseInt(this.data.count))
        bq.set('employee_id', this.data.employeeInfo.objectId)
        bq.save().then(re => {
          that.myToast.show('保存成功')
        })
      }
    })
  },
  handleChange: function (e) {
    let index = parseInt(e.detail.value)
    this.setData({
      employeeInfo: this.data.employeeList[index]
    })
  },
  handleInput: function (e) {
    this.setData({
      count: e.detail.value
    })
  }
})