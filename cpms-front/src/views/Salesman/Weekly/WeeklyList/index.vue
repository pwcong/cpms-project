<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>业务员管理</p-breadcrumb-item>
            <p-breadcrumb-item>周报管理</p-breadcrumb-item>
            <p-breadcrumb-item>周报列表</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action>
          <p-button type="primary" @click="handleCreate">新建</p-button>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div style="margin-top: 16px" :class="className">
        <p-switch-form :col="3">
          <p-switch-form-item label="开始周">
            <!-- <p-range-picker v-model="query.date" /> -->
            <div style="display: flex">
              <select-year
                :value="!!query.startYear ? [{ value: query.startYear }] : []"
                placeholder="请选择年"
                @change="handleChangeYear($event, 'start')"
              />
              <select-week
                style="margin-left: 8px"
                :year="query.startYear"
                :value="!!query.startWeek ? [{ value: query.startWeek }] : []"
                placeholder="请选择周"
                @change="handleChangeWeek($event, 'start')"
              />
            </div>
          </p-switch-form-item>
          <p-switch-form-item label="结束周">
            <div style="display: flex">
              <select-year
                :value="!!query.endYear ? [{ value: query.endYear }] : []"
                placeholder="请选择年"
                @change="handleChangeYear($event, 'end')"
              />
              <select-week
                style="margin-left: 8px"
                :year="query.endYear"
                :value="!!query.endWeek ? [{ value: query.endWeek }] : []"
                placeholder="请选择周"
                @change="handleChangeWeek($event, 'end')"
              />
            </div>
          </p-switch-form-item>
          <p-switch-form-item label="审核状态">
            <select-weekly-status
              v-model="query.status"
              placeholder="请选择"
              multiple
              allow-clear
            />
          </p-switch-form-item>
          <template slot="button">
            <!-- <download-wrapper
              url="/api/cpms/spersonWeekly/export"
              :query="reportQuery"
              :title="reportTitle"
            >
              <p-button type="primary">导出周报报表</p-button>
            </download-wrapper>
            <download-wrapper
              url="/api/cpms/spersonWeeklySalesList/export"
              :query="reportQuery"
              :title="reportTitleSell"
            >
              <p-button type="primary">导出销售任务报表</p-button>
            </download-wrapper>
            <download-wrapper
              url="/api/cpms/spersonWeeklySelfList/export"
              :query="reportQuery"
              :title="reportTitlePersonage"
            >
              <p-button type="primary">导出个人销售报表</p-button>
            </download-wrapper> -->
            <p-popover placement="bottomLeft" trigger="click">
              <template slot="content">
                <table-hider v-model="propertiesMeta" />
              </template>
              <p-button type="primary" icon="filter" />
            </p-popover>
            <p-button type="primary" @click="onRefresh(false)" icon="search" />
          </template>
        </p-switch-form>
      </div>
    </template>
    <template v-slot:main="{ className }">
      <div :class="className">
        <p-table
          :scroll="{ x: true }"
          rowKey="id"
          :loading="loading"
          :columns="propertiesWithMeta"
          :data-source="list"
          bordered
          :pagination="{
            current: pageNo,
            pageSize: pageSize,
            total: totalSize,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '30', '50'],
            showTotal: (total) => `共有 ${total} 条数据`,
          }"
          @change="handleList"
        >
          <!-- customRender: (text, record) => _.formatStatus(record.fdStatus), -->
          <template slot="fdStatus" slot-scope="text, record">
            <status-tag :status="record.fdStatus">
              {{ formatStatus(record.fdStatus) }}
            </status-tag>
          </template>

          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDetail(record.id)">详情</p-button-link>
              <p-button-link
                @click="handleEdit(record.id)"
                v-if="record.fdStatus == 'draft' || record.fdStatus == 'reject'"
              >
                编辑
              </p-button-link>
            </span>
          </template>
        </p-table>
      </div>
    </template>
  </list-layout>
</template>

<script>
import { buildListMixin, formatMixin } from '@/mixins';
import api from '@/api';
import SelectYear from '../../components/select/year';
import SelectWeek from '../../components/select/week';
import dayjs from 'dayjs';
import { getWeekOfDate, getWeeksOfYear } from '@/utils/date';
import SelectWeeklyStatus from '../../components/select/weekly-status';
import { buildTable4ListMixin } from '@/views/mixins';
import formMixin from '../WeeklyEdit/form';

