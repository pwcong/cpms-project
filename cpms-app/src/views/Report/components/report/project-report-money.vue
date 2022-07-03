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
      .getProjectRankList({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        type: 'money',
        flag: 'reportMoney',
        sort: sort,
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res;
      });
    let project = value.slice(0, 10).reverse();

    _.project = project;

    const projectName = (project || []).map((d) => {
      if (d.fdBusinessName === 'B2B业务中心智能家居业务部') {
        return '智能家居';
      } else if (d.fdBusinessName === 'B2B业务中心工程机业务部') {
        return '工程机部';
      } else if (d.fdBusinessName === 'B2B业务中心运营商业务部') {
        return '运营';
      }
      return d.fdBusinessName.substring(0, d.fdBusinessName.length - 4);
    });
    const projectData = (project || []).map((d) => {
      return (d.fdMoney / 10000).toFixed(2);
    });

    _.option = {
      yAxis: { data: projectName },
      series: [
        {
          data: projectData,
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
      project: [],
      option: {
        top: 0,
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
          name: '万', //坐标名字
          nameLocation: 'end', //坐标位置，支持start,end，middle
          type: 'value',
          boundaryGap: [0, 0.01],
          nameLocation: 'end', //坐标轴名称显示位置。
          axisLabel: {
            //坐标轴刻度标签的相关设置。
            interval: 0,
            rotate: '40',
          },
        },
        yAxis: {
          type: 'category',
        },
        series: [
          {
            name: '报备金额(万)',
            type: 'bar',
            barCategoryGap: '50%',
            label: {
              normal: {
                show: true, //是否显示
                position: 'right', //文字位置
                // formatter: '{c}', //c后面加单位
                formatter: function (p) {
                  return `${(ctx.project[p.dataIndex].fdMoney / 10000).toFixed(2)}万\n${
                    ctx.project[p.dataIndex].fdPercentage
                  }`;
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
