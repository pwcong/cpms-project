<template>
  <list-layout class="manager-report">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="管理者报表" left-text="返回" left-arrow @click-left="handleCancel" />
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div class="toolbar">
          <div class="filter">
            <van-button size="small" style="width: 100%" icon="arrow-down" @click="showDate = true">
              {{ query.date.text || '选择时间范围' }}
            </van-button>
            <van-button
              size="small"
              @click="showBusinessCenter = true"
              style="margin-left: 8px; width: 100%"
              icon="arrow-down"
            >
              {{ businessCenterQuantity ? '已选商务中心 ' + businessCenterQuantity + ' 个' : '选择商务中心' }}
            </van-button>
          </div>
          <filter-trigger :value="query.filter" @click="handelFiletr" />
        </div>
        <van-tabs class="tabs" v-model="activeTab">
          <van-tab name="overview" title="概览" />
          <van-tab name="rank" title="排行榜" />
          <van-tab name="clue" title="线索" />
          <van-tab name="customr" title="客户" />
          <van-tab name="project" title="项目" />
          <van-tab name="salesman" title="业务员" />

          <!-- <van-tab name="order" title="订单" /> -->
        </van-tabs>
      </div>
    </template>
    <template v-slot:main="{ className }">
      <div :class="className" style="top: 144px; height: calc(100vh - 144px); overflow-y: auto">
        <report-overview v-if="activeTab === 'overview'" :date="query.date" :reportQuery="reportQuery" />
        <report-rank v-if="activeTab === 'rank'" :date="query.date" :reportQuery="reportQuery" />
        <report-customer v-if="activeTab === 'customr'" :date="query.date" :reportQuery="reportQuery" />
        <report-project v-if="activeTab === 'project'" :date="query.date" :reportQuery="reportQuery" />
        <report-salesman v-if="activeTab === 'salesman'" :date="query.date" :reportQuery="reportQuery" />
        <report-clue v-if="activeTab === 'clue'" :date="query.date" :reportQuery="reportQuery" />
        <report-order v-if="activeTab === 'order'" :reportQuery="query" />
      </div>
    </template>
    <report-selection-business
      multiple
      :visible.sync="showBusinessCenter"
      title="选择商务中心"
      searchable
      v-model="query.businessCenter"
      @change="change"
    />

    <van-popup v-model="showDate" position="bottom">
      <picker-calendar show-toolbar title="选择时间范围" @confirm="handleChangeDate" @cancel="showDate = false" />
    </van-popup>
    <salesman-report-filter v-if="activeTab === 'salesman'" v-model="query.filter" :visible.sync="showFilter" />
  </list-layout>
</template>

<script>
import omit from 'omit.js';
import { buildListMixin, formatMixin } from '@/mixins';

import api from '@/api';
import SalesmanReportFilter, { convertFilter2Query } from '../components/filter/manager-report-salesman';
import dayjs from 'dayjs';
import ReportOverview from './report-overview';
import ReportRank from './report-rank';
import ReportCustomer from './report-customer';
import ReportProject from './report-project';
import ReportSalesman from './report-salesman';
import ReportOrder from './report-order';
import ReportClue from './report-clue';
import ReportSelectionBusiness from '../components/selection/report-business';
import PickerCalendar, { CALENDAR_OPTIONS } from '@/views/components/picker/calendar';

const listMixin = buildListMixin({
  properties: [
    {
      key: 'filter',
      value: {},
    },
    {
      key: 'date',
      value: CALENDAR_OPTIONS[0],
    },
    {
      key: 'businessCenter',
      value: [],
    },
  ],
  getQuery: (_, query) => {
    const { businessCenter = [], date = {} } = query;

    let targetQuery = {
      ...omit(query, ['filter']),
      ...convertFilter2Query(query.filter),
      businessCenter: businessCenter.map((d) => d.value).join(','),
    };

    if (!!date.value) {
      targetQuery = {
        ...targetQuery,
        startTime: date.value.split(',')[0],
        endTime: date.value.split(',')[1],
        monthOrWeek: date.monthOrWeek,
        timeText: date.text,
      };
    }

    _.reportQuery = { ...targetQuery };
    return targetQuery;
  },
  getData: async (_, query) => {
    return Promise.resolve({
      data: [],
    });
  },
});

export default {
  mixins: [listMixin, formatMixin],
  components: {
    SalesmanReportFilter,
    ReportOverview,
    ReportRank,
    ReportCustomer,
    ReportProject,
    ReportSalesman,
    ReportOrder,
    ReportSelectionBusiness,
    PickerCalendar,
    ReportClue,
  },
  data() {
    return {
      showFilter: false,
      time: '',
      showBusinessCenter: false,
      showDate: false,
      reportQuery: {},
      activeTab: 'overview',
      businessCenter: '',
      businessCenterQuantity: 0,
    };
  },
  methods: {
    handleCancel() {
      this.$root.goBack();
    },
    handleChangeDate(res) {
      this.query.date = res;
      this.showDate = false;
    },
    change(res) {
      this.businessCenterQuantity = res.length;
      this.businessCenter = res;
    },
    handelFiletr() {
      if (this.activeTab === 'salesman') {
        this.showFilter = true;
      } else {
        this.showFilter = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.manager-report {
  .list-layout-toolbar {
    .toolbar {
      display: flex;
      align-items: center;
      background-color: white;
      .filter {
        flex: 1;
        display: flex;
        align-items: center;
        padding: 0 8px;
        // justify-content: space-around;
      }
    }
    // .tabs /deep/ .van-tabs__nav {
    //   margin: 0;
    // }
  }

  .main {
    padding: 14px;
    background-color: white;
    /deep/ .van-tabs__nav--card {
      margin: 0;
    }
  }
}
</style>
