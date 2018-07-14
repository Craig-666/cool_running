//index.js
var Bmob = require('../../dist/Bmob-1.6.1.min.js');
let util = require('../../utils/util.js')
const app = getApp()

Page({
  data: {
    
  },
  onLoad: function () {
    if (wx.getStorageSync('bmob')){
      let userInfo = util.getUserInfo()
      if(userInfo.isAdmin){
        wx.redirectTo({
          // url: '../admin/options/options',
          url: '../admin/index/index',
        })
      } else {
        wx.redirectTo({
          url: '../employee/index/index',
        })
      }
      return
    }
    this.myToast = this.selectComponent(".myToast")
  },
  login:function(e){
    let value = e.detail.value
    
    if (!util.checkPhoneNum(value.phone)) {
      this.myToast.show('手机号不对')
      return
    }
    if (value.psw == '') {
      this.myToast.show('输入密码')
      return
    }
    Bmob.User.login(value.phone, value.psw).then(res => {
      if(res.isAdmin){
        wx.redirectTo({
          url: '../admin/index/index',
          // url: '../admin/options/options',
        })
      }else{
        wx.redirectTo({
          url: '../employee/index/index',
        })
      }
    }).catch(err => {
      this.myToast.show('账号密码不匹配')
    });
  }
  
})
