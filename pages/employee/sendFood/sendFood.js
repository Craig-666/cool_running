// pages/employee/sendFood/sendFood.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectIndex: '',
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.myToast = this.selectComponent(".myToast")
    this.abModal = this.selectComponent(".abModal")
    // this.setData({
    //   phoneList: JSON.parse(options.phoneList)
    // })
    this.getReasons()
    this.getList()
  },
  onShow:function(){
    console.log('onShow')
  },

  getList: function() {
    let objId = wx.getStorageSync('delivery_objectId')
    let that = this
    const query = Bmob.Query("order");
    query.equalTo("delivery_id", "==", objId)
    // query.order('-building_num')
    query.limit(1000)
    query.find().then(res => {
      for (let i = 0; i < res.length-1; i++) {
				for (let j = i + 1; j < res.length; j++) {
					if (parseInt(res[i].building_num) > parseInt(res[j].building_num)) {//如果前面的数据比后面的大就交换
						var temp = res[i]
						res[i] = res[j]
						res[j] = temp
					}
        }
      }
      that.setData({
        phoneList: res
      })
    })
  },

  getReasons: function() {
    let that = this
    const query = Bmob.Query("abnormal");
    query.find().then(res => {
      console.log(res)
      let list = []
      res.map(ele => {
        list.push(ele.abnormal_reason)
      })
      that.setData({
        list
      })
    });
  },

  newOrders: function() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定都送完餐并且进行下一轮输入吗',
      success: function(e) {
        if (e.confirm) {
          wx.redirectTo({
            url: '../index/index'
          })
          // let objId = wx.getStorageSync('delivery_objectId')
          // let isUpdated = wx.getStorageSync('isUpdated')
          // if(isUpdated){
          //   wx.redirectTo({
          //     url: '../index/index'
          //   })
          // }else{
          //   const query = Bmob.Query("delivery_count");
          //   query.set('id', objId)
          //   query.save().then(res => {
          //     wx.setStorageSync('isUpdated', true)
          //     wx.redirectTo({
          //       url: '../index/index'
          //     })
          //   })
          // }
        }
      }
    })
  },

  //inputModal确认事件
  _confirmEvent() {
    let that = this
    let reason = ''
    reason = that.abModal.data.abList[that.abModal.data.selIndex] + ';' + that.abModal.data.abReason
    let phoneList = this.data.phoneList
    let index = this.data.curIndex
    const query = Bmob.Query('order');
    query.set('id', phoneList[index].objectId)
    query.set('order_status', 3)
    query.set('abnormal_reason', reason)
    query.save().then(res => {
      that.myToast.show('操作成功')
      phoneList[index].order_status = 3
      that.setData({
        phoneList
      })
    }).catch(err => {
      that.myToast.show('操作失败')
    })
    this.abModal.hideModal()

  },

  handleTap: function(e) {
    let that = this
    let dataset = e.currentTarget.dataset
    let phoneList = that.data.phoneList
    let index = dataset.index
    switch (e.currentTarget.id) {
      case 'error':
        {
          that.setData({
            curIndex: index
          })
          that.abModal.showModal()
        }
        break
      case 'done':
        {
          wx.showModal({
            title: '提示',
            content: '确定要完成吗?',
            success: function(res) {
              if (res.confirm) {

              }
            }
          })
        }
        break
      case 'call':
        {
          let that = this
          wx.makePhoneCall({
            phoneNumber: dataset.phone,
            success: function() {
              const query = Bmob.Query('order');
              query.set('id', phoneList[index].objectId)
              query.set('order_status', 2)
              query.save().then(res => {
                phoneList[index].order_status = 2
                that.setData({
                  phoneList
                })
              })
            }
          })
        }
        break
    }
  }
})