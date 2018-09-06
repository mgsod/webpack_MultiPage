/**
 Created by mashuai  2018/6/13 0013 */

var defaultCallback = function(params, data) {
  var str = params.result.split('.');
  var temp = window[params.vm];
  str.forEach(function(item, index) {
    if (index < str.length - 1) {
      temp = temp[item];
    } else {
      temp[item] = data
    }
  });
  params.callback && temp[params.callback]();
};

// 选择身份证正/反面回调函数调用
var chooseIdCard = function(params, data) {
  var str = params.result;
  var temp = window[params.vm];
  temp[str] = data;
  temp.saveDataToCookie();
  temp.handleModalClose();
}

// 上传附件页面触发协议传订单号给前端
var getOrderShareUrl = function(params, data) {
  window['uploadFile'].getOrderShareUrl();
}

var getOrderDetails = function(params, data) {
  window['applicantInfo'].getOrderDetails();
}