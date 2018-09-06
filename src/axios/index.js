/**
 Created by mashuai  2018/3/27 0027
 */
import Vue from 'vue'
import axios from 'cheku-axios'
import qs from 'qs'
import basic from '@/utils/config'
import Cookies from 'js-cookie'
// import CkDialog from "@/components/ckDialog-plugin";
import { callProtocol } from '@/utils'

// Vue.use(CkDialog);
// window.addEventListener('offline', _ => {
// Vue.$dialog.showMsg({
//   isShow: true,
//   content: "请检查您的网络连接."
// })
// })
axios.defaults.baseURL = basic.URL;
axios.interceptors.request.use(config => {
  // if (!window.navigator.onLine) {
  //   Vue.$dialog.showMsg({
  //     isShow: true,
  //     content: "请检查您的网络连接.",
  //     onHide() {
  //       return Promise.reject();
  //     }
  //   })
  // }
  if (config.method === 'post' && config.headers['Content-Type'] !== 'application/json') {
    config.data = qs.stringify(config.data);
  }
  const customParams = {
    device: 1,
    out: 'json',
    access_token: Cookies.get('token')
  };
  config.params = config.params || {};
  config.params = Object.assign(config.params, customParams); //当config.params为{}时,无法合并到config.params. 保险起见这里需要进行一次赋值操作
  config.withCredentials = true; //允许携带用户信息.例如cookie
  return config;
}, err => {
  return Promise.reject(err);
});

axios.interceptors.response.use(response => {
  const status = response.data.status;
  if (status === 1001) {
    setTimeout(_ => {
      // 未登录
      // Vue.$dialog.showMsg({
      //   isShow: true,
      //   content: response.data.msg,
      //   onHide: function() {
      //     //调转到登录页面
      //     callProtocol({
      //       action: 'toLogin'
      //     });
      //   }
      // });
    }, 0)
  } else if (status !== 1) {
    setTimeout(_ => {
      // 接口异常
      // Vue.$dialog.showMsg({
      //   isShow: true,
      //   content: response.data.msg
      // });
    }, 0)
  }
  return response.data

}, error => {
  if (error.response) {
    // 网络异常
    // Vue.$dialog.showMsg({
    //   isShow: true,
    //   content: '网络异常.'
    // });
  }
  return Promise.reject(error.response)
});
export default axios
