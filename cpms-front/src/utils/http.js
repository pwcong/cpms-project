import http from 'poros/http';
import message from 'poros/ui/lib/message';

import WrapText from '@/components/wrap-text';
import { clearLoginInfo, jumpLogin } from '@/utils/login';

function showMessage(msg) {
  message.error(
    (h) =>
      h(WrapText, {
        props: {
          content: msg || '发生未知错误，请联系管理员',
        },
      }),
    5
  );
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
        clearLoginInfo();
        jumpLogin();
        showMessage(data.msg);
        return Promise.reject(data.msg);
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
