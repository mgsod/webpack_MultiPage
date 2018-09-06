/**
 Created by mashuai  2018/4/19 0019
 */

/**
 * 对象转get类型传参 例如{a:1,b:2} ==> ?a=1&b=2
 * @param json 传入对象
 * @returns {string}
 */
export function objToGetParams(json) {
  let str = '?';
  for (let key in json) {
    str += key + '=' + json[key] + '&'
  }
  return str.substring(0, str.length - 1)
}

/**
 * 计算两个时间差 要求传入时间戳 start和end不规定顺序,大小
 * @param start 开始时间
 * @param end  结束时间
 * @param type 默认计算相差日,传入year计算年.(年份计算 向上取整.365为一年,超过365+1年)
 * @returns {number} 返回差值
 */
export function timeTnterval(start, end, type = 'day') {
  let day = Math.abs(end - start) / (1000 * 60 * 60 * 24);
  if (type === 'year') {
    return Math.ceil(day / 365)
  }
  return day;
}

/**
 * 判断数组中是否有重复值
 * @param arr 判断数组
 * @param key 如果是数组项是对象,传入指定key进行判断
 * @returns {boolean} 返回是否重复
 */
export function isRepeat(arr, key) {
  let hash = {};
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];
    if (hash[key ? item[key] : item]) return true;
    hash[key ? item[key] : item] = true
  }
  return false;
}

/**
 * 调用app协议的函数
 * @param module 模块
 * @param service 服务
 * @param action 动作，例如调用拍照
 * @param callback 调用结束后的回调函数
 * @param params 前端需要的执行上下文参数 例如vue对象
 * @param datas app返回的数据
 */
export function callProtocol({module = 'finance', service = 'order', action, callback, params, datas}) {
  let a = document.createElement('a');
  a.setAttribute('href', `ckapi://yicheku.com.cn/${module}/${service}?action=${action}&callback=${callback || ''}&params=${params || ''}&datas=${datas || ''}`);
  a.click()
}

/**
 * 获取地址栏get参数
 * @param name 参数名
 */
export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1)
    .match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

export function isBack(flag) {
  callProtocol({
    action: "is_back",
    datas: `{"is_back_value": ${flag ? 1 : 0}}`
  })
}

/**
 * 设置光标位置
 * @param ctrl dom对象
 * @param pos 位置
 */
export function setCaretPosition(ctrl, pos) {
  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  }
  else if (ctrl.createTextRange) {
    var range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}

/**
 * 获取光标位置
 * @param textDom dom对象
 * @returns {number} 位置
 */
export function getCursortPosition(textDom) {
  var cursorPos = 0;
  if (document.selection) {
    // IE Support
    textDom.focus();
    var selectRange = document.selection.createRange();
    selectRange.moveStart('character', -textDom.value.length);
    cursorPos = selectRange.text.length;
  } else if (textDom.selectionStart || textDom.selectionStart == '0') {
    // Firefox support
    cursorPos = textDom.selectionStart;
  }
  return cursorPos;
}
