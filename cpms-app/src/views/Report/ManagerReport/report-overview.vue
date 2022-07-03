<template>
  <div class="report-overview">
    <block theme="card">
      <block>
        <template slot="title">
          <div>近半年新增记录统计</div>
          <div style="font-size: 12px; color: #999999">{{ nearlyHalfYear }}</div>
        </template>
        <report-total-count :reportQuery="reportQuery" />
      </block>
    </block>

    <block theme="card" style="margin-top: 8px">
      <block>
        <template slot="title">
          <div>{{ date.text }}转化率统计</div>
          <div style="font-size: 12px; color: #999999">{{ formatDateRange(date.value) }}</div>
        </template>
        <conversions :reportQuery="reportQuery"></conversions>
      </block>
    </block>
    <block theme="card" style="margin-top: 8px">
      <block>
        <template slot="title">
          <div>{{ date.text }}项目报备详情</div>
          <div style="font-size: 12px; color: #999999">{{ formatDateRange(date.value) }}</div>
        </template>
        <div style="margin-top: 8px">
          <tabs-layout theme="swiper" :tabs="[{ key: 'project-state', title: '按状态' }]">
            <template>
              <project-distribution-state slot="project-state" :reportQuery="reportQuery"></project-distribution-state>
              <project-distribution-channels
                slot="project-channel"
                :reportQuery="reportQuery"
              ></project-distribution-channels>
            </template>
          </tabs-layout>
        </div>
      </block>
    </block>
    <block theme="card" style="margin-top: 8px">
      <block>
        <template slot="title">
          <div>{{ date.text }}客户新增情况</div>
          <div style="font-size: 12px; color: #999999">{{ formatDateRange(date.value) }}</div>
        </template>
        <div style="margin-top: 8px">
          <tabs-layout
            theme="swiper"
            :tabs="[
              { key: 'client-industry', title: '按行业' },
              { key: 'client-channel', title: '按渠道' },
            ]"
          >
            <template>
              <client-new-industry slot="client-industry" :reportQuery="reportQuery"></client-new-industry>
              <client-new-channels slot="client-channel" :reportQuery="reportQuery"></client-new-channels>
            </template>
          </tabs-layout>
        </div>
      </block>
    </block>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import reportMixin from '../mixins/report';
import ReportTotalCount from '../components/report/total-count';
import ProjectDistributionState from '../components/report/project-distribution-state';
import ProjectDistributionChannels from '../components/report/project-distribution-channels';
import Conversions from '../components/report/conversions';
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
    ProjectDistributionState,
    ProjectDistributionChannels,
    Conversions,
    clientNewIndustry,
    ClientNewChannels,
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.report-overview {
  padding: 8px;
  .report-action {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #666666;
    .van-icon {
      margin-left: 2px;

      &.active {
        color: $theme-color;
      }
    }
    .van-icon-down {
      font-size: 16px;
    }
  }
}
</style>
