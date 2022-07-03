import Vue from 'vue';
import { removeToken, removeSdbgIDMCookie } from 'poros/utils/auth';
import store from '@/store';
import router from '@/router';

// 清空登录信息
export function clearLoginInfo() {
  // 清空 cookie 中 token
  removeToken();

  // SDBG - 清空 IDM cookie
  removeSdbgIDMCookie();

  // 清除 store 数据
  store.commit('updateMenus', null);
  store.commit('updateBtnAuth', null);
  store.commit('updateSysList', null);
  store.commit('setTenantList', []);
  store.commit('setUserInfo', {});

  // 清空 router-tabs 缓存
  Vue.ls.remove('routerTabs');
}

// 跳转登录
export function jumpLogin(next) {
  if (process.env.NODE_ENV === 'development') {
    // 开发环境 - 跳转 本地登录
    if (next) {
      next('/login');
    } else {
      router.push('/login');
    }
  } else {
    // 生产环境 - 跳转 统一认证中心
    // location.href = `/auth/login?fromUrl=${location.href}`
    router.push('/login');
  }
}