const now = dayjs();
const { weekNumber } = getWeekOfDate(now);

const listMixin = buildListMixin({
  properties: [
    { key: 'sorter', value: [] },
    { key: 'date', value: [] },
    { key: 'status', value: [] },
    { key: 'startYear', value: `${now.year()}` },
    { key: 'startWeek', value: `${weekNumber + 1}` },
    { key: 'endYear', value: `${now.year()}` },
    { key: 'endWeek', value: `${weekNumber + 1}` },
  ],
  getQuery: (_, query) => {
    const {
      sorter = [],
      date = [],
      status = [],
      startYear,
      startWeek,
      endYear,
      endWeek,
    } = query;
    let statusArr = status.map((v) => v.value);
    let targetQuery = {
      keyword: query.keyword,
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdStatus: statusArr.join(','),
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
        fdBeginTimeParam: `${date[0].format('YYYY-MM-DD')} 00:00:00`,
        fdEndTimeParam: `${date[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }

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
    _.reportQuery = targetQuery;
    return targetQuery;
  },
  getData: (_, query) => {
    return api.salesman.getWeeklyList(query);
  },
});
const tableMixin = buildTable4ListMixin({
  sorterMap: {
    title: ['fdYear', 'fdWeek'],
  },
  getProperties: (_) => {
    return [
      {
        title: '序号',
        dataIndex: 'index',
        width: 50,
        fixed: 'left',
        customRender: (text, record, index) => `${index + 1}`,
      },

      {
        title: '周报名称',
        dataIndex: 'title',
        sorter: true,
        hider: true,
        customRender: (text, record) => `${record.fdYear} 年第 ${record.fdWeek} 周周报`,
      },
      {
        title: '本周重点工作',
        sorter: true,
        hider: true,
        dataIndex: 'fdMonthPerformance',
      },
      {
        title: '重大项目进展',
        sorter: true,
        hider: true,
        dataIndex: 'fdProjectProgress',
      },
      {
        title: '本周目标达成',
        sorter: true,
        hider: true,
        dataIndex: 'fdWeeklySituation',
      },
      {
        title: '所需支持',
        sorter: true,
        hider: true,
        dataIndex: 'fdNeedHelp',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        hider: true,
        customRender: (text, record) => _.formatDateTime(record.createTime),
      },
      {
        title: '审核状态',
        dataIndex: 'fdStatus',
        hider: true,
        align: 'center',
        width: 100,
        fixed: 'right',
        scopedSlots: {
          customRender: 'fdStatus',
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: 120,
        fixed: 'right',
        scopedSlots: {
          customRender: 'operation',
        },
      },
    ];
  },
});

export default {
  name: '周报列表',
  computed: {
    reportTitle() {
      // !!startYear && !!startWeek && !!endYear && !!endWeek
      const { startYear = '', startWeek = '', endYear = '', endWeek = '' } = this.query;
      if (!!startYear && !!startWeek && !!endYear && !!endWeek) {
        const startWeeks = getWeeksOfYear(parseInt(startYear));
        const currentStartWeek = startWeeks[parseInt(startWeek) - 1];
        const endWeeks = getWeeksOfYear(parseInt(endYear));
        const currentEndWeek = endWeeks[parseInt(endWeek) - 1];
        return `${`${currentStartWeek.start.format(
          'YYYY-MM-DD'
        )}到${currentEndWeek.end.format('YYYY-MM-DD')}的`}周报报表.xlsx`;
      } else {
        return `周报报表.xlsx`;
      }
    },
    reportTitleSell() {
      return `销售任务达成报表.xlsx`;
    },
    reportTitlePersonage() {
      return `个人销售达成报表.xlsx`;
    },
  },
  mixins: [formMixin, listMixin, formatMixin, tableMixin],
  data() {
    return {
      reportQuery: {},
    };
  },
  components: {
    SelectYear,
    SelectWeek,
    SelectWeeklyStatus,
  },
  methods: {
    handleChangeYear(res, mode) {
      const year = res[0].value;
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

      this.query = {
        ...this.query,
        startYear,
        startWeek,
        endYear,
        endWeek,
      };
    },
    handleChangeWeek(res, mode) {
      const week = res[0].value;
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
      this.query = {
        ...this.query,
        startWeek,
        endWeek,
      };
    },
    formatStatus(v) {
      switch (v) {
        case 'draft':
          return '暂存';
        case 'todo':
          return '待审批';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '驳回';
        default:
          return v;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
