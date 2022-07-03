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
        flag: 'newCreate',
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
      return projectInitialData.unshift({
        name: d.statusCode,
        value: d.percentage,
        total: d.total,
      });
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
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return ` ${ctx.tradeDate[p.dataIndex].name}<br>${
              ctx.tradeDate[p.dataIndex].value
            }%<br>${ctx.tradeDate[p.dataIndex].total}个`;
          },
        },
        legend: {
          top: 'bottom',
          left: 'center',
          textStyle: {
            fontSize: 14,
          },
          itemHeight: 18,
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '15%',
          bottom: '3%',
          containLabel: true,
        },

        series: [
          {
            name: '业务员行业',
            type: 'pie',
            radius: ['25%', '50%'],
            center: ['50%', '30%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '18',
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
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
  height: 446px;
}
</style>
