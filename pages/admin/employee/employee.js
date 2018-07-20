// pages/admin/employee/employee.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
		pageNo: 1,
		total: 0,
		employeeList: [],
		limit: 100,
		isAdd:true,
		employeeInfo:{},
		title:'',
		selIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		this.myToast = this.selectComponent(".myToast")
		this.addModal = this.selectComponent(".addEmployee")
		this.getList(true)
  },
	getList:function(loading,clear){
		let that = this
		const query = Bmob.Query("_User");
		query.equalTo("boss_id", "==", util.getUserId())
		query.limit(that.data.limit)
		query.skip(that.data.limit * (that.data.pageNo - 1))
		let dataSource = that.data.employeeList
		if (clear) {
			dataSource = []
		}
		Promise.all([query.find(), query.count()]).then(res => {
			let arr = dataSource.concat(res[0])
			that.setData({
				total: res[1],
				employeeList: arr
			})
		})
	},
	handleTap:function(e){
		let id = e.currentTarget.id
		let index = e.currentTarget.dataset.index
		let list = this.data.employeeList
		let that = this
		switch(id){
			case 'add':{
				this.setData({
					title:'添加员工',
					isAdd:true,
					employeeInfo:{}
				})
				this.addModal.showModal()
			}break
			case 'delete':{
				wx.showModal({
					title: '提示',
					content: '确定要删除该员工吗？',
					success:function(e){
						if(e.confirm){
							const query = Bmob.Query('_User');
							query.destroy(list[index].objectId).then(res => {
								list.splice(index,1)
								that.setData({
									employeeList:list
								})
								that.myToast.show('删除成功')
							}).catch(err => {
								cthat.myToast.show('删除失败')
							})
						}
					}
				})
			}break
			case 'edit':{
				this.setData({
					selIndex:index,
					title: '编辑员工',
					isAdd: false,
					employeeInfo: this.data.employeeList[index]
				})
				this.addModal.showModal()
			}break
		}
	}, 
	//inputModal确认事件
	_confirmEvent() {
		let that = this
		let list = that.data.employeeList
		let index = that.data.selIndex
		let info = this.addModal.data.employeeInfo
		if(that.data.isAdd){
			var query = Bmob.Query('_User');
			query.equalTo('username', "==", info.username);
			query.find().then(res => {
				if (res.length > 0) {
					that.myToast.show('已添加过该员工')
					return
				} else {
					let params = {
						username: info.username,
						password: info.username.slice(5),
						name: info.name,
						boss_id: util.getUserId()
					}
					Bmob.User.register(params).then(res => {
						that.myToast.show('添加成功')
						that.getList(true,true)
					}).catch(err => {
						that.myToast.show('添加失败')
					});
				}
			});
		}else{
			var query = Bmob.Query('_User');
			query.equalTo('username', "==", info.username);
			query.find().then(res => {
				if(res.length>0){
					that.myToast.show('手机号不能重复')
				}else{
					const query = Bmob.Query('_User');
					query.set('id', info.objectId)
					query.set('username', info.username)
					query.set('name', info.name)
					query.save().then(res => {
						that.myToast.show('修改成功')
						list[index] = info
						that.setData({
							employeeList: list
						})
					}).catch(err => {
						that.myToast.show('修改失败')
					})
				}
			})
				
		}
		this.addModal.hideModal()
	},
	onReachBottom: function () {
		if (this.data.total == this.data.employeeList.length) {
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