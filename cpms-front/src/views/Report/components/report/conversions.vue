<template>
  <div>
    <div class="chartdev">
      <v-chart class="chart" :option="option" />
      <div class="xs"></div>
      <v-chart class="chart" :option="option2" />
    </div>
    <!-- <data-grid :reportQuery="report"/> -->
    <data-grid
      theme="report"
      style="margin-top: 4px; border-top: 1px solid #dddddd"
      :value="[
        {
          key: 'clueChainRatio',
          title: '环比',
          value: report.clueChainRatio + '%' || '0%',
          riseOrDecline: report.clueRiseOrDecline,
        },
        {
          key: 'clueNewAdditionsNum',
          title: '新增线索',
          value: report.clueNewAdditionsNum + '条' || '0',
        },
        {
          key: 'clueTransferredNum',
          title: '已转报备',
          value: report.clueTransferredNum + '个' || '0',
        },
        {
          key: 'chainRatio',
          title: '环比',
          value: report.chainRatio + '%' || '0%',
          riseOrDecline: report.riseOrDecline,
        },
        {
          key: 'newAdditionsNum',
          title: '新增报备',
          value: report.newAdditionsNum + '个' || '0',
        },
        {
          key: 'transferredNum',
          title: '已转价格',
          value: report.transferredNum + '个' || '0',
        },
      ]"
    >
      <template v-slot:title="{ item }">
        <span v-if="item.key === 'clueChainRatio' || item.key === 'chainRatio'">
          <span v-if="item.riseOrDecline === 'decline'" style="color: #e50113">
            <p-icon type="arrow-down" style="color: #e50113; font-size: 14px" />
            {{ item.title }}
          </span>
          <span v-else-if="item.riseOrDecline === 'rise'" style="color: #07c160">
            <p-icon
              type="arrow-down"
              style="color: #07c160; font-size: 18px; transform: rotate(180deg)"
            />
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
      <template v-slot:clueChainRatio="{ item }">
        <span
          :style="{
            color:
              item.riseOrDecline === 'decline'
                ? '#e50113'
                : item.riseOrDecline === 'rise'
                ? '#07c160'
                : undefined,
          }"
        >
          {{ item.value }}
        </span>
      </template>
      <template v-slot:chainRatio="{ item }">
        <span
          :style="{
            color:
              item.riseOrDecline === 'decline'
                ? '#e50113'
                : item.riseOrDecline === 'rise'
                ? '#07c160'
                : undefined,
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
import dataGrid from '../../../../components/data-grid';

const reqMixin = buildListMixin({
  relation: ['reportQuery'],
  getData: async (_) => {
    const { reportQuery } = _;
    const value = await api.report
      .getConversions({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res;
      });

    const ClueCountChange = value.clueCountDto.changeRate;
    const ProjectChanege = value.projectReportDTO.changeRate;

    (_.report = {
      clueChainRatio: value.clueCountDto.chainRatio,
      clueNewAdditionsNum: value.clueCountDto.newAdditionsNum,
      clueTransferredNum: value.clueCountDto.transferredNum,
      clueRiseOrDecline: value.clueCountDto.riseOrDecline,

      chainRatio: value.projectReportDTO.chainRatio,
      newAdditionsNum: value.projectReportDTO.newAdditionsNum,
      transferredNum: value.projectReportDTO.transferredNum,
      riseOrDecline: value.projectReportDTO.riseOrDecline,
    }),
      (_.option = {
        series: [
          {
            data: [
              {
                value: ClueCountChange,
              },
            ],
          },
        ],
      });
    _.option2 = {
      series: [
        {
          data: [
            {
              value: ProjectChanege,
            },
          ],
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
  components: {
    dataGrid,
  },
  data() {
    return {
      option: {
        title: {
          text: '线索转换率',
          bottom: 40,
          left: '40%',
          textStyle: {
            fontSize: 16,
          },
        },
        series: [
          {
            type: 'gauge',
            progress: {
              show: true,
              width: 5,
            },
            axisLine: {
              lineStyle: {
                width: 5,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 5,
              lineStyle: {
                width: 2,
                color: '#999',
              },
            },
            axisLabel: {
              distance: 8,
              color: '#999',
              fontSize: 18,
              fontWeight: 700,
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 10,
              itemStyle: {
                borderWidth: 10,
              },
            },
            title: {
              show: false,
            },
            detail: {
              valueAnimation: true,
              fontSize: 28,
              formatter: '{value} %',
              offsetCenter: [0, '70%'],
            },
            data: [],
          },
        ],
      },
      option2: {
        title: {
          text: '项目转价格',
          bottom: 40,
          left: '40%',
          textStyle: {
            fontSize: 16,
          },
        },
        series: [
          {
            type: 'gauge',
            progress: {
              show: true,
              width: 5,
            },
            axisLine: {
              lineStyle: {
                width: 5,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 5,
              lineStyle: {
                width: 2,
                color: '#999',
              },
            },
            axisLabel: {
              distance: 8,
              color: '#999',
              fontSize: 18,
              fontWeight: 700,
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 10,
              itemStyle: {
                borderWidth: 10,
              },
            },
            title: {
              show: false,
            },
            detail: {
              valueAnimation: true,
              fontSize: 28,
              formatter: '{value} %',
              offsetCenter: [0, '70%'],
            },
            data: [],
          },
        ],
      },
      report: {},
    };
  },
};
</script>
<style lang="scss" scoped>
.chartdev {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chart {
  height: 446px;
  width: 45%;
}
.xs {
  width: 1px;
  height: 200px;
  border: 1px solid #eeeeee;
}
</style>
