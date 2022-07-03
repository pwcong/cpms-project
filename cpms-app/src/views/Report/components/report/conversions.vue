<template>
  <div>
    <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
    <div v-show="!loading" class="chartdev">
      <v-chart class="chart" :option="option" />
      <div class="xs"></div>
      <v-chart class="chart" :option="option2" />
    </div>
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
            <van-icon color="#e50113" name="down" />
            {{ item.title }}
          </span>
          <span v-else-if="item.riseOrDecline === 'rise'" style="color: #07c160">
            <van-icon color="#07c160" name="down" style="transform: rotate(180deg)" />
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
            color: item.riseOrDecline === 'decline' ? '#e50113' : item.riseOrDecline === 'rise' ? '#07c160' : undefined,
          }"
        >
          {{ item.value }}
        </span>
      </template>
      <template v-slot:chainRatio="{ item }">
        <span
          :style="{
            color: item.riseOrDecline === 'decline' ? '#e50113' : item.riseOrDecline === 'rise' ? '#07c160' : undefined,
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
      clueChainRatio: value.clueCountDto.chainRatio || '0',
      clueNewAdditionsNum: value.clueCountDto.newAdditionsNum || '0',
      clueTransferredNum: value.clueCountDto.transferredNum || '0',
      clueRiseOrDecline: value.clueCountDto.riseOrDecline || '0',

      chainRatio: value.projectReportDTO.chainRatio || '0',
      newAdditionsNum: value.projectReportDTO.newAdditionsNum || '0',
      transferredNum: value.projectReportDTO.transferredNum || '0',
      riseOrDecline: value.projectReportDTO.riseOrDecline || '0',
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
  data() {
    return {
      option: {
        title: {
          text: '线索转项目',
          bottom: 10,
          left: '25%',
          textStyle: {
            fontSize: 12,
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
              fontSize: 8,
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
              fontSize: 15,
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
          bottom: 10,
          left: '25%',
          textStyle: {
            fontSize: 12,
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
              fontSize: 8,
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
              fontSize: 15,
              formatter: '{value} %',
              offsetCenter: [0, '70%'],
            },
            data: [],
          },
        ],
      },
      report: {
        clueChainRatio: '0',
        clueNewAdditionsNum: '0',
        clueTransferredNum: '0',
        clueRiseOrDecline: '0',

        chainRatio: '0',
        newAdditionsNum: '0',
        transferredNum: '0',
        riseOrDecline: '0',
      },
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
  height: 200px;
  width: 50%;
}
.xs {
  width: 0.1rem;
  height: 5rem;
  border: 0.01rem solid #eeeeee;
}
</style>
