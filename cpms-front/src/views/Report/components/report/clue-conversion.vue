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
  name: 'clue-conversion',
  mixins: [reportMixin, reqMixin],
  data() {
    return {
      option: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220],
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
