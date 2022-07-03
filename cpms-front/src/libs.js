import Vue from 'vue';
import Poros from 'poros';
import PorosUI from 'poros/ui';

import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RadarChart,
  GaugeChart,
} from 'echarts/charts';
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
} from 'echarts/components';

import Components from '@/components';
import CustomComponents from '@/views/components';
import SvgIcon from '@/components/svg-icon';

import store from './store';
import config from './config';
import system from './config/system';

import 'poros/ui/style';
import './utils/http';

import './styles/common.less';

import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/swiper-bundle.css';

Vue.config.productionTip = false;
// 开发环境 允许使用Vue开发者工具
if (process.env.NODE_ENV === 'development') {
  Vue.config.devtools = true;
}

// 安装图表组件
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

// 全局安装组件
Vue.use(Poros, {
  system,
  store,
});
Vue.use(PorosUI);
Vue.use(Components);
Vue.use(CustomComponents);
Vue.use(SvgIcon);

Vue.use(VueAwesomeSwiper);

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
