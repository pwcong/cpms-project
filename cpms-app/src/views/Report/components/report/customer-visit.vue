<template>
  <div>
    <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
    <div v-show="!loading">
      <v-chart class="chart" :option="option" />
    </div>
  </div>
</template>

<script>
import api from '@/api';
import { buildListMixin } from '@/mixins';
import reportMixin from '../../mixins/report';

const reqMixin = buildListMixin({
  relation: ['reportQuery', 'sort'],
  getData: async (_) => {
    const { reportQuery, sort } = _;

    const value = await api.report
      .getRankList({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        fdStatus: 'cust',
        type: 'and',
        sort: sort,
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res;
      });
    let client = value.slice(0, 10).reverse();

    _.client = client;

    const clientName = (client || []).map((d) => {
      if (d.fdBusinessName === 'B2B业务中心智能家居业务部') {
        return '智能家居';
      } else if (d.fdBusinessName === 'B2B业务中心工程机业务部') {
        return '工程机部';
      } else if (d.fdBusinessName === 'B2B业务中心运营商业务部') {
        return '运营';
      }
      return d.fdBusinessName.substring(0, d.fdBusinessName.length - 4);
    });
    const clientData = (client || []).map((d) => {
      return d.fdNumber;
    });

    _.option = {
      yAxis: { data: clientName },
      series: [
        {
          data: clientData,
        },
      ],
    };
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
      client: [],
      option: {
        title: {
          text: '',
          subtext: '',
          textStyle: {
            fontSize: 14,
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '15%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
        },
        series: [
          {
            name: '实际拜访数',
            type: 'bar',
            barCategoryGap: '50%',
            label: {
              normal: {
                show: true, //是否显示
                position: 'right', //文字位置
                // formatter: '{c}', //c后面加单位
                formatter: function (p) {
                  return `${ctx.client[p.dataIndex].fdNumber}个\n${ctx.client[p.dataIndex].fdPercentage}`;
                },
              },
            },
            barGap: 15, //关键属性
          },
        ],
      },
    };
  },
  props: {
    sort: {
      type: String,
      default: 'desc',
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  height: 350px;
}
</style>
