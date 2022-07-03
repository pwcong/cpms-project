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
      .getProjectTypeName({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res.data;
      });

    const projectType = await api.business
      .getNewProjectTypeList({
        pageNo: 1,
        pageSize: 100,
        limit: 100,
      })
      .then((res) => res.data || []);
    let projectInitialData = (projectType || []).map((d) => {
      return { name: d.fdName + ' ' + d.fdVersion, value: 0, total: 0 };
    });

    (value || []).map((d) => {
      return projectInitialData.unshift({ name: d.statusCode, value: d.percentage, total: d.total });
    });
    projectInitialData.sort(function (a, b) {
      return b.total - a.total;
    });
    _.option = {
      series: [{ data: _.process(projectInitialData) }],
    };
    let tradeDate = _.process(projectInitialData);
    _.tradeDate = tradeDate;
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
      tradeDate: [],
      option: {
        legend: {
          fontSize: 8,
          itemHeight: 5,
          top: 'bottom',
          bottom: 'top',
        },
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return `${ctx.tradeDate[p.dataIndex].name}<br>${ctx.tradeDate[p.dataIndex].total}个 `;
          },
        },

        series: [
          {
            type: 'pie',
            radius: '60%',
            center: ['50%', '40%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8,
            },
            label: {
              normal: {
                show: true,
                formatter: function (p) {
                  return `${ctx.tradeDate[p.dataIndex].total}个\n${ctx.tradeDate[p.dataIndex].value + '%'}`;
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
      report: {
        changeRate: '0',
        newAdditionsNum: '0',
        firstMonthNewAdditionsNum: '0',
        riseOrDecline: '0',
      },
      timeText: '',
    };
  },
  methods: {
    process(arr) {
      // 缓存用于记录
      const cache = {};
      return arr.filter((d) => {
        if (cache[d.name]) {
          return false;
        }
        cache[d.name] = true;
        return true;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  height: 300px;
}
</style>
