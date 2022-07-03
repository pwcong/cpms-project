import { get } from 'poros/http';
import api from '@/api';

import {
  USER_MUTATIONS_SET_USER,
  USER_MUTATIONS_SET_USERINFO,
  USER_GETTERS_USER,
  USER_GETTERS_USERINFO,
  USER_ACTIONS_FETCH_USER,
  AUTH_ACTIONS_FETCH_MENUS,
  AUTH_MUTATIONS_SET_TOKEN,
} from '../types';

export default {
  state: {
    user: null,
    userInfo: {},
  },
  getters: {
    [USER_GETTERS_USER]: (state) => state.user,
    [USER_GETTERS_USERINFO]: (state) => state.userInfo,
  },
  mutations: {
    [USER_MUTATIONS_SET_USER]: (state, payload) => {
      state.user = payload;
    },
    [USER_MUTATIONS_SET_USERINFO]: (state, payload) => {
      state.userInfo = payload;
    },
  },
  actions: {
    [USER_ACTIONS_FETCH_USER]: async ({ commit, dispatch }, payload) => {
      if (payload === false) {
        commit(AUTH_MUTATIONS_SET_TOKEN, null);
        commit(USER_MUTATIONS_SET_USER, null);
        commit(USER_MUTATIONS_SET_USERINFO, {});
      } else {
        const { accessToken, tokenType } = payload;
        commit(AUTH_MUTATIONS_SET_TOKEN, {
          value: accessToken,
          type: tokenType,
        });

        const res = await get('/api/poros-authcenter/user/message');
        if (res.code !== 0) {
          throw new Error(res.msg);
        }

        const data = res.data || {};
        const { uid, name } = data;
        commit(USER_MUTATIONS_SET_USER, {
          uid,
          name,
        });

        const userInfo = await api.common.getUserInfo();
        commit(USER_MUTATIONS_SET_USERINFO, Object.assign({}, data, userInfo));

        await dispatch(AUTH_ACTIONS_FETCH_MENUS);
      }
    },
  },
};
