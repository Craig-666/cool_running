// components/inputModal/inputModal.js
let util = require('../../utils/util.js')
Component({
  /**
   * 组件的属性列表
   */
	properties: {
		// 弹窗标题
		title: {            // 属性名
			type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
			value: '标题'     // 属性初始值（可选），如果未指定则会根据类型选择一个
		},
		// 弹窗取消按钮文字
		cancelText: {
			type: String,
			value: '取消'
		},
		// 弹窗确认按钮文字
		confirmText: {
			type: String,
			value: '确定'
		},
		// 点击mask出发取消事件
		tapClose:{
			type :Boolean,
			value:false
		},
    orderItem:{
      type:Object,
      value:{}
    }
	},

  /**
   * 组件的初始数据
   */
	data: {
		isShow: false,
	},

  /**
   * 组件的方法列表
   */
	methods: {
		/*
				 * 公有方法
				 */

		//隐藏弹框
		hideModal() {
			this.setData({
				isShow: !this.data.isShow,
				inputValue:''
			})
		},
		//展示弹框
		showModal() {
			this.setData({
				isShow: !this.data.isShow
			})
		},
		_handleInput(e){
      let orderItem = this.data.orderItem
      orderItem[e.currentTarget.id] = e.detail.value
			this.setData({
        orderItem
			})
		},
		/*
		* 内部私有方法建议以下划线开头
		* triggerEvent 用于触发事件
		*/
		_cancelEvent() {
			//触发取消回调
      
      this.triggerEvent("cancelEvent") || this.hideModal()
		},
		_confirmEvent() {
      this.myToast = this.selectComponent(".myToast");
      
      let orderItem = this.data.orderItem
      if(!util.checkPhoneNum(orderItem.phoneNum)){
        this.myToast.show('手机号不对')
        return
      }

      if (orderItem.transferNum.length < 4) {
        this.myToast.show('转接号不对')
        return
      }
      if (orderItem.buildingNum == '') {
        this.myToast.show('楼号没输')
        return
      }
			//触发成功回调
			this.triggerEvent("confirmEvent");
		}
	}
})
