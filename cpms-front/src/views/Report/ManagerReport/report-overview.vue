<template>
  <div>
    <p-row :gutter="[8, 8]">
      <p-col :span="12">
        <block theme="card">
          <template slot="title">
            <div>近半年新增记录统计</div>
            <div style="font-size: 12px; color: #999999">{{ nearlyHalfYear }}</div>
          </template>
          <report-total-count :reportQuery="reportQuery" />
        </block>
      </p-col>
      <p-col :span="12">
        <block theme="card">
          <template slot="title">
            <div>本月转换率统计</div>
            <div style="font-size: 12px; color: #999999">
              {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
            </div>
          </template>
          <conversions :reportQuery="reportQuery" />
        </block>
      </p-col>
      <p-col :span="12">
        <block theme="card">
          <template slot="title">
            <div>本月项目报备详情</div>
            <div style="font-size: 12px; color: #999999">
              {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
            </div>
          </template>
          <tabs-layout theme="swiper" :tabs="[{ key: 'project-state', title: '按状态' }]">
            <template>
              <project-distribution-state
                slot="project-state"
                :reportQuery="reportQuery"
              />
            </template>
          </tabs-layout>
        </block>
      </p-col>
      <p-col :span="12">
        <block theme="card">
          <template slot="title">
            <div>本月客户新增情况</div>
            <div style="font-size: 12px; color: #999999">
              {{ formatDateRange(reportQuery.startTime + ',' + reportQuery.endTime) }}
            </div>
          </template>
          <tabs-layout
            theme="swiper"
            :tabs="[
              { key: 'client-industry', title: '按行业' },
              { key: 'client-channel', title: '按渠道' },
            ]"
          >
            <template>
              <client-new-industry slot="client-industry" :reportQuery="reportQuery" />
              <client-new-channels slot="client-channel" :reportQuery="reportQuery" />
            </template>
          </tabs-layout>
        </block>
      </p-col>
    </p-row>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import reportMixin from '../mixins/report';
import ReportTotalCount from '../components/report/total-count';
import Conversions from '../components/report/conversions';
import ProjectDistributionState from '../components/report/project-distribution-state';
import clientNewIndustry from '../components/report/client-new-industry';
import ClientNewChannels from '../components/report/client-new-channels';

export default {
  mixins: [reportMixin],
  data() {
    return {
      nearlyHalfYear:
        dayjs().subtract(5, 'M').startOf('M').startOf('d').format('YYYY-MM-DD') +
        ' ~ ' +
        dayjs().endOf('M').endOf('d').format('YYYY-MM-DD'),
    };
  },
  props: {
    date: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ReportTotalCount,
    Conversions,
    ProjectDistributionState,
    clientNewIndustry,
    ClientNewChannels,
  },
};
</script>
