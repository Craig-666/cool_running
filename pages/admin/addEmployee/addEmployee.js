// pages/admin/addEmployee/addEmployee.js
var Bmob = require('../../../dist/Bmob-1.6.1.min.js');
let util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.myToast = this.selectComponent(".myToast")
  },
  
  add:function(e){
    let value = e.detail.value
  
    if (!util.checkPhoneNum(value.phone)) {
      this.myToast.show('手机号不对')
      return
    }
    if (value.phone.name == '') {
      this.myToast.show('输入名字')
      return
    }
    var query = Bmob.Query('_User');
    query.equalTo('username', "==", value.phone);
    query.find().then(res=>{
      if(res.length>0){
        this.myToast.show('已添加过该员工')
        return
      }else{
        let params = {
          username: value.phone,
          password: value.phone.slice(5),
          name:value.name,
          boss_id:util.getUserId()
        }
        Bmob.User.register(params).then(res => {
          this.myToast.show('添加成功')
        }).catch(err => {
          this.myToast.show('添加失败')
        });
      }
    });
  },
})