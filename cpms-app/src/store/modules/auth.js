import {
  AUTH_GETTERS_TOKEN,
  AUTH_MUTATIONS_SET_TOKEN,
  AUTH_ACTIONS_FETCH_MENUS,
  AUTH_GETTERS_MENUS,
  AUTH_MUTATIONS_SET_MENUS,
} from '../types';

export default {
  state: {
    token: null,
    menus: [],
  },
  getters: {
    [AUTH_GETTERS_TOKEN]: (state) => state.token,
    [AUTH_GETTERS_MENUS]: (state) => state.menus,
  },
  mutations: {
    [AUTH_MUTATIONS_SET_TOKEN]: (state, payload) => {
      state.token = payload;
    },
    [AUTH_MUTATIONS_SET_MENUS]: (state, payload) => {
      state.menus = payload;
    },
  },
  actions: {
    [AUTH_ACTIONS_FETCH_MENUS]: async ({ dispatch, commit, rootState }) => {
      await dispatch('requestMenus');
      const { menus } = rootState.poros || {};
      commit(AUTH_MUTATIONS_SET_MENUS, menus || []);
      // router.addRoutes([
      //   ...flattenRoutes(
      //     createRoutesByMenus(menus),
      //     (route) => (route.children || []).length <= 0
      //   ),
      //   // { path: '*', redirect: '/404' },
      // ]);
    },
  },
};
