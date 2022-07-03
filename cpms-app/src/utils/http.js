import http from 'poros/http';
import { Toast } from 'vant';
import globalConfig from '@/config';
import store, { AUTH_GETTERS_TOKEN } from '@/store';
import router from '@/router';

http.defaults.timeout = 60 * 1000 * 5;
http.defaults.baseURL = globalConfig.baseUrl[globalConfig.env];
http.interceptors.request.eject(0);
http.interceptors.request.use(
  (config) => {
    // 登录拦截
    const token = store.getters[AUTH_GETTERS_TOKEN];

    if (token) {
      switch (token.type) {
        case 'TCHAT':
          config.headers.from = 'tchat';
          config.headers.authType = 'tchat';
          config.headers.Authorization = token.value;
          break;
        default:
          config.headers.Authorization = `Bearer ${token.value}`;
          break;
      }
    }

    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

function showMessage(message) {
  Toast.fail({
    message: message || '发生未知错误，请联系管理员',
    forbidClick: true,
  });
}

/** 添加响应拦截器 */
http.interceptors.response.use(
  (res) => {
    const data = res.data || {};

    if (data.code === undefined) {
      if (res.status !== 200) {
        showMessage(res.statusText);
        return Promise.reject(res.statusText);
      }

      return res;
    }

    switch (data.code) {
      case 0:
        return res;
      case 401:
        router.replace('/login');
        showMessage(data.msg);
        return Promise.reject(res.data.msg);
      case 403:
        showMessage('接口未授权，请联系管理员');
        return Promise.reject(data.msg);
      default:
        showMessage(data.msg);
        return Promise.reject(data.msg);
    }
  },
  (err) => {
    showMessage(err.message);
  }
);

export default http;
