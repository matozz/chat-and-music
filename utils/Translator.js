export const formatDate = (date, fmt) => {
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};

export const formatDuration = (millisecond) => {
  let endTime = Math.ceil(millisecond / 1000);

  let secondTime = parseInt(endTime); //将传入的秒的值转化为Number
  let min = 0; // 初始化分
  let h = 0; // 初始化小时
  let result = "";
  if (secondTime > 60) {
    //如果秒数大于60，将秒数转换成整数
    min = parseInt(secondTime / 60); //获取分钟，除以60取整数，得到整数分钟
    secondTime = parseInt(secondTime % 60); //获取秒数，秒数取佘，得到整数秒数
    if (min > 60) {
      //如果分钟大于60，将分钟转换成小时
      h = parseInt(min / 60); //获取小时，获取分钟除以60，得到整数小时
      min = parseInt(min % 60); //获取小时后取佘的分，获取分钟除以60取佘的分
    }
  }
  result = `${h.toString().padStart(2, "0")}:${min
    .toString()
    .padStart(2, "0")}:${secondTime.toString().padStart(2, "0")}`;
  return result;
};
