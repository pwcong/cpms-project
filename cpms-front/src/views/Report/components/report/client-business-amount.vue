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
      .getCustMainIndustry({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res;
      });
    const dictData = await api.basedata
      .getDictList('cpms', 'cpms_business')
      .then((res) => res.data || []);
    const dictMap = dictData.reduce((p, c) => {
      p[c.value] = c;
      return p;
    }, {});
    const baseData = [
      { value: 0, code: 'hotel', total: 0 },
      { value: 0, code: 'gov', total: 0 },
      { value: 0, code: 'flats', total: 0 },
      { value: 0, code: 'property', total: 0 },
      { value: 0, code: 'business', total: 0 },
      { value: 0, code: 'operators', total: 0 },
      { value: 0, code: 'other', total: 0 },
    ];
    const cache = baseData.reduce((p, c) => {
      p[c.code] = c;
      return p;
    }, {});
    value.data.forEach((d) => {
      if (d.statusCode === '' || d.statusCode === null) {
        return;
      } else {
        cache[d.statusCode] = {
          value: d.percentage,
          code: d.statusCode,
          total: d.total ? d.total : 0,
        };
      }
    });
    let tradeDate = Array.from(Object.keys(cache)).map((k) => {
      const t = cache[k];
      return {
        ...t,
        name: ((dictMap[t.code] || {}).text || '-') + t.value + '%',
      };
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
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return ` ${ctx.initialData[p.dataIndex].name}<br>${
              ctx.initialData[p.dataIndex].total
            }个`;
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
            radius: ['25%', '60%'],
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
  height: 420px;
}
</style>
