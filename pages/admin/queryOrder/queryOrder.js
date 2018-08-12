// pages/admin/queryOrder/queryOrder.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    employee:{name:'选员工'},
    end: util.shortToday(),
    fields: 'day',
    startDate: util.shortToday(),
    searchType: '按月',
    acount:0,
    bcount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myToast = this.selectComponent(".myToast")
    this.getEmployeeList()
  },
  getEmployeeList:function(){
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
      Promise.all(aList).then((list) => {
        let employeeList = []
        list.map(emplist=>{
          emplist.map(emp=>{
            employeeList.push(emp)
          })
        })
        that.setData({
          employeeList
        })
      })
    })
  },
  handleChange:function(e){
    let target = e.currentTarget
    let dataset = target.dataset
    let fields = this.data.fields
    switch(target.id){
      case 'timePicker': {
        this.setData({
          startDate: e.detail.value
        })
      } break
      case 'typeChange': {
        if (fields == 'day') {
          this.setData({
            fields: 'month',
            searchType: '按天',
            startDate: util.shortMonth(),
            end: util.shortMonth()
          })
        } else {
          this.setData({
            fields: 'day',
            searchType: '按月',
            startDate: util.shortToday(),
            end: util.shortToday()
          })
        }
      } break
      case 'employeePicker':{
        let index = parseInt(e.detail.value)
        this.setData({
          employee : this.data.employeeList[index]
        })
      }break
    }
  },
  query:function(){
    if(!this.data.employee.objectId){
      this.myToast.show('先选员工')
      return
    }
    let createdAt = ''
    if (this.data.fields == 'day') {
      createdAt = this.data.startDate + ' 00:00:00'
    } else {
      createdAt = this.data.startDate + '-01 00:00:00'
    }
    let createEnd = this.data.fields == 'day' ? util.dayEnd(this.data.startDate) : util.monthEnd(this.data.startDate)
    let that = this
    const aa = Bmob.Query('order');
    aa.equalTo('create_phone', '==', this.data.employee.username)
    aa.equalTo('createdAt', '>', createdAt)
    aa.equalTo('createdAt', '<', createEnd)
  

    const bb = Bmob.Query('employeeOrderCount');
    bb.equalTo('employee_id', '==', this.data.employee.objectId)
    bb.equalTo('createdAt', '>', createdAt)
    bb.equalTo('createdAt', '<', createEnd)
    
    Promise.all([aa.count(),bb.find()]).then(res=>{
      let bcount = 0
      let list = res[1]
      list.map(ele=>{
        bcount += ele.order_count
      })
      that.setData({
        acount:res[0],
        bcount
      })
    })
  }
})