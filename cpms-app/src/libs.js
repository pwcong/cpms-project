import Vue from 'vue';

// import FastClick from 'fastclick';
import Vant from 'vant';
import { Toast, Dialog } from 'vant';
import axios from 'axios';

import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, BarChart, PieChart, ScatterChart, RadarChart, GaugeChart } from 'echarts/charts';
import { GridComponent, TitleComponent, TooltipComponent, LegendComponent, ToolboxComponent } from 'echarts/components';

import config from '@/config';
import Debug from '@/common/lib/debug';
// import Flexible from '@/common/lib/flexible';
import native from '@/common/lib/native';
import lib from '@/common/lib';
import Components from '@/components';
import CustomComponents from '@/views/components';

import 'minireset.css';
import 'vant/lib/index.less';
import '@/assets/scss/vant.scss';

import VueEasytable from 'vue-easytable';
import 'vue-easytable/libs/theme-default/index.css';

import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';

Vue.use(VueAwesomeSwiper);
Vue.use(VueEasytable);

// 全局挂载函数对象
Vue.prototype.$toast = Toast;
Vue.prototype.$dialog = Dialog;
Vue.prototype.$nativeApi = native;
Vue.prototype.$axios = axios;
Vue.prototype.$config = config;
Vue.prototype.$tools = Object.keys(lib).reduce((p, c) => Object.assign(p, lib[c]), {});

// Vue.use(Flexible);
Vue.use(Vant);
Vue.use(Components);
Vue.use(CustomComponents);

// 安装echart组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  ToolboxComponent,
]);
Vue.component('v-chart', VChart);

// FastClick.attach(document.body);

if (['sit', 'uat'].indexOf(config.env) > -1) {
  Debug.install({
    immediate: true,
  });
}

// 接入监控系统
if (config.env === 'prod') {
  import('fundebug-javascript').then((fundebug) => {
    fundebug.init({
      apikey: config.fundebugKey,
      filters: [
        {
          type: /^unhandledrejection$/,
        },
      ],
      silentWebsocket: true,
    });
  });
}
