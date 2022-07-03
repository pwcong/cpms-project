<template>
  <list-layout class="page-visit-list">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="拜访" left-text="返回" left-arrow @click-left="handleCancel" />v
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div class="toolbar">
          <div class="first-search">
            <span>拜访日期: </span>
            <!-- <span class="select-date">{{
            query.fdVisitPlanBeginTimeParam.format('YYYY-MM-DD')
          }}</span> -->
            <span @click="showYear = true" class="select-date">
              {{ query.year }}
            </span>
            <span> 年第 </span>
            <!-- <span class="select-date">
            {{ query.fdVisitPlanEndTimeParam.format('YYYY-MM-DD') }}
          </span> -->
            <span @click="showWeek = true" class="select-date">
              {{ query.week }}
            </span>
            <span> 周 </span>
          </div>
          <filter-trigger :value="query.filter" @click="showFilter = true" />
        </div>
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
              <visit-item :value="item" />
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

    <van-popup v-model="showYear" position="bottom">
      <picker-year show-toolbar title="选择年" @confirm="handleSelectYear" @cancel="showYear = false" />
    </van-popup>
    <van-popup v-model="showWeek" position="bottom">
      <picker-week
        :year="query.year"
        show-toolbar
        title="选择周"
        @confirm="handleSelectWeek"
        @cancel="showWeek = false"
      />
    </van-popup>
    <visit-filter v-model="query.filter" :visible.sync="showFilter" />
  </list-layout>
</template>

<script>
import api from '@/api';
import dayjs from 'dayjs';
import VisitItem from './item';
import { buildListMixin, userMixin } from '@/mixins';
import formMixin from '@/views/Salesman/Visit/VisitEdit/form';
import { getWeekOfDate, getWeeksOfYear } from '@/utils/date';
import PickerYear from '@/views/components/picker/year';
import PickerWeek from '@/views/components/picker/week';
import VisitFilter, { convertFilter2Query } from '@/views/Admin/ModuleManage/components/filter/visitlist';
const now = dayjs();
const { weekNumber } = getWeekOfDate(now);

const listMixin = buildListMixin({
  properties: [
    {
      key: 'fdVisitPlanBeginTimeParam',
      value: dayjs().startOf('M'),
    },
    {
      key: 'fdVisitPlanEndTimeParam',
      value: dayjs().endOf('M'),
    },
    { key: 'year', value: `${now.year()}` },
    { key: 'week', value: `${weekNumber + 1}` },
    {
      key: 'filter',
      value: {},
    },
  ],
  getQuery: (_, query) => {
    const { year, week } = query;

    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      ...convertFilter2Query(query.filter),
      // fdVisitPlanBeginTimeParam: `${query.fdVisitPlanBeginTimeParam.format(
      //   'YYYY-MM-DD'
      // )} 00:00:00`,
      // fdVisitPlanEndTimeParam: `${query.fdVisitPlanEndTimeParam.format(
      //   'YYYY-MM-DD'
      // )} 23:59:59`,
    };

    if (!!year && !!week) {
      const weeks = getWeeksOfYear(parseInt(year));
      const currentWeek = weeks[parseInt(week) - 1];
      targetQuery = {
        ...targetQuery,
        fdVisitPlanBeginTimeParam: `${currentWeek.start.format('YYYY-MM-DD')} 00:00:00`,
        fdVisitPlanEndTimeParam: `${currentWeek.end.format('YYYY-MM-DD')} 23:59:59`,
      };
    }

    return targetQuery;
  },
  getData: (_, query) => {
    return api.salesman.getAllVisitByIdList(query);
  },
});
export default {
  name: 'VisitList',
  mixins: [formMixin, listMixin, userMixin],
  components: {
    VisitItem,
    PickerWeek,
    PickerYear,
    VisitFilter,
  },
  data() {
    return {
      showYear: false,
      showWeek: false,
      showDate: false,
      CALENDAR_MIN_DATE: new Date(2000, 0, 1),
      CALENDAR_MAX_DATE: new Date(dayjs().year() + 10, 11, 31),
      showFilter: false,
    };
  },
  methods: {
    handleSelectYear(res) {
      this.query.year = res.value;
      this.query.week = '1';
      this.showYear = false;
    },
    handleSelectWeek(res) {
      this.query.week = res.value;
      this.showWeek = false;
    },

    handleChangeDate(v) {
      this.query = {
        ...this.query,
        fdVisitPlanBeginTimeParam: dayjs(v[0]),
        fdVisitPlanEndTimeParam: dayjs(v[1]),
      };
      this.showDate = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.page-visit-list {
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
  .toolbar {
    display: flex;
    align-items: center;
    width: 100%;
    .first-search {
      flex: 1;
    }
  }
}
</style>
