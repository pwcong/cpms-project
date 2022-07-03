<template>
  <div>
    <v-chart class="chart" :option="option" />
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { buildListMixin } from '@/mixins';
import reportMixin from '../../mixins/report';
import api from '@/api';
const reqMixin = buildListMixin({
  relation: ['reportQuery'],
  getData: async (_) => {
    const { reportQuery } = _;

    const query = _.time();
    const value = await api.report.getSemesterOverview(query).then((res) => {
      return res;
    });
    const month = (value.projectReportDTO.projectTotalTrendList || []).map((d) => {
      return dayjs(d.reportKey).format('MM') + '月';
    });
    const projectData = (value.projectReportDTO.projectTotalTrendList || []).map((d) => {
      return d.total;
    });
    const clueData = (value.clueCountDto.clueTotalTrend || []).map((d) => {
      return d.total;
    });
    const customerData = (value.custCountDto.custTotalTrendList || []).map((d) => {
      return d.total;
    });
    const VisitData = (value.clockReportDto.visitTotalTrend || []).map((d) => {
      return d.total;
    });
    _.option = {
      xAxis: [
        {
          data: month,
        },
      ],
      series: [
        {
          data: clueData,
        },
        {
          data: customerData,
        },
        {
          data: projectData,
        },
        {
          data: VisitData,
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
        tooltip: {
          trigger: 'axis',
          textStyle: {
            fontSize: 14,
          },
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {
          fontSize: 10,
          itemHeight: 10,
          y: 'bottom',
          width: '100%',
          data: ['线索', '客户', '项目', '拜访'],
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '3%',
          bottom: '20%',
          containLabel: true,
        },
        toolbox: {
          show: false,
          left: 'right',
          top: '20',
          fontSize: '10',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: ['2012', '2013', '2014', '2015', '2016'],
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '线索',
            type: 'bar',
            barGap: 0,

            emphasis: {
              focus: 'series',
            },
          },
          {
            name: '客户',
            type: 'bar',

            emphasis: {
              focus: 'series',
            },
          },
          {
            name: '项目',
            type: 'bar',

            emphasis: {
              focus: 'series',
            },
          },
          {
            name: '拜访',
            type: 'bar',

            emphasis: {
              focus: 'series',
            },
          },
        ],
      },
    };
  },
  methods: {
    time() {
      let dateTimes = {
        startTime: dayjs()
          .subtract(5, 'M')
          .startOf('M')
          .startOf('d')
          .format('YYYY-MM-DD HH:mm:ss'),
        endTime: dayjs().endOf('M').endOf('d').format('YYYY-MM-DD HH:mm:ss'),
      };

      return dateTimes;
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  height: 500px;
}
</style>
