<template>
  <list-layout>
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="团队汇总报表" left-text="返回" left-arrow @click-left="handleCancel" />
    </template>
    <template v-slot:main="{ className }">
      <div style="top: 46px; height: calc(100% - 46px)" :class="className">
        <v-chart class="chart" :option="option1" />
        <v-chart class="chart" :option="option2" />
        <v-chart class="chart" :option="option3" />
        <v-chart class="chart" :option="option4" />
        <v-chart class="chart" :option="option5" />
      </div>
    </template>
  </list-layout>
</template>

<script>
import { formatMixin } from '@/mixins';

export default {
  mixins: [formatMixin],
  data() {
    return {
      option1: {
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            areaStyle: {},
          },
        ],
      },
      option2: {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [120, 200, 150, 80, 70, 110, 130],
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)',
            },
          },
        ],
      },
      option3: {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '5%',
          left: 'center',
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' },
              { value: 580, name: '邮件营销' },
              { value: 484, name: '联盟广告' },
              { value: 300, name: '视频广告' },
            ],
          },
        ],
      },
      option4: {
        xAxis: {},
        yAxis: {},
        series: [
          {
            symbolSize: 20,
            data: [
              [10.0, 8.04],
              [8.07, 6.95],
              [13.0, 7.58],
              [9.05, 8.81],
              [11.0, 8.33],
              [14.0, 7.66],
              [13.4, 6.81],
              [10.0, 6.33],
              [14.0, 8.96],
              [12.5, 6.82],
              [9.15, 7.2],
              [11.5, 7.2],
              [3.03, 4.23],
              [12.2, 7.83],
              [2.02, 4.47],
              [1.05, 3.33],
              [4.05, 4.96],
              [6.03, 7.24],
              [12.0, 6.26],
              [12.0, 8.84],
              [7.08, 5.82],
              [5.02, 5.68],
            ],
            type: 'scatter',
          },
        ],
      },
      option5: {
        legend: {
          data: ['预算分配（Allocated Budget）', '实际开销（Actual Spending）'],
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: '销售（Sales）', max: 6500 },
            { name: '管理（Administration）', max: 16000 },
            { name: '信息技术（Information Technology）', max: 30000 },
            { name: '客服（Customer Support）', max: 38000 },
            { name: '研发（Development）', max: 52000 },
            { name: '市场（Marketing）', max: 25000 },
          ],
        },
        series: [
          {
            name: '预算 vs 开销（Budget vs spending）',
            type: 'radar',
            data: [
              {
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: '预算分配（Allocated Budget）',
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: '实际开销（Actual Spending）',
              },
            ],
          },
        ],
      },
      option6: {
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
                value: 70,
              },
            ],
          },
        ],
      },
    };
  },
  methods: {
    handleCancel() {
      this.$root.goBack();
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  height: 200px;
}
</style>
