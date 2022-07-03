import Vue from 'vue';
import Vuex from 'vuex';

import user from './modules/user';
import direction from './modules/direction';
import loading from './modules/loading';
import debug from './modules/debug';
import auth from './modules/auth';

export * from './types';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    direction,
    loading,
    debug,
    auth,
  },
});

export default store;
