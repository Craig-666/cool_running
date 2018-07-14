// components/abnormalModal/abnromalModal.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 弹窗标题
    title: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '异常原因'     // 属性初始值（可选），如果未指定则会根据类型选择一个
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
    tapClose: {
      type: Boolean,
      value: false
    },
    abList: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    selIndex:1000000,
    abReason:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideModal() {
      this.setData({
        isShow: !this.data.isShow,
        abReason: ''
      })
    },
    //展示弹框
    showModal() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    _choose:function(e){
      let dataset = e.currentTarget.dataset
      if(dataset.index == this.data.selIndex){
        this.setData({
          selIndex: 1000000
        })
      }else{
        this.setData({
          selIndex: dataset.index
        })
      }
    },
    _reason(e) {
      this.setData({
        abReason:e.detail.value
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
      if(this.data.selIndex == 1000000 && this.data.abReason == ''){
        this.myToast.show('选择或输入原因')
        return
      }
      //触发成功回调
      this.triggerEvent("confirmEvent");
    }
  }
})
