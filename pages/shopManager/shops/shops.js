// pages/shopManager/shops/shops.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNo: 1,
    total: 0,
    shopList: [],
    limit: 100,
    isAdd: true,
    shopInfo: {},
    title: '',
    selIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myToast = this.selectComponent(".myToast")
    this.addShop = this.selectComponent(".addShop")
    this.getList(true)
  },

  getList: function (loading, clear) {
    let that = this
    const query = Bmob.Query("shops");
    query.equalTo("relation_manager_id", "==", util.getUserId())
    query.limit(that.data.limit)
    query.skip(that.data.limit * (that.data.pageNo - 1))
    let dataSource = that.data.shopList
    if (clear) {
      dataSource = []
    }
    Promise.all([query.find(), query.count()]).then(res => {
      let arr = dataSource.concat(res[0])
      that.setData({
        total: res[1],
        shopList: arr
      })
    })
  },
  handleTap: function (e) {
    let id = e.currentTarget.id
    let index = e.currentTarget.dataset.index
    let list = this.data.shopList
    let that = this
    switch (id) {
      case 'add': {
        this.setData({
          title: '添加商家',
          isAdd: true,
          shopInfo: {}
        })
        this.addShop.showModal()
      } break
      case 'edit': {
        this.setData({
          selIndex: index,
          title: '编辑商家',
          isAdd: false,
          shopInfo: this.data.shopList[index]
        })
        this.addShop.showModal()
      } break
    }
  },
  //inputModal确认事件
  _confirmEvent() {
    let that = this
    let list = that.data.shopList
    let index = that.data.selIndex
    let info = this.addShop.data.shopInfo
    if (that.data.isAdd) {
      var query = Bmob.Query('shops');
      query.set('shopName',info.shopName)
      query.set('relation_manager_id', util.getUserId())
      query.save().then(res=>{
        that.myToast.show('添加成功')
        that.getList(true,true)
      })
    } else {
      const query = Bmob.Query('shops');
      query.set('id', info.objectId) //需要修改的objectId
      query.set('shopName', info.shopName)
      query.save().then(res => {
        that.myToast.show('修改成功')
        list[index] = info
        that.setData({
          shopList: list
        })
      }).catch(err => {
        that.myToast.show('修改失败')
      })
    }
    this.addShop.hideModal()
  },
  onReachBottom: function () {
    if (this.data.total == this.data.shopList.length) {
      return
    }
    this.setData({
      pageNo: this.data.pageNo + 1
    })
    this.getList(true, false)
  },
  onPullDownRefresh: function () {
    this.setData({
      pageNo: 1
    })
    this.getList(true, true)
  }
})