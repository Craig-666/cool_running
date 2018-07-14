const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const today=()=>{
  let date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-') + ' ' + ['00', '00', '00'].map(formatNumber).join(':')
}

const shortToday = () => {
  let date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-') 
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getUserInfo = () => {
  let userInfo = JSON.parse(wx.getStorageSync('bmob'))
  return userInfo
}

const getUserId = () => {
  let userInfo = JSON.parse(wx.getStorageSync('bmob'))
  return userInfo.objectId
}

const getBossId = () => {
  let userInfo = JSON.parse(wx.getStorageSync('bmob'))
  return userInfo.boss_id
}

const getUserPhone = () => {
  let userInfo = JSON.parse(wx.getStorageSync('bmob'))
  return userInfo.username
}
const getUserName = () => {
  let userInfo = JSON.parse(wx.getStorageSync('bmob'))
  console.log(userInfo.name)
  return userInfo.name
}

const groupby = (array, bykey,otkey) => {
  let groups = {};
  array.forEach((o) => {
    let key = o[bykey];
    groups[key] = groups[key] || [];
    if(otkey){
      groups[key].push({ a: o[bykey], b: o[otkey]});
    }else{
      groups[key].push(o[bykey]);
    }
    
  });
  let list = []
  Object.keys(groups).map(group=>{
    if (groups[group].length > 0){
      if(otkey){
        list.push({ key: groups[group][0].a, count: groups[group].length, otkey: groups[group][0].b})
      }else{
        list.push({ key: group, count: groups[group].length })
      }
    }
  })
  return list
}

const getBeforeDays=(num)=>{
  let days = num || 7
  let curTimeStamp = new Date().getTime()
  let beforeTimeStamp = curTimeStamp - days * 24 * 60 * 60 * 1000
  let beforeDate = new Date(beforeTimeStamp)
  let year = beforeDate.getFullYear()
  let month = beforeDate.getMonth() + 1
  let day = beforeDate.getDate()
  return [year, month, day].map(formatNumber).join('-') + ' ' + ['00', '00', '00'].map(formatNumber).join(':')
}
//手机号验证
const checkPhoneNum = (phoneNum) => {
  if (!(/^1\d{10}$/.test(phoneNum))) {
    return false;
  } else {
    return true;
  }
}

const makeVoice = (text)=>{
  if(text.length>0){
    let end = text.substr(text.length - 1, 1)
    switch (end){
      case '0':{
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = '/resource//voices/0.wav'
        innerAudioContext.play()
      }break
      case '1': {
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = '/resource//voices/1.wav'
        innerAudioContext.play()
      } break
      case '2': {
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = '/resource//voices/2.wav'
        innerAudioContext.play()
      } break
      case '3': {
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = '/resource//voices/3.wav'
        innerAudioContext.play()
      } break
      case '4': {
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = '/resource//voices/4.wav'
        innerAudioContext.play()
      } break
      case '5': {
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = '/resource//voices/5.wav'
        innerAudioContext.play()
      } break
      case '6': {
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = '/resource//voices/6.wav'
        innerAudioContext.play()
      } break
      case '7': {
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = '/resource//voices/7.wav'
        innerAudioContext.play()
      } break
      case '8': {
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = '/resource//voices/8.wav'
        innerAudioContext.play()
      } break
      case '9': {
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.src = '/resource//voices/9.wav'
        innerAudioContext.play()
      } break
    }
  }
}

module.exports = {
  formatTime: formatTime,
  getUserInfo: getUserInfo,
  getToday:today,
  getUserId: getUserId,
  checkPhoneNum: checkPhoneNum,
  getUserPhone:getUserPhone,
  getUserName: getUserName,
  makeVoice:makeVoice,
  groupby:groupby,
  getBossId:getBossId,
  shortToday: shortToday,
  getBeforeDays: getBeforeDays
}