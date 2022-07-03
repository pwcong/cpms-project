import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 语言 zh_CN: 中文 en_US: 英文
    language: 'zh_CN',
  },
  getters: {
    language(state) {
      return state.language;
    },
  },
  mutations: {
    setLanguage(state, data) {
      state.language = data;
    },
  },
  actions: {
    // 切换语言，当前仅 支持 中英文切换
    switchLanguage(store) {
      const language = store.state.language === 'zh_CN' ? 'en_US' : 'zh_CN';

      store.commit('setLanguage', language);

      localStorage.setItem('language', language);
    },
    getLanguageCache(store) {
      const language = localStorage.getItem('language');

      if (language) {
        store.commit('setLanguage', language);
      }
    },
  },
  modules: {
    user,
  },
});
