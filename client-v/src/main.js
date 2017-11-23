// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Bus from '@/plugins/Bus'
import axios from 'axios'

import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.css'

Vue.prototype.$http = axios
Vue.use(Bus)
Vue.config.productionTip = false

// inject header info to ajax request
axios.interceptors.request.use(function (config) {
  if (store.getters.settings) {
    config.headers['Authorization'] = `Bearer ${store.getters.settings.serviceToken}`;
    config.headers['slb-wellId'] = `${store.getters.settings.wellID}`;
  }
  return config;
}, function (err) {
  return Promise.reject(err);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
