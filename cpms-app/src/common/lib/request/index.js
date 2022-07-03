import axios from 'axios';
import { Toast } from 'vant';

import globalConfig from '@/config';

const { env, apiMeta } = globalConfig;

const axiosConfig = {};
if (env === 'local') {
} else {
  axiosConfig.timeout = 60000;
}

const instance = axios.create(axiosConfig);

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    const { options = {} } = config;

    !options.quiet &&
      (config.loadingTimer = setTimeout(
        () =>
          Toast.loading({
            message: '请求中',
            duration: 0,
            forbidClick: true,
          }),
        2000
      ));

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    Toast.clear();
    clearTimeout(response.config.loadingTimer);

    const { config = {}, data = {} } = response;

    const { intercept = true, meta = {} } = config.options || {};

    const { successKey, successValue, errorKey } = meta;

    if (intercept) {
      if (data[successKey] !== successValue) {
        const message = data[errorKey] || '请求失败';
        Toast.fail({
          message,
          forbidClick: true,
        });
        const error = new Error(message);
        error.response = response;
        error.data = data;
        error.config = config;
        throw error;
      }
    }

    return response;
  },
  function (error) {
    clearTimeout(error.config.loadingTimer);

    let message = '';

    if (error.code === 'ECONNABORTED') {
      message = '请求超时';
    } else {
      message = error.message;
    }

    Toast.fail({
      message,
      forbidClick: true,
    });

    return Promise.reject(error);
  }
);

export default {
  request: instance.request,
};
