import { api } from 'poros/utils';
import router from '@/router';
import cpmsApi from '@/api';
import { clearLoginInfo, jumpLogin } from '@/utils/login';

const { getUserInfo, login, logout } = api;

export default {
  state: {
    userInfo: {},
    uid: '',
    name: '',
    avatar: '',
  },
  mutations: {
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    setUserId(state, uid) {
      state.uid = uid;
    },
    setUserName(state, name) {
      state.name = name;
    },
    setUserAvatar(state, avatar) {
      state.avatar = avatar;
    },
  },
  actions: {
    async requireUserInfo({ commit }) {
      const res = await getUserInfo();

      if (res.code === 0) {
        const userInfo = await cpmsApi.common.getUserInfo();

        commit('setUserInfo', Object.assign({}, res.data, userInfo));
        commit('setUserId', res.data.uid);
        commit('setUserName', res.data.name);
        commit('setUserAvatar', res.data.headUrl);
      } else {
        throw new Error(res.msg);
      }
    },
    login({}, query) {
      let { username, password } = query;
      username = username.trim();
      password = password.trim();
      return login({ username, password }).then((res) => {
        if (res.code === 0) {
          router.push('/').catch(() => {});
        }
        return res;
      });
    },
    logout() {
      // 脱出登录 请求，后端用于清空相关缓存
      logout();
      // 清空前端登录缓存信息
      clearLoginInfo();
      // 跳转登录页
      jumpLogin();
    },
  },
};
