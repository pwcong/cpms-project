<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>报表管理</p-breadcrumb-item>
            <p-breadcrumb-item>管理者报表</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 32px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="选择时间范围">
            <!-- <p-range-picker v-model="query.date" value-format="YYYY-MM-DD" /> -->
            <report-time v-model="query.date"></report-time>
          </p-switch-form-item>
          <p-switch-form-item label="选择商务中心">
            <report-selection-business
              multiple
              v-model="query.businessCenter"
            ></report-selection-business>
          </p-switch-form-item>
          <p-switch-form-item
            v-show="activeTab === 'report-salesman'"
            label="业务员排序方式"
          >
            <manager-report-salesman v-model="query.sortBy"></manager-report-salesman>
          </p-switch-form-item>

          <template slot="button">
            <p-button
              style="margin-top: -4px"
              type="primary"
              @click="onRefresh(false)"
              icon="search"
            />
          </template>
        </p-switch-form>
      </div>
    </template>
    <template v-slot:main="{ className }">
      <div :class="className">
        <p-tabs v-model="activeTab">
          <p-tab-pane key="report-overview" tab="概览">
            <report-overview :reportQuery="reportQuery" />
          </p-tab-pane>
          <p-tab-pane key="report-rank" tab="排行榜">
            <report-rank :reportQuery="reportQuery" />
          </p-tab-pane>
          <p-tab-pane key="report-clue" tab="线索">
            <report-clue :reportQuery="reportQuery" />
          </p-tab-pane>
          <p-tab-pane key="report-customer" tab="客户">
            <report-customer :reportQuery="reportQuery" />
          </p-tab-pane>
          <p-tab-pane key="report-project" tab="项目">
            <report-project :reportQuery="reportQuery" />
          </p-tab-pane>
          <p-tab-pane key="report-salesman" tab="业务员"></p-tab-pane>
          <!-- <p-tab-pane key="report-order" tab="订单"></p-tab-pane> -->
        </p-tabs>
      </div>
    </template>
  </list-layout>
</template>

<script>
import { buildListMixin, formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import dayjs from 'dayjs';
import ReportOverview from './report-overview';
import ReportRank from './report-rank';
import ReportTime from '../components/select/report-time';
import ReportSelectionBusiness from '../components/select/report-business';
import ManagerReportSalesman from '../components/select/manager-report-salesman';
import ReportClue from './report-clue';
import ReportCustomer from './report-customer';
import ReportProject from './report-project';
import Report from '../TeamReport/ClockInReport/report.vue';
const now = dayjs();
const listMixin = buildListMixin({
  properties: [
    { key: 'sorter', value: [] },
    {
      key: 'date',
      value: [
        {
          text: '本月',
          monthOrWeek: 'month',
          value: [
            now.startOf('M').startOf('d').format('YYYY-MM-DD HH:mm:ss'),
            now.endOf('M').endOf('d').format('YYYY-MM-DD HH:mm:ss'),
          ],
        },
      ],
    },
    {
      key: 'businessCenter',
      value: [],
    },
    {
      key: 'sortBy',
      value: [{ value: 'custNewCreateCount' }],
    },
  ],

  getQuery: (_, query) => {
    const { businessCenter = [], date = [], sorter = [], sortBy = [] } = query;

    let targetQuery = {
      businessCenter: businessCenter.map((d) => d.value).join(','),
      sortBy: sortBy.map((d) => d.value).join(','),
    };
    if (sorter.length > 0) {
      targetQuery = {
        ...targetQuery,
        sortList: sorter
          .filter((d) => !!d.value)
          .map((d) => `${d.key}@${d.value}`)
          .join(','),
      };
    }
    if (date.length > 0) {
      targetQuery = {
        ...targetQuery,
        startTime: `${date[0].value[0]}`,
        endTime: `${date[0].value[1]}`,
        monthOrWeek: date[0].monthOrWeek,
        timeText: date[0].text,
      };
    }

    _.reportQuery = targetQuery;
    return targetQuery;
  },
});

export default {
  name: '管理者报表',
  mixins: [listMixin, commonMixin, formatMixin],
  components: {
    ReportOverview,
    ReportRank,
    ReportTime,
    ReportClue,
    ReportSelectionBusiness,
    ManagerReportSalesman,
    ReportCustomer,
    Report,
    ReportProject,
  },
  data() {
    return {
      reportQuery: {},
      activeTab: 'report-overview',
    };
  },
};
</script>
