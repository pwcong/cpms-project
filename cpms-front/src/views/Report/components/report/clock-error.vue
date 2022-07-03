<template>
  <v-chart class="chart" :option="option" />
</template>

<script>
import reportMixin from '../../mixins/report';
import { buildListMixin } from '@/mixins';

const reqMixin = buildListMixin({
  relation: ['reportQuery'],
  getData: (_, query) => {
    return Promise.resolve({
      data: [],
    });
  },
});

export default {
  name: 'clock-error',
  mixins: [reportMixin, reqMixin],
  data() {
    return {
      elId: '',
      Myquery: {},
      option: {
        series: [
          {
            type: 'gauge',
            progress: {
              show: true,
              width: 18,
            },
            axisLine: {
              lineStyle: {
                width: 18,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 2,
                color: '#999',
              },
            },
            axisLabel: {
              distance: 25,
              color: '#999',
              fontSize: 20,
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 25,
              itemStyle: {
                borderWidth: 10,
              },
            },
            detail: {
              valueAnimation: true,
              fontSize: 80,
              offsetCenter: [0, '70%'],
            },
            data: [
              {
                value: 60,
              },
            ],
          },
        ],
      },
    };
  },
};
</script>
<style scoped>
.chart {
  height: 400px;
}
</style>
