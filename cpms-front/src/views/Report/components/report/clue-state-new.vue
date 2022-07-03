<template>
  <div>
    <div>
      <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
      <div v-show="!loading">
        <v-chart class="chart" :option="option" />
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { buildListMixin } from '@/mixins';
import reportMixin from '../../mixins/report';

const reqMixin = buildListMixin({
  relation: ['reportQuery'],
  getData: async (_) => {
    const { reportQuery } = _;

    const value = await api.report
      .getClueMainClueStatus({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        flag: 'newCreate',
      })
      .then((res) => {
        return res.data;
      });
    let clueData = [
      { name: '待处理', total: 0, value: 0, code: 'todo' },
      { name: '废弃', total: 0, value: 0, code: 'discard' },
      { name: '跟进中', total: 0, value: 0, code: 'follow' },
      { name: '转化中', total: 0, value: 0, code: 'changing' },
      { name: '已转化', total: 0, value: 0, code: 'changed' },
    ];
    value.map((d) => {
      switch (d.fdStatusCode) {
        case 'todo':
          clueData.unshift({
            name: d.fdStatusName + d.percentage + '%',
            value: d.percentage,
            total: d.fdNumber,
            code: d.fdStatusCode,
          });
          break;
        case 'discard':
          clueData.unshift({
            name: d.fdStatusName + d.percentage + '%',
            value: d.percentage,
            total: d.fdNumber,
            code: d.fdStatusCode,
          });
          break;
        case 'follow':
          clueData.unshift({
            name: d.fdStatusName + d.percentage + '%',
            value: d.percentage,
            total: d.fdNumber,
            code: d.fdStatusCode,
          });
          break;
        case 'changing':
          clueData.unshift({
            name: d.fdStatusName + d.percentage + '%',
            value: d.percentage,
            total: d.fdNumber,
            code: d.fdStatusCode,
          });
          break;
        case 'changed':
          clueData.unshift({
            name: d.fdStatusName + d.percentage + '%',
            value: d.percentage,
            total: d.fdNumber,
            code: d.fdStatusCode,
          });
          break;
      }
    });

    _.option = {
      series: [{ data: _.process(clueData) }],
    };

    let clueValue = _.process(clueData);
    _.clueValue = clueValue;
    return Promise.resolve({
      data: [],
    });
  },
});

export default {
  mixins: [reportMixin, reqMixin],
  data() {
    const ctx = this;
    return {
      clueData: [],
      option: {
        legend: {
          textStyle: {
            fontSize: 14,
          },
          itemHeight: 18,
          top: 'bottom',
          bottom: 'top',
        },
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return `${ctx.clueValue[p.dataIndex].name}<br>${
              ctx.clueValue[p.dataIndex].total
            }个`;
          },
        },

        series: [
          {
            type: 'pie',
            radius: '70%',
            center: ['50%', '35%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 18,
            },
            label: {
              normal: {
                textStyle: {
                  fontSize: 14,
                },
                show: true,
                formatter: function (p) {
                  return `${ctx.clueValue[p.dataIndex].total}个\n${
                    ctx.clueValue[p.dataIndex].value + '%'
                  }`;
                },
              },
            },
            labelLine: {
              normal: {
                length: 2, // 改变标示线的长度
              },
            },
          },
        ],
      },
    };
  },
  methods: {
    process(arr) {
      // 缓存用于记录
      const cache = {};
      return arr.filter((d) => {
        if (cache[d.code]) {
          return false;
        }
        cache[d.code] = true;
        return true;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  height: 480px;
}
</style>
