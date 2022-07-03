<template>
  <div class="report-rank">
    <block theme="card">
      <block>
        <div style="font-size: 12px; color: #999999; text-align: center; padding-top: 5px">
          统计日期: {{ formatDateRange(date.value) }}
        </div>
        <van-skeleton style="margin: 16px 0" :row="5" v-show="loading"></van-skeleton>
        <div v-show="!loading">
          <data-grid
            theme="report"
            style="margin-top: 4px; border: 0"
            :getStyle="() => ({ value: 'font-size: 14px;', title: 'color: #00b050; font-size: 12px' })"
            :value="[
              {
                key: 'clueSum',
                title: '线索总数',
                value: report.clueSum + '个' || '0',
              },
              {
                key: 'transferredNum',
                title: '线索已转化',
                value: report.transferredNum + '个' || '0',
              },
              {
                key: 'changeRate',
                title: '线索转化率',
                value: report.changeRate + '%' || '0',
              },
            ]"
          >
            <template v-slot:title="{ item }">
              <span v-if="item.key === 'changeRate'">
                <span style="color: #fac857">
                  {{ item.title }}
                </span>
              </span>
              <span v-else-if="item.key === 'clueSum'">
                <span style="color: #50c5ef">
                  {{ item.title }}
                </span>
              </span>
              <span v-else>
                <span style="color: #00b050">
                  {{ item.title }}
                </span>
              </span>
            </template>
            <template v-slot:changeRate="{ item }">
              <span
                :style="{
                  color: '#fac857',
                }"
              >
                {{ item.value }}
              </span>
            </template>
            <template v-slot:clueSum="{ item }">
              <span
                :style="{
                  color: '#50c5ef',
                }"
              >
                {{ item.value }}
              </span>
            </template>
          </data-grid>
          <data-grid
            theme="report"
            style="margin-top: 4px; border: 0"
            :getStyle="() => ({ value: 'font-size: 14px;', title: 'color: #00b050; font-size: 12px' })"
            :value="[
              {
                key: 'newAdditionsNum',
                title: date.text + '线索新增数量',
                value: report.newAdditionsNum + '个' || '0',
              },
              {
                key: 'pending',
                title: '线索待处理数量',
                value: report.pending + '个' || '0',
              },
              {
                key: 'effectiveFollow',
                title: date.text + '线索有效跟进数量',
                value: report.effectiveFollow + '条' || '0',
              },
            ]"
          >
          </data-grid>
        </div>
      </block>
    </block>
    <block theme="card" style="margin-top: 8px">
      <block>
        <template slot="title">
          <div>线索状态分布</div>
          <div style="font-size: 12px; color: #999999">{{ formatDateRange(date.value) }}</div>
        </template>

        <div style="margin-top: 8px">
          <tabs-layout
            theme="swiper"
            :tabs="[
              { key: 'clue-state-new', title: '新增' },
              { key: 'clue-state-aggregate', title: '统计' },
            ]"
          >
            <template>
              <clue-state-new slot="clue-state-new" :reportQuery="reportQuery"></clue-state-new>
              <clue-state-aggregate slot="clue-state-aggregate" :reportQuery="reportQuery"></clue-state-aggregate>
            </template>
          </tabs-layout>
        </div>
      </block>
    </block>

    <block theme="card" style="margin-top: 8px">
      <block>
        <template slot="title">
          <div>线索商务中心分布</div>
          <div style="font-size: 12px; color: #999999">{{ formatDateRange(date.value) }}</div>
        </template>
        <div style="margin-top: 8px">
          <tabs-layout
            theme="swiper"
            :tabs="[
              { key: 'clue-businessCenter-todo', title: '待处理' },
              { key: 'clue-businessCenter-follow', title: '跟进中' },
              { key: 'clue-businessCenter-changing', title: '转化中' },
              { key: 'clue-businessCenter-changed', title: '已转化' },
              { key: 'clue-businessCenter-discard', title: '废弃' },
            ]"
          >
            <template>
              <clue-businessCenter-todo
                slot="clue-businessCenter-todo"
                :reportQuery="reportQuery"
              ></clue-businessCenter-todo>
              <clue-businessCenter-follow
                slot="clue-businessCenter-follow"
                :reportQuery="reportQuery"
              ></clue-businessCenter-follow>
              <clue-businessCenter-changing
                slot="clue-businessCenter-changing"
                :reportQuery="reportQuery"
              ></clue-businessCenter-changing>
              <clue-businessCenter-changed
                slot="clue-businessCenter-changed"
                :reportQuery="reportQuery"
              ></clue-businessCenter-changed>
              <clue-businessCenter-discard
                slot="clue-businessCenter-discard"
                :reportQuery="reportQuery"
              ></clue-businessCenter-discard>
            </template>
          </tabs-layout>
        </div>
      </block>
    </block>
  </div>
</template>

<script>
import api from '@/api';
import { buildListMixin } from '@/mixins';
import reportMixin from '../mixins/report';
import clueStateNew from '../components/report/clue-state-new';
import clueStateAggregate from '../components/report/clue-state-aggregate';
import clueBusinessCenterTodo from '../components/report/clue-businessCenter-todo';
import clueBusinessCenterFollow from '../components/report/clue-businessCenter-follow';
import clueBusinessCenterDraft from '../components/report/clue-businessCenter-draft';
import clueBusinessCenterDiscard from '../components/report/clue-businessCenter-discard';
import clueBusinessCenterChanging from '../components/report/clue-businessCenter-changing';
import clueBusinessCenterChanged from '../components/report/clue-businessCenter-changed';
const reqMixin = buildListMixin({
  relation: ['reportQuery'],
  getData: async (_) => {
    const { reportQuery } = _;
    const value = await api.report
      .getClueReport({
        endTime: reportQuery.endTime,
        startTime: reportQuery.startTime,
        monthOrWeek: reportQuery.monthOrWeek,
        businessCenter: reportQuery.businessCenter ? reportQuery.businessCenter : '',
      })
      .then((res) => {
        return res;
      });
    _.report = {
      effectiveFollow: value.data.effectiveFollow,
      clueSum: value.data.clueSum,
      pending: value.data.pending,
      riseOrDecline: value.data.riseOrDecline,
      chainRatio: value.data.chainRatio,
      transferredNum: value.data.transferredNum,
      firstMonthNewAdditionsNum: value.data.firstMonthNewAdditionsNum,
      newAdditionsNum: value.data.newAdditionsNum,
      changeRate: value.data.changeRate,
    };

    return Promise.resolve({
      data: [],
    });
  },
});
export default {
  mixins: [reportMixin, reqMixin],
  props: {
    date: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    clueStateNew,
    clueStateAggregate,
    clueBusinessCenterTodo,
    clueBusinessCenterFollow,
    clueBusinessCenterDraft,
    clueBusinessCenterDiscard,
    clueBusinessCenterChanging,
    clueBusinessCenterChanged,
  },
  data() {
    return {
      report: {
        effectiveFollow: 0,
        clueSum: 0,
        pending: 0,
        riseOrDecline: 0,
        chainRatio: 0,
        transferredNum: 0,
        firstMonthNewAdditionsNum: 0,
        newAdditionsNum: 0,
        changeRate: 0,
      },
    };
  },
  methods: {
    handleClientSort(value) {
      this.clientSort = value;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.report-rank {
  padding: 8px;
  .report-action {
    display: flex;
    align-items: center;
    font-size: 20px;
    color: #666666;
    .van-icon {
      margin-left: 8px;

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
