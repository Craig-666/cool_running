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

const curMonth = () => {
	let date = new Date()
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	return [year, month, '01'].map(formatNumber).join('-') + ' ' + ['00', '00', '00'].map(formatNumber).join(':')
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

const timeDifc=(start, end)=>{
  let starts = new Date(start)
  let ends = new Date(end) 
  let message = '';

  if (ends.getFullYear() > starts.getFullYear() && ends.getMonth() >= starts.getMonth())
    message += ends.getFullYear() - starts.getFullYear() + "年";

  if (ends.getMonth() > starts.getMonth() && ends.getDate() >= starts.getDate())
    message += ends.getMonth() - starts.getMonth() + "个月";

  if (ends.getDate() > starts.getDate() && ends.getHours() >= starts.getHours())
    message += ends.getDate() - starts.getDate() + "天";

  if (ends.getHours() > starts.getHours() && ends.getMinutes() >= starts.getMinutes())
    message += ends.getHours() - starts.getHours() + "小时";

  if (ends.getMinutes() > starts.getMinutes())
    message += ends.getMinutes() - starts.getMinutes() + "分钟";

  if (ends.getSeconds() > starts.getSeconds())
    message += ends.getSeconds() - starts.getSeconds() + "秒";

  return message =='' ? '未知' :message
}


module.exports = {
  formatTime: formatTime,
  getUserInfo: getUserInfo,
  getToday:today,
  getUserId: getUserId,
  checkPhoneNum: checkPhoneNum,
  getUserPhone:getUserPhone,
  getUserName: getUserName,
  groupby:groupby,
  getBossId:getBossId,
  shortToday: shortToday,
  getBeforeDays: getBeforeDays,
	getCurMonth: curMonth,
  timeDiff: timeDifc
}