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
      .getProjectMainReportChannel({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        flag: 'newCreate',
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res.data;
      });
    let projectData = [];

    projectData = (value || []).map((d) => {
      return { name: d.name + d.percentage + '%', value: d.percentage, total: d.total };
    });
    if (projectData.length > 0) {
    } else {
      projectData = [{ name: '暂无数据', value: 0, total: 0 }];
    }
    _.option = {
      series: [{ data: projectData }],
    };
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
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return ` ${ctx.projectData[p.dataIndex].name}<br>${
              ctx.projectData[p.dataIndex].total
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
    };
  },
};
</script>
<style lang="scss" scoped>
.chart {
  height: 480px;
}
</style>
