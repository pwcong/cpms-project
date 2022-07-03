import { DEBUG_GETTERS_DEBUG, DEBUG_MUTATIONS_SET_DEBUG } from '../types';

export default {
  state: {
    active: false,
  },
  getters: {
    [DEBUG_GETTERS_DEBUG]: (state) => state.active,
  },
  mutations: {
    [DEBUG_MUTATIONS_SET_DEBUG]: (state, payload) => {
      state.active = payload;
    },
  },
};
