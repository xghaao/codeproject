import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Axios from 'axios';
import Vuex from 'vuex';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(ElementUI);
Vue.use(Vuex);

Axios.defaults.baseURL = 'http://localhost:8080';

// 请求拦截器
Axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Sending request with token:', token); // 调试
  } else {
    console.warn('No token found in localStorage for request:', config.url);
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
Axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error('401 Unauthorized:', error.response.data); // 调试
      Vue.prototype.$message.error('认证失败，请重新登录');
      store.dispatch('logout');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

Vue.prototype.$http = Axios;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');