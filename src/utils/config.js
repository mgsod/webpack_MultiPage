//图片的url
const IMGURL = "http://oss2.yicheku.com.cn";
// 请求前缀路径
const BASEURL_TEST = "http://192.168.2.210";
const BASEURL = "http://192.168.2.200";
const BASEURL_RELEASE = "http://sc.yicheku.com.cn";
// 图标地址
const ICONURL = "http://oss2.yicheku.com.cn/res/ts/";
const version = '/finance_v2_2_2';
// 请求借口
const ENV_URL = {
  'test': BASEURL_TEST,
  'production': BASEURL,
  'development': BASEURL,
  'release': BASEURL_RELEASE,
};
const PORT = ":8060";
export default {
  URL: ENV_URL[process.env.NODE_ENV] + PORT+version,
  IMGURL: IMGURL
}
