// import {Message} from 'element-ui';
import Base64, { b64_hmac_sha1 } from '../utils/base64'
import {
  callProtocol
} from "@/utils";
// JavaScript Document
let imgUrl = "http://oss2.yicheku.com.cn/";

//XmlHttpRequest对象
function createXmlHttpRequest() {
  if (window.ActiveXObject) { //如果是IE浏览器
    return new ActiveXObject("Microsoft.XMLHTTP");
  } else if (window.XMLHttpRequest) { //非IE浏览器
    return new XMLHttpRequest();
  }
}

let POLICY_JSON = {
  "expiration": "2020-12-01T12:00:00.000Z",
  "conditions": [
    ["starts-with", "$key", ""],
    { "bucket": 'cheku-bucket' },
    ["starts-with", "$Content-Type", ""],
    ["content-length-range", 0, 524288000]
  ]
};
let secret = 'O8tGkDmmazqH4fe5c7Aw4OFTcuxMXl';
let policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));
let signature = b64_hmac_sha1(secret, policyBase64);


function uploadFile(e, before, successCallback, error) {
  let targetElement = e.target;
  let file = targetElement.files[0];
  let file_type = file.type;
  targetElement.value = '';

  if (file_type != 'image/png' && file_type != 'image/jpeg') {
    callProtocol({
      action: "show_toast",
      datas: `{"message":"文件格式不支持!"}`
    })
    return false;
  }

  let month = (new Date())
    .getMonth() + 1;
  if (month < 10) {
    month = '0' + month
  }
  let day = (new Date())
    .getDate()
  if (day < 10) {
    day = '0' + day
  }
  let lwn = '/' + (new Date())
    .getFullYear() + month + day + '/'
  let key = 'test' + lwn + (new Date())
    .getTime() + '.' + file.type.slice(file.type.indexOf('/') + 1);

  let fd = new FormData();
  fd.append('key', key);
  fd.append('Content-Type', 'application/octet-stream');
  fd.append(`Content-Disposition`, `attachment; filename=${file.name}.jpg`);
  fd.append('OSSAccessKeyId', 'LTAIOFzbZKPIyDyP');
  fd.append('policy', policyBase64);
  fd.append('signature', signature);
  fd.append("file", file);
  let xhr = createXmlHttpRequest();

  xhr.addEventListener("error", _ => {
    Vue.$vux.loading.hide();
    error && error();
  }, false);

  xhr.onreadystatechange = function() { //服务器返回值的处理函数，此处使用匿名函数进行实现
    if (xhr.readyState === 4) {
      Vue.$vux.loading.hide();
      if (xhr.status != 0)
        successCallback && successCallback('/' + key);
    }
  };
  Vue.$vux.loading.show({
    text: '上传中...'
  })
  before && before();
  xhr.open('POST', 'http://cheku-bucket.oss-cn-shenzhen.aliyuncs.com', true); //MUST BE LAST LINE BEFORE YOU SEND
  xhr.send(fd);
}


export default uploadFile
