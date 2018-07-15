// pages/admin/abnormal/abnormal.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: util.getToday(),
    total: 0,
    dataSource: [],
    limit: 100,
    pageNo: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList(true)
		this.myToast = this.selectComponent(".myToast")
  },

	getwaitCount:function(){

	},

  getList: function(loading) {
    if (loading) {
      wx.showLoading({
        title: '加载中..',
      })
    }
    let that = this
    const query = Bmob.Query("order");
    query.equalTo("createdAt", ">", that.data.startDate)
    query.equalTo('order_status', "==", 3)
    query.equalTo('boss_id', '==', util.getUserId())
    query.limit(1000)

		const qq = Bmob.Query("order");
		qq.equalTo("createdAt", ">", that.data.startDate)
		qq.equalTo('order_status', "==", 3)
		qq.equalTo('boss_id', '==', util.getUserId())
		qq.equalTo('handled','!=',true)


		Promise.all([query.find(), query.count(), qq.count()]).then(res => {
      that.setData({
        dataSource: res[0],
        total:res[1],
				waitCount:res[2]
      })
      wx.hideLoading()
    }).catch(()=>{
      wx.hideLoading()
    })
  },
  handleTap:function(e){
		let target = e.currentTarget
		let phone = target.dataset.phone
		switch (target.id){
			case 'call':{
				wx.makePhoneCall({
					phoneNumber: phone,
				})
			}break
			case 'handle':{
				let that = this
				let list = this.data.dataSource
				let index = target.dataset.index
				const query = Bmob.Query('order');
				query.set('id', list[index].objectId)
				query.set('handled', true)
				query.save().then(res => {
					that.myToast.show('操作成功')
					list[index].handled = true
					that.setData({
						dataSource:list
					})
					that.getList(true)
				}).catch(err => {
					that.myToast.show('操作失败')
				})
			}break
		}
    
  },
})