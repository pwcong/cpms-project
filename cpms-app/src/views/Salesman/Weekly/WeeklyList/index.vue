<template>
  <list-layout class="weekly-list">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="周报列表"
        left-text="返回"
        left-arrow
        right-text="新建"
        @click-left="handleCancel(false)"
        @click-right="handleCreate"
      />
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div>
          <span>时间范围: </span>
          <!-- <span class="select-date">{{
            query.fdBeginTimeParam.format('YYYY-MM-DD')
          }}</span>
          <span> 至 </span>
          <span class="select-date">{{
            query.fdEndTimeParam.format('YYYY-MM-DD')
          }}</span> -->
          <!-- <span class="select-date">{{
            query.fdVisitPlanBeginTimeParam.format('YYYY-MM-DD')
          }}</span> -->
          <span @click="showStartYear = true" class="select-date">
            {{ query.startYear }}
          </span>
          <span> 年第 </span>
          <span @click="showStartWeek = true" class="select-date">
            {{ query.startWeek }}
          </span>
          <span> 周至 </span>
          <span @click="showEndYear = true" class="select-date">
            {{ query.endYear }}
          </span>
          <span> 年第 </span>
          <span @click="showEndWeek = true" class="select-date">
            {{ query.endWeek }}
          </span>
          <span> 周 </span>
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
              <van-cell-group>
                <weekly-item :value="item" />
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

    <van-popup v-model="showStartYear" position="bottom">
      <picker-year
        show-toolbar
        title="选择开始年"
        @confirm="handleChangeYear($event, 'start')"
        @cancel="showStartYear = false"
      />
    </van-popup>
    <van-popup v-model="showStartWeek" position="bottom">
      <picker-week
        :year="query.year"
        show-toolbar
        title="选择开始周"
        @confirm="handleChangeWeek($event, 'start')"
        @cancel="showStartWeek = false"
      />
    </van-popup>

    <van-popup v-model="showEndYear" position="bottom">
      <picker-year
        show-toolbar
        title="选择结束年"
        @confirm="handleChangeYear($event, 'end')"
        @cancel="showEndYear = false"
      />
    </van-popup>
    <van-popup v-model="showEndWeek" position="bottom">
      <picker-week
        :year="query.year"
        show-toolbar
        title="选择结束周"
        @confirm="handleChangeWeek($event, 'end')"
        @cancel="showEndWeek = false"
      />
    </van-popup>
  </list-layout>
</template>

<script>
import api from '@/api';
import dayjs from 'dayjs';
import { buildListMixin, userMixin } from '@/mixins';
import WeeklyItem from './item';
import PickerYear from '@/views/components/picker/year';
import PickerWeek from '@/views/components/picker/week';
import formMixin from '../WeeklyEdit/form';
import { getWeekOfDate, getWeeksOfYear } from '@/utils/date';

const now = dayjs();
const { weekNumber } = getWeekOfDate(now);

const listMixin = buildListMixin({
  properties: [
    {
      key: 'fdBeginTimeParam',
      value: dayjs().startOf('M'),
    },
    {
      key: 'fdEndTimeParam',
      value: dayjs().endOf('M'),
    },
    { key: 'startYear', value: `${now.year()}` },
    { key: 'startWeek', value: `${weekNumber + 1}` },
    { key: 'endYear', value: `${now.year()}` },
    { key: 'endWeek', value: `${weekNumber + 1}` },
  ],
  getQuery: (_, query) => {
    const { startYear, startWeek, endYear, endWeek } = query;

    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      // fdBeginTimeParam: `${query.fdBeginTimeParam.format(
      //   'YYYY-MM-DD'
      // )} 00:00:00`,
      // fdEndTimeParam: `${query.fdEndTimeParam.format('YYYY-MM-DD')} 23:59:59`,
    };

    if (!!startYear && !!startWeek && !!endYear && !!endWeek) {
      const startWeeks = getWeeksOfYear(parseInt(startYear));
      const currentStartWeek = startWeeks[parseInt(startWeek) - 1];
      const endWeeks = getWeeksOfYear(parseInt(endYear));
      const currentEndWeek = endWeeks[parseInt(endWeek) - 1];
      targetQuery = {
        ...targetQuery,
        fdBeginTimeParam: `${currentStartWeek.start.format('YYYY-MM-DD')} 00:00:00`,
        fdEndTimeParam: `${currentEndWeek.end.format('YYYY-MM-DD')} 23:59:59`,
      };
    }

    return targetQuery;
  },
  getData: (_, query) => {
    return api.salesman.getWeeklyList(query);
  },
});
export default {
  name: 'WeeklyList',
  mixins: [formMixin, listMixin, userMixin],
  components: {
    WeeklyItem,
    PickerYear,
    PickerWeek,
  },
  data() {
    return {
      showDate: false,
      CALENDAR_MIN_DATE: new Date(2000, 0, 1),
      CALENDAR_MAX_DATE: new Date(dayjs().year() + 10, 11, 31),
      showStartYear: false,
      showStartWeek: false,
      showEndYear: false,
      showEndWeek: false,
    };
  },
  methods: {
    handleChangeDate(v) {
      this.query = {
        ...this.query,
        fdBeginTimeParam: dayjs(v[0]),
        fdEndTimeParam: dayjs(v[1]),
      };
      this.showDate = false;
    },
    handleChangeYear(res, mode) {
      const year = res.value;
      let { startYear, startWeek, endYear, endWeek } = this.query;

      if (mode === 'start') {
        startWeek = '1';
        startYear = year;
        if (year > endYear) {
          endYear = startYear;
          endWeek = startWeek;
        }
      } else if (mode === 'end') {
        endYear = year;
        endWeek = '1';
        if (endYear < startYear) {
          startYear = endYear;
          startWeek = endWeek;
        }
      }
      this.showStartYear = false;
      this.showEndYear = false;
      this.query = {
        ...this.query,
        startYear,
        startWeek,
        endYear,
        endWeek,
      };
    },
    handleChangeWeek(res, mode) {
      const week = res.value;
      let { startWeek, endWeek } = this.query;
      if (mode === 'start') {
        startWeek = week;
        if (startWeek > endWeek) {
          endWeek = startWeek;
        }
      } else if (mode === 'end') {
        endWeek = week;
        if (endWeek < startWeek) {
          startWeek = endWeek;
        }
      }
      this.showStartWeek = false;
      this.showEndWeek = false;
      this.query = {
        ...this.query,
        startWeek,
        endWeek,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.weekly-list {
  .list-layout-toolbar {
    height: 54px;
    line-height: 54px;
    background-color: white;
    padding: 0 12px;
    font-size: 12px;
    color: #666666;
    display: flex;
    .select-date {
      font-size: 15px;
      margin: 0 4px;
      color: $theme-color;
      font-weight: bold;
    }
  }
}
</style>
