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
    _.disposeTime(reportQuery.timeText);
    const value = await api.report
      .getCustMainChannel({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        flag: 'newCreate',
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res;
      });

    const dictData = await api.basedata.getDictList('cpms', 'cpms_comtomer_channel').then((res) => res.data || []);
    const dictMap = dictData.reduce((p, c) => {
      p[c.value] = c;
      return p;
    }, {});

    const baseData = [
      {
        value: 0,
        code: 'other',
        total: 0,
        itemStyle: {
          normal: { color: '#ee6666' },
        },
      },
      {
        value: 0,
        code: 'operators',
        total: 0,
        itemStyle: {
          normal: { color: '#5470c6' },
        },
      },
      {
        value: 0,
        code: 'engineering',
        total: 0,
        itemStyle: {
          normal: { color: '#91cc75' },
        },
      },
      {
        value: 0,
        code: 'smarthome',
        total: 0,
        itemStyle: {
          normal: { color: '#fac858' },
        },
      },
    ];
    const cache = baseData.reduce((p, c) => {
      p[c.code] = c;
      return p;
    }, {});

    // value.data.forEach((d) => {
    //   if (d.statusCode === '' || d.statusCode === null) {
    //     return;
    //   } else {
    //     cache[d.statusCode] = {
    //       value: d.percentage,
    //       code: d.statusCode,
    //       total: d.total ? d.total : 0,
    //     };
    //   }
    // });
    value.data.map((d) => {
      switch (d.statusCode) {
        case 'other':
          cache[d.statusCode] = {
            value: d.percentage,
            code: d.statusCode,
            total: d.total ? d.total : 0,
            itemStyle: {
              normal: { color: '#ee6666' },
            },
          };
          break;
        case 'operators':
          cache[d.statusCode] = {
            value: d.percentage,
            code: d.statusCode,
            total: d.total ? d.total : 0,
            itemStyle: {
              normal: { color: '#5470c6' },
            },
          };
          break;
        case 'engineering':
          cache[d.statusCode] = {
            value: d.percentage,
            code: d.statusCode,
            total: d.total ? d.total : 0,
            itemStyle: {
              normal: { color: '#91cc75' },
            },
          };
          break;
        case 'smarthome':
          cache[d.statusCode] = {
            value: d.percentage,
            code: d.statusCode,
            total: d.total ? d.total : 0,
            itemStyle: {
              normal: { color: '#fac858' },
            },
          };
          break;
      }
    });
    let tradeDate = Array.from(Object.keys(cache)).map((k) => {
      const t = cache[k];
      return {
        ...t,
        name: ((dictMap[t.code] || {}).text || '-') + t.value + '%',
      };
    });

    // _.report = {
    //   changeRate: value.changeRate || '0',
    //   newAdditionsNum: value.newAdditionsNum || '0',
    //   firstMonthNewAdditionsNum: value.firstMonthNewAdditionsNum || '0',
    //   riseOrDecline: value.riseOrDecline || '0',
    // };
    tradeDate.sort(function (a, b) {
      return b.total - a.total;
    });
    _.option = {
      series: [{ data: tradeDate }],
    };
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
  height: 250px;
}
</style>
