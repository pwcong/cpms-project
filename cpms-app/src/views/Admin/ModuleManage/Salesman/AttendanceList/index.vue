<template>
  <list-layout class="page-clock-list">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="考勤" left-text="返回" left-arrow @click-left="handleCancel" />
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div @click="showDate = true">
          <span>打卡日期: </span>
          <span class="select-date">{{ query.startTime.format('YYYY-MM-DD') }}</span>
          <span> 至 </span>
          <span class="select-date">{{ query.endTime.format('YYYY-MM-DD') }}</span>
        </div>
        <filter-trigger :value="query.filter" @click="showFilter = true" />
      </div>
    </template>

    <template v-slot:main="{ className }">
      <van-pull-refresh
        style="top: 100px; height: calc(100vh - 100px)"
        :class="className"
        :value="loading && !loadingMore"
        @refresh="onRefresh"
      >
        <van-list :value="loadingMore" :finished="!hasMore" finished-text="没有更多了" @load="onLoadMore">
          <card-list :data="list">
            <template v-slot="{ item }">
              <van-cell-group>
                <clock-item :value="item" />
              </van-cell-group>
            </template>
          </card-list>
        </van-list>
      </van-pull-refresh>
    </template>

    <van-calendar
      :max-date="CALENDAR_MAX_DATE"
      :min-date="CALENDAR_MIN_DATE"
      v-model="showDate"
      type="range"
      @confirm="handleChangeDate"
    />
    <attendance-filter v-model="query.filter" :visible.sync="showFilter" />
  </list-layout>
</template>

<script>
import dayjs from 'dayjs';

import api from '@/api';
import ClockItem from './item';
import { buildListMixin, userMixin } from '@/mixins';
import attendanceFilter, { convertFilter2Query } from '@/views/Admin/ModuleManage/components/filter/AttendanceList';
const listMixin = buildListMixin({
  properties: [
    {
      key: 'startTime',
      value: dayjs().startOf('M'),
    },
    {
      key: 'endTime',
      value: dayjs().endOf('M'),
    },
  ],
  getQuery: (_, query) => ({
    ...query,
    limit: query.pageSize,

    startTime: `${query.startTime.format('YYYY-MM-DD')} 00:00:00`,
    endTime: `${query.endTime.format('YYYY-MM-DD')} 23:59:59`,
    ...convertFilter2Query(query.filter),
  }),
  getData: (_, query) => {
    return api.salesman.getAllClockList(query);
  },
});
export default {
  name: 'ClockList',
  mixins: [listMixin, userMixin],
  components: {
    ClockItem,
    attendanceFilter,
  },
  data() {
    return {
      showDate: false,
      CALENDAR_MIN_DATE: new Date(2000, 0, 1),
      CALENDAR_MAX_DATE: new Date(dayjs().year() + 10, 11, 31),
      showFilter: false,
    };
  },

  methods: {
    handleCancel() {
      this.$root.goBack();
    },
    handleChangeDate(v) {
      this.query = {
        ...this.query,
        startTime: dayjs(v[0]),
        endTime: dayjs(v[1]),
      };
      this.showDate = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.page-clock-list {
  .list-layout-toolbar {
    height: 54px;
    line-height: 54px;
    background-color: white;
    padding: 0 12px;
    font-size: 15px;
    color: #666666;
    display: flex;
    .select-date {
      margin: 0 4px;
      color: $theme-color;
      font-weight: bold;
    }
  }
}
</style>
