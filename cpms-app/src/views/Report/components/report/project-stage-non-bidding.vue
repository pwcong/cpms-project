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
        fdStatus: '5252d7ab3f2a4c92b79c89109372e50f',
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res.data;
      });
    let projectStageData = [
      {
        name: '跟进中0%',
        value: 0,
        total: 0,
        code: 'follow',
        itemStyle: {
          normal: { color: '#5470c6' },
        },
      },
      {
        name: '审批中0%',
        value: 0,
        total: 0,
        code: 'audit',
        itemStyle: {
          normal: { color: '#fac858' },
        },
      },
      {
        name: '已丢单0%',
        value: 0,
        total: 0,
        code: 'lost',
        itemStyle: {
          normal: { color: '#ee6666' },
        },
      },
      {
        name: '已成交0%',
        value: 0,
        total: 0,
        code: 'done',
        itemStyle: {
          normal: { color: '#91cc75' },
        },
      },
    ];
    // (value || []).map((d) => {
    //   if (d.name === '新增审批中') {
    //     return projectStageData.unshift({
    //       name: '审批中' + d.percentage + '%',
    //       value: d.percentage,
    //       total: d.total,
    //       code: d.statusCode,
    //     });
    //   } else {
    //     return projectStageData.unshift({
    //       name: d.name + d.percentage + '%',
    //       value: d.percentage,
    //       total: d.total,
    //       code: d.statusCode,
    //     });
    //   }
    // });
    (value || []).map((d) => {
      switch (d.statusCode) {
        case 'follow':
          projectStageData.unshift({
            name: d.name + d.percentage + '%',
            value: d.percentage,
            total: d.total,
            code: d.statusCode,
            itemStyle: {
              normal: { color: '#5470c6' },
            },
          });
          break;
        case 'audit':
          projectStageData.unshift({
            name: '审批中' + d.percentage + '%',
            value: d.percentage,
            total: d.total,
            code: d.statusCode,
            itemStyle: {
              normal: { color: '#fac858' },
            },
          });
          break;
        case 'lost':
          projectStageData.unshift({
            name: d.name + d.percentage + '%',
            value: d.percentage,
            total: d.total,
            code: d.statusCode,
            itemStyle: {
              normal: { color: '#ee6666' },
            },
          });
          break;
        case 'done':
          projectStageData.unshift({
            name: d.name + d.percentage + '%',
            value: d.percentage,
            total: d.total,
            code: d.statusCode,
            itemStyle: {
              normal: { color: '#91cc75' },
            },
          });
          break;
      }
    });
    projectStageData.sort(function (a, b) {
      return b.total - a.total;
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
        legend: {
          fontSize: 8,
          itemHeight: 5,
          top: 'bottom',
          bottom: 'top',
        },
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return `${ctx.initialData[p.dataIndex].name}<br>${ctx.initialData[p.dataIndex].total}个 `;
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
                  return `${ctx.initialData[p.dataIndex].total}个\n${ctx.initialData[p.dataIndex].value + '%'}`;
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
  height: 300px;
}
</style>
