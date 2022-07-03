import Vue from 'vue';
import VConsole from 'vconsole';

import { buildLazyExector } from '@/utils';
import router from '@/router';
import Debug from './index.vue';

const exector = buildLazyExector();
let vcInited = false;

export default {
  install(options) {
    const { immediate, debug } = options || {};

    const fn = () => {
      if (!vcInited) {
        new VConsole();
        vcInited = true;
      } else if (debug) {
        const container = document.getElementById('debug');
        container.innerHTML = '';

        const el = document.createElement('div');
        container.appendChild(el);

        new Vue({
          el,
          render: (h) =>
            h(Debug, {
              props: {
                visible: true,
                value: [{ key: 'logout', name: '退出登录' }],
                onSelect(item) {
                  switch (item.key) {
                    case 'logout':
                      router.push({
                        path: '/login',
                      });
                      break;
                    default:
                      break;
                  }
                },
              },
            }),
        });
      }
    };

    if (immediate) {
      fn();
    } else {
      exector(fn);
    }
  },
};
