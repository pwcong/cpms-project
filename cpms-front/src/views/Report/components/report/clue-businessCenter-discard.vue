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
      .getDepartmentDistributed({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        fdStatus: 'discard',
      })
      .then((res) => {
        return res;
      });
    let clueData = [];
    value.map((d) => {
      return clueData.unshift({
        name: d.fdBusinessName + d.fdPercentage,
        value: d.fdPercentage.slice(0, d.fdPercentage.length - 1),
        total: d.fdNumber,
      });
    });
    if (clueData.every((item) => item.total > 0)) {
    } else {
      clueData = [{ name: '暂无数据', value: 0, total: 0 }];
    }

    _.option = {
      series: [{ data: clueData }],
    };

    _.clueData = clueData;
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
            return `${ctx.clueData[p.dataIndex].name}<br>${
              ctx.clueData[p.dataIndex].total
            }个`;
          },
        },

        series: [
          {
            type: 'pie',
            radius: '60%',
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
                  return `${ctx.clueData[p.dataIndex].total}个\n${
                    ctx.clueData[p.dataIndex].value + '%'
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
