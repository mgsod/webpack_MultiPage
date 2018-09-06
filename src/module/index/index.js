import Vue from 'vue';
import App from './App.vue';
import { Dialog } from 'vant';

Vue.use(Dialog);
new Vue({
  el: '#app',
  render: h => h(App)
});
