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
      .getProjectMainReportNewCreate({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
      })
      .then((res) => {
        return res.data;
      });

    let projectData = (value || []).map((d) => {
      return {
        name: d.fdBusinessName + d.fdPercentage,
        total: d.fdPercentage,
        value: d.fdNumber,
      };
    });
    _.option = {
      series: [{ data: projectData }],
    };

    _.projectData = projectData;
    return Promise.resolve({
      data: [],
    });
  },
});

export default {
  mixins: [reportMixin, reqMixin],
  props: {
    projectState: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const ctx = this;
    return {
      projectData: [],
      option: {
        legend: {
          textStyle: {
            fontSize: 14,
          },
          itemHeight: 14,
          top: 'bottom',
          bottom: 'top',
        },
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return `${ctx.projectData[p.dataIndex].name}<br>${
              ctx.projectData[p.dataIndex].total
            }<br>${ctx.projectData[p.dataIndex].value} 个`;
          },
        },

        series: [
          {
            type: 'pie',
            radius: '70%',
            center: ['50%', '40%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8,
            },
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 14,
                },
                formatter: function (p) {
                  return `${ctx.projectData[p.dataIndex].value}个\n${
                    ctx.projectData[p.dataIndex].total
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
