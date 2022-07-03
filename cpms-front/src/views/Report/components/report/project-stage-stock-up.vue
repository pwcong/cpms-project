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
      .getProjectTypeStatus({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        fdStatus: '26eaa69c1df640dc945a8862fa389ac2',
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res.data;
      });
    let projectStageData = [
      { name: '跟进中0%', value: 0, total: 0, code: 'follow' },
      { name: '审批中0%', value: 0, total: 0, code: 'audit' },
      { name: '已丢单0%', value: 0, total: 0, code: 'lost' },
      { name: '已成交0%', value: 0, total: 0, code: 'done' },
    ];
    (value || []).map((d) => {
      if (d.name === '新增审批中') {
        return projectStageData.unshift({
          name: '审批中' + d.percentage + '%',
          value: d.percentage,
          total: d.total,
          code: d.statusCode,
        });
      } else {
        return projectStageData.unshift({
          name: d.name + d.percentage + '%',
          value: d.percentage,
          total: d.total,
          code: d.statusCode,
        });
      }
    });

    _.option = {
      series: [{ data: _.process(projectStageData) }],
    };
    let initialData = _.process(projectStageData);
    _.initialData = initialData;
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
      initialData: [],
      option: {
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return ` ${ctx.initialData[p.dataIndex].name}<br>${
              ctx.initialData[p.dataIndex].value
            }%<br>${ctx.initialData[p.dataIndex].total}个`;
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
            center: ['50%', '35%'],
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
