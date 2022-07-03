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
      .getProjectIndustry({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res;
      });
    const dictData = await api.basedata.getDictList('cpms', 'cpms_business').then((res) => res.data || []);
    const dictMap = dictData.reduce((p, c) => {
      p[c.value] = c;
      return p;
    }, {});
    const baseData = [
      {
        value: 0,
        code: 'hotel',
        total: 0,
        itemStyle: {
          normal: { color: '#5470c6' },
        },
      },
      {
        value: 0,
        code: 'gov',
        total: 0,
        itemStyle: {
          normal: { color: '#91cc75' },
        },
      },
      {
        value: 0,
        code: 'flats',
        total: 0,
        itemStyle: {
          normal: { color: '#fac858' },
        },
      },
      {
        value: 0,
        code: 'property',
        total: 0,
        itemStyle: {
          normal: { color: '#ee6666' },
        },
      },
      {
        value: 0,
        code: 'business',
        total: 0,
        itemStyle: {
          normal: { color: '#73c0de' },
        },
      },
      {
        value: 0,
        code: 'operators',
        total: 0,
        itemStyle: {
          normal: { color: '#3ba272' },
        },
      },
      {
        value: 0,
        code: 'other',
        total: 0,
        itemStyle: {
          normal: { color: '#fc8452' },
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
        case 'hotel':
          cache[d.statusCode] = {
            value: d.percentage,
            code: d.statusCode,
            total: d.total ? d.total : 0,
            itemStyle: {
              normal: { color: '#5470c6' },
            },
          };
          break;
        case 'gov':
          cache[d.statusCode] = {
            value: d.percentage,
            code: d.statusCode,
            total: d.total ? d.total : 0,
            itemStyle: {
              normal: { color: '#91cc75' },
            },
          };
          break;
        case 'flats':
          cache[d.statusCode] = {
            value: d.percentage,
            code: d.statusCode,
            total: d.total ? d.total : 0,
            itemStyle: {
              normal: { color: '#fac858' },
            },
          };
          break;
        case 'property':
          cache[d.statusCode] = {
            value: d.percentage,
            code: d.statusCode,
            total: d.total ? d.total : 0,
            itemStyle: {
              normal: { color: '#ee6666' },
            },
          };
          break;
        case 'business':
          cache[d.statusCode] = {
            value: d.percentage,
            code: d.statusCode,
            total: d.total ? d.total : 0,
            itemStyle: {
              normal: { color: '#73c0de' },
            },
          };
          break;
        case 'operators':
          cache[d.statusCode] = {
            value: d.percentage,
            code: d.statusCode,
            total: d.total ? d.total : 0,
            itemStyle: {
              normal: { color: '#3ba272' },
            },
          };
          break;
        case 'other':
          cache[d.statusCode] = {
            value: d.percentage,
            code: d.statusCode,
            total: d.total ? d.total : 0,
            itemStyle: {
              normal: { color: '#fc8452' },
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
    tradeDate.sort(function (a, b) {
      return b.total - a.total;
    });
    _.option = {
      series: [{ data: tradeDate }],
    };
    let initialData = tradeDate;
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
  props: {
    loginNameList: {
      type: String,
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  height: 300px;
}
</style>
