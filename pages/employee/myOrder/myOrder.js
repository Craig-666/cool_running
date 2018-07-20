// pages/employee/myOrder/myOrder.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
		curIndex:'0',
		limit: 100,
		pageNo: 1,
		total: 0,
		list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.getList(true,false)
  },
	handleTap:function(e){
		let target = e.currentTarget
		let id = target.id
		this.setData({
			curIndex:id,
			pageNo:1
		},()=>{
			this.getList(true,true)
		})
	},
	getList:function(loading,clear){
		if (loading) {
			wx.showLoading({
				title: '加载中..',
			})
		}
		let that = this
		const query = Bmob.Query("order");
		query.equalTo("createdAt", ">", that.data.curIndex == '0' ? util.getToday() : util.getCurMonth())
		query.equalTo("create_phone", "==", util.getUserPhone())
		query.limit(that.data.limit)
		query.order('-createdAt')
		query.skip(that.data.limit * (that.data.pageNo - 1))
		let list = that.data.list
		if (clear) {
			list = []
		}
		Promise.all([query.find(), query.count()]).then(res => {
			let arr = list.concat(res[0])
			that.setData({
				total: res[1],
				list: arr
			})
			wx.hideLoading()
			wx.stopPullDownRefresh()
		}).catch(e => {
			wx.hideLoading()
			wx.stopPullDownRefresh()
		})
	},
	onReachBottom: function () {
		if (this.data.total == this.data.list.length) {
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