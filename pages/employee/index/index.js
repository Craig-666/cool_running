// pages/employee/index/index.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNum: '',
    buildingNum: '',
    transferNum: '',
    phoneList: [],
    selectIndex: '',
    selectItem: {},
    phoneFocus: true,
    transferFocus: false,
    buildingFocus: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.inputModal = this.selectComponent(".inputModal")
    this.myToast = this.selectComponent(".myToast")
  },

  handleInput: function(e) {
    let value = e.detail.value
    switch (e.currentTarget.id) {
      case 'phone':
        {
          this.setData({
            phoneNum: value
          }, () => {
            if (value.length == 11) {
              this.setData({
                phoneFocus: false,
                transferFocus: true
              })
            }
          })
        }
        break
      case 'transfer':
        {
          this.setData({
            transferNum: value
          }, () => {
            if (value.length == 4) {
              this.setData({
                transferFocus: false,
                buildingFocus: true
              })
            }
          })
        }
        break
      case 'building':
        {
          this.setData({
            buildingNum: value
          })
        }
        break
    }
  },

  handleTap: function(e) {
    let that = this
    switch (e.currentTarget.id) {
      case 'goon':
        {
          this.goon()
        }
        break
      case 'last':
        {
					if(wx.getStorageSync('delivery_objectId')){
						wx.redirectTo({
							url: '../sendFood/sendFood',
						})
					}
        }
        break
      case 'done':
        {
          if (this.data.phoneList.length == 0) {
            return
          }
          wx.showLoading({
            title: '正在提交',
          })
          let that = this
          const query = Bmob.Query('delivery_count');
          query.set('user_phone', util.getUserPhone())
          query.set('order_count', this.data.phoneList.length)
          query.save().then(res => {
            let objectId = res.objectId
            wx.setStorageSync('delivery_objectId', objectId)
            that.savePhone(objectId)
          })
        }
        break

      case 'change':
        {
          let phoneList = that.data.phoneList
          let dataset = e.currentTarget.dataset
          this.setData({
            selectItem: phoneList[dataset.index],
            selectIndex: dataset.index
          })
          this.inputModal.showModal()
        }
        break

    }
  },

  savePhone: function(objId) {
    const queryArray = new Array();
    this.data.phoneList.map(phoneItem => {
      var queryObj = Bmob.Query('order');
      queryObj.set("phone_num", phoneItem.phoneNum)
      queryObj.set("building_num", phoneItem.buildingNum)
      queryObj.set("create_name", util.getUserName())
      queryObj.set("transfer_num", phoneItem.transferNum == '0000' ? '' : phoneItem.transferNum)
      queryObj.set("create_phone", util.getUserPhone())
      queryObj.set("order_status", 1)
      queryObj.set("boss_id", util.getBossId())
      queryObj.set("user_id", util.getUserId())
      queryObj.set("delivery_id", objId)
      queryArray.push(queryObj);
    })
    // 传入刚刚构造的数组
    Bmob.Query('order').saveAll(queryArray).then(result => {
      let phoneList = this.data.phoneList
      phoneList.map((phone, index) => {
        Object.assign(phone, result[index].success)
      })
      wx.hideLoading()
      wx.redirectTo({
        url: '../sendFood/sendFood',
      })
    }).catch(err => {
      wx.hideLoading()
      this.myToast.show('操作失败..')
    });
  },

  //inputModal取消事件
  _cancelEvent() {
    this.inputModal.hideModal();
  },
  //inputModal确认事件
  _confirmEvent() {
    Object.assign(this.data.selectItem, this.inputModal.data.orderItem)
    let phoneList = this.data.phoneList
    phoneList[parseInt(this.data.selectIndex)] = this.data.selectItem
    this.setData({
      phoneList
    })
    this.inputModal.hideModal()
  },

  goon: function(e) {
    if (!util.checkPhoneNum(this.data.phoneNum)) {
      this.myToast.show('手机号不对')
      return
    }
    if (this.data.transferNum.length < 4) {
      this.myToast.show('转接号不对')
      return
    }
    if (this.data.buildingNum == '') {
      this.myToast.show('楼号没输')
      return
    }
    let list = this.data.phoneList
    list.unshift({
      phoneNum: this.data.phoneNum,
      transferNum: this.data.transferNum,
      buildingNum: this.data.buildingNum,
    })
    this.setData({
      phoneList: list,
      phoneNum: '',
      transferNum: '',
      buildingNum: '',
      phoneFocus: true,
      buildingFocus: false
    })
  },

  logout: function() {
    wx.clearStorage()
    wx.redirectTo({
      url: '../../index/index',
    })
    // wx.navigateTo({
    //   url: '../myOrder/myOrder',
    // })
  }
})