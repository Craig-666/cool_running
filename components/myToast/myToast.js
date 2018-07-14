/*
	微信自带的showToast方法文字太多不支持换行，
	自定义toast
	使用方法：
	在要使用页面 .wxml引入<myToast class='myToast' ></myToast>
	在要使用页面 .json引入
	"usingComponents": {
		"myToast": "../../../components/myToast/myToast" 这里是相对路径
	}
	在要使用页面 .js文件 onLoad方法 声明 this.myToast = this.selectComponent(".myToast");
	在要使用toast的地方 调用 this.myToast.show('要显示的内容')
*/
Component({
  /**
   * 组件的属性列表
   */
  properties: {
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    opacity:0,
    content:"default value"
  },
  ready:function(){
    var systeminfo = wx.getSystemInfoSync();
    var screenWidth = systeminfo.screenWidth;
    //根据屏幕宽度居中显示toast
    this.setData({
      marginleft: (screenWidth-210)/2
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //显示taost
    show:function(content){
			if(this.data.show){
				return
			}
      //创建一个动画
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
      })
      this.animation = animation
      animation.opacity(0.9).step()
      this.setData({
        content: content,
          isHidden:true,
        animationData: animation.export(),
				show: true
      })
      setTimeout(function () {
        animation.opacity(0).step()
        this.setData({
          animationData: animation.export(),
            isHidden:false,
					show: false
        })
      }.bind(this), 2000)
    }
  }
})
