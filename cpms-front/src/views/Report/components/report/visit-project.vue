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
      .getVisitList({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
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
      } else if (d.fdBusinessName != null) {
        return d.fdBusinessName.substring(0, d.fdBusinessName.length - 4);
      }
    });
    const projectData = (project || []).map((d) => {
      return d.fdNumber;
    });
    const projectData2 = (project || []).map((d) => {
      return d.fdFeedCount;
    });

    _.option = {
      yAxis: { data: projectName },
      series: [
        {
          name: '拜访计划数',
          type: 'bar',

          label: {
            normal: {
              show: true, //是否显示
              position: 'right', //文字位置
              formatter: '{c}', //c后面加单位
            },
          },
          data: projectData,
        },

        {
          name: '拜访反馈数',
          type: 'bar',

          data: projectData2,
          label: {
            normal: {
              show: true, //是否显示
              position: 'right', //文字位置
              formatter: '{c}', //c后面加单位
            },
          },
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
    return {
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
        legend: {
          fontSize: 10,
          itemHeight: 5,
          y: 'bottom',
          width: '100%',
          data: ['拜访计划数', '拜访反馈数'],
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '15%',
          bottom: '10%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0],
        },
        yAxis: {
          type: 'category',
        },
      },
    };
  },
  props: {
    sort: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  height: 480px;
}
</style>
