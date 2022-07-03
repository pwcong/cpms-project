<template>
  <div>
    <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
    <div v-show="!loading">
      <v-chart class="chart" :option="option" />
    </div>
  </div>
</template>

<script>
import { buildListMixin } from '@/mixins';
import reportMixin from '../../mixins/report';
import api from '@/api';
const reqMixin = buildListMixin({
  relation: ['reportQuery', 'sort'],
  getData: async (_) => {
    const { reportQuery, sort } = _;

    const value = await api.report
      .getClueRankList({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        flag: 'clueFollowCount',
        type: 'and',
        sort: sort,
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res;
      });
    let clue = value.slice(0, 10).reverse();

    _.clue = clue;
    const clueName = (clue || []).map((d) => {
      if (d.fdBusinessName === 'B2B业务中心智能家居业务部') {
        return '智能家居';
      } else if (d.fdBusinessName === 'B2B业务中心工程机业务部') {
        return '工程机部';
      } else if (d.fdBusinessName === 'B2B业务中心运营商业务部') {
        return '运营';
      }
      return d.fdBusinessName.substring(0, d.fdBusinessName.length - 4);
    });
    const clueData = (clue || []).map((d) => {
      return d.fdNumber;
    });
    _.option = {
      yAxis: { data: clueName },
      series: [
        {
          data: clueData,
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
      clue: [],
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
        toolbox: {
          //可视化的工具箱

          show: false,

          feature: {
            dataView: {
              //数据视图

              show: true,
            },

            restore: {
              //重置

              show: true,
            },

            dataZoom: {
              //数据缩放视图

              show: true,
            },

            saveAsImage: {
              //保存图片

              show: true,
            },

            magicType: {
              //动态类型切换

              type: ['bar', 'line'],
            },
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
            name: '有效跟进数量',
            type: 'bar',
            barCategoryGap: '50%',
            label: {
              normal: {
                show: true, //是否显示
                position: 'right', //文字位置
                // formatter: '{c}', //c后面加单位
                formatter: function (p) {
                  return `${ctx.clue[p.dataIndex].fdNumber}个\n${ctx.clue[p.dataIndex].fdPercentage}`;
                },
              },
            },
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
  height: 320px;
}
</style>
