import '@babel/polyfill';

import Vue from 'vue';

import Poros from 'poros';
import config from './config';
import system from './config/system';
import store from './store';
import router from './router';

import './libs';
import '@/utils/http';
import App from './app';

function init() {
  Vue.use(Poros, {
    system,
    store,
  });

  new Vue({
    el: '#app',
    store,
    router,
    render: (h) => h(App),
  });
}

if (config.env === 'local' || config.buildTarget === 'h5') {
  init();
} else {
  document.addEventListener('deviceready', init, false);
}
