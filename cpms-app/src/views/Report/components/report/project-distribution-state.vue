<template>
  <div>
    <div>
      <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
      <div v-show="!loading">
        <v-chart class="chart" :option="option" />
      </div>
    </div>
    <data-grid
      theme="report"
      style="margin-top: 4px; border-top: 1px solid #dddddd"
      :value="[
        {
          key: 'newAdditionsNum',
          title: '新增',
          value: report.newAdditionsNum + '个' || '0',
        },
        {
          key: 'firstMonthNewAdditionsNum',
          title: timeText,
          value: report.firstMonthNewAdditionsNum + '个' || '0',
        },
        {
          key: 'changeRate',
          title: '环比',
          value: report.changeRate + '%' || '0',
          riseOrDecline: report.riseOrDecline,
        },
      ]"
    >
      <template v-slot:title="{ item }">
        <span v-if="item.key === 'changeRate'">
          <span v-if="item.riseOrDecline === 'decline'" style="color: #e50113">
            <van-icon color="#e50113" name="down" />
            {{ item.title }}
          </span>
          <span v-else-if="item.riseOrDecline === 'rise'" style="color: #07c160">
            <van-icon color="#07c160" name="down" style="transform: rotate(180deg)" />
            {{ item.title }}
          </span>
          <span v-else>
            {{ item.title }}
          </span>
        </span>
        <span v-else>
          {{ item.title }}
        </span>
      </template>
      <template v-slot:changeRate="{ item }">
        <span
          :style="{
            color: item.riseOrDecline === 'decline' ? '#e50113' : item.riseOrDecline === 'rise' ? '#07c160' : undefined,
          }"
        >
          {{ item.value }}
        </span>
      </template>
    </data-grid>
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
    _.disposeTime(reportQuery.timeText);
    const value = await api.report
      .getProjectDistributionState({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        flag: 'status',
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res;
      });

    const statusData = [
      {
        name: '跟进中',
        total: 0,
        value: 0,
        code: 'follow',
        itemStyle: {
          normal: { color: '#5470c6' },
        },
      },
      {
        name: '已成交',
        total: 0,
        value: 0,
        code: 'done',

        itemStyle: {
          normal: { color: '#91cc76' },
        },
      },
      {
        name: '已丢单',
        total: 0,
        value: 0,
        code: 'lost',
        itemStyle: {
          normal: { color: '#ee6665' },
        },
      },
      {
        name: '报备审批中',
        total: 0,
        value: 0,
        code: 'audit',
        itemStyle: {
          normal: { color: '#fbc857' },
        },
      },
    ];
    value.reportStatisticsDTO.map((d) => {
      switch (d.name) {
        case '已丢单':
          statusData.unshift({
            value: d.percentage,
            name: d.name + d.percentage + '%',
            total: d.total,
            code: d.statusCode,
            itemStyle: {
              normal: { color: '#ee6665' },
            },
          });
          break;
        case '报备审批中':
          statusData.unshift({
            value: d.percentage,
            name: d.name + d.percentage + '%',
            total: d.total,
            code: d.statusCode,
            itemStyle: {
              normal: { color: '#fbc857' },
            },
          });
          break;
        case '跟进中':
          statusData.unshift({
            value: d.percentage,
            name: d.name + d.percentage + '%',
            total: d.total,
            code: d.statusCode,
            itemStyle: {
              normal: { color: '#5470c6' },
            },
          });
          break;
        case '已成交':
          statusData.unshift({
            value: d.percentage,
            name: d.name + d.percentage + '%',
            total: d.total,
            code: d.statusCode,
            itemStyle: {
              normal: { color: '#91cc76' },
            },
          });
          break;
      }
    });
    _.report = {
      changeRate: value.changeRate || '0',
      newAdditionsNum: value.newAdditionsNum || '0',
      firstMonthNewAdditionsNum: value.firstMonthNewAdditionsNum || '0',
      riseOrDecline: value.riseOrDecline || '0',
    };
    statusData.sort(function (a, b) {
      return b.total - a.total;
    });
    _.option = {
      // 全局调色盘。

      series: [
        {
          data: _.process(statusData),
        },
      ],
    };
    let projectData = _.process(statusData);
    _.projectData = projectData;
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
      projectData: [],
      option: {
        legend: {
          width: '100%',
          fontSize: 8,
          itemHeight: 5,
          top: 'bottom',
        },
        title: {
          subtext: '',
          left: 'center',
          textStyle: {
            fontSize: 14,
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return `${ctx.projectData[p.dataIndex].name}<br>${ctx.projectData[p.dataIndex].total}个 `;
          },
        },

        color: ['#ee6665', '#5470c6', '#91cc76', '#fbc857'],
        series: [
          {
            type: 'pie',
            center: ['50%', '40%'],
            radius: '65%',
            top: 30,

            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
            labelLine: {
              normal: {
                length: 20, // 改变标示线的长度
                lineStyle: {},
              },
            },
            label: {
              normal: {
                textStyle: {
                  fontSize: 12,
                },
                show: true,
                formatter: function (p) {
                  return `${ctx.projectData[p.dataIndex].total}个\n${ctx.projectData[p.dataIndex].value + '%'}`;
                },
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
    disposeTime(value) {
      switch (value) {
        case '本月':
          this.timeText = '上月';
          break;
        case '本周':
          this.timeText = '上周';
          break;
        case '上周':
          this.timeText = '上上周';
          break;
        case '今年':
          this.timeText = '上年';
          break;
        case '上月':
          this.timeText = '上上月';
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  height: 300px;
}
</style>
