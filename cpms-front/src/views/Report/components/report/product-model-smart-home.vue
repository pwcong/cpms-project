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
  relation: ['reportQuery', 'projectState'],
  getData: async (_) => {
    const { reportQuery, projectState } = _;

    const value = await api.report
      .getProjectProduct({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        flag: projectState,
        fdStatus: '06',
      })
      .then((res) => {
        return res.data;
      });
    let projectModelData = (value || []).map((d) => {
      return { name: d.name, total: d.total, value: d.percentage, code: d.statusCode };
    });
    if (projectModelData.length === 0) {
      projectModelData = [{ name: '暂无数据', value: 0, total: 0 }];
    } else {
    }
    _.option = {
      series: [{ data: projectModelData }],
    };

    _.projectModelData = projectModelData;
    return Promise.resolve({
      data: [],
    });
  },
});

export default {
  mixins: [reportMixin, reqMixin],
  props: {
    projectState: {
      type: String,
      default: 'money',
    },
  },
  data() {
    const ctx = this;
    return {
      projectModelData: [],
      option: {
        legend: {
          textStyle: {
            fontSize: 14,
          },
          itemHeight: 18,
          top: 'bottom',
          bottom: 'top',
          itemGap: 15, // 图例每项之间的间隔。
          formatter: function (projectModelData) {
            let brokenString = '';
            for (let i = 0, count = 0; i < projectModelData.length; i++) {
              if (count >= 4 && projectModelData[i] === '/') {
                count = 0;
                brokenString += '\n';
              } else {
                count++;
                brokenString += projectModelData[i];
              }
            }
            return brokenString;
          },
        },
        tooltip: {
          trigger: 'item',
          position: ['5%', '25%'],
          formatter: function (p) {
            let brokenString = '';
            for (
              let i = 0, count = 0;
              i < ctx.projectModelData[p.dataIndex].name.length;
              i++
            ) {
              if (count >= 4 && ctx.projectModelData[p.dataIndex].name[i] === '/') {
                count = 0;
                brokenString += '<br>';
              } else {
                count++;
                brokenString += ctx.projectModelData[p.dataIndex].name[i];
              }
            }
            return `${brokenString}<br>${ctx.projectModelData[p.dataIndex].total}${
              ctx.projectState === 'money' ? '元' : '个'
            }<br>${ctx.projectModelData[p.dataIndex].value}% `;
          },
        },

        series: [
          {
            type: 'pie',
            radius: '55%',
            center: ['50%', '25%'],
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
                  return `${ctx.projectModelData[p.dataIndex].value}%\n${
                    ctx.projectModelData[p.dataIndex].total
                  }${ctx.projectState === 'money' ? '元' : '个'}`;
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
  height: 448px;
}
</style>
