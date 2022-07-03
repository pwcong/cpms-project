<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>业务员管理</p-breadcrumb-item>
            <p-breadcrumb-item>拜访管理</p-breadcrumb-item>
            <p-breadcrumb-item>拜访计划</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action>
          <p-button type="primary" @click="handleCreate">新建</p-button>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="拜访时间">
            <!-- <p-range-picker v-model="query.date" /> -->
            <div style="display: flex">
              <select-year
                style="flex: 1"
                :value="!!query.year ? [{ value: query.year }] : []"
                placeholder="请选择年"
                @change="(query.year = $event[0].value) && (query.week = '1')"
              />
              <select-week
                style="flex: 1; margin-left: 8px"
                :year="query.year"
                :value="!!query.week ? [{ value: query.week }] : []"
                placeholder="请选择周"
                @change="query.week = $event[0].value"
              />
            </div>
          </p-switch-form-item>

          <p-switch-form-item label="拜访人">
            <p-input v-model="query.fdVisitName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="拜访名称">
            <p-input v-model="query.fdModuleType" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="拜访地址">
            <p-input v-model="query.fdVisitAddress" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="拜访类型">
            <select-dict
              v-model="query.fdVisitType"
              dictCode="cpms_visit_type"
              systemCode="cpms"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
          <p-switch-form-item label="状态">
            <select-visit-status
              placeholder="请选择"
              v-model="query.fdStatus"
              allow-clear
            />
          </p-switch-form-item>

          <template slot="button">
            <!-- <download-wrapper
              url="/api/cpms/spersonVisitMain/export"
              :query="reportQuery"
              :title="reportTitle"
            >
              <p-button type="primary">导出拜访报表</p-button>
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
      <div :class="className" style="margin-top: 16px">
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
          <template slot="fdVisitType" slot-scope="text, record">
            <dict-text
              dictCode="cpms_visit_type"
              systemCode="cpms"
              :value="(record.fdVisitType || '').split(',')"
            />
          </template>
          <template slot="fdStatus" slot-scope="text, record">
            <status-tag :status="record.fdStatus">
              {{ text | foramtStatus }}
            </status-tag>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDetail(record.id)"> 详情 </p-button-link>
              <p-button-link @click="handleEdit(record.id)" v-if="checkAllowEdit(record)">
                编辑
              </p-button-link>

              <template>
                <p-button-link
                  @click="handleFeedback(record, true)"
                  v-if="record.fdFeedbackCount > 0 && checkAllowFeedback(record)"
                >
                  编辑拜访反馈
                </p-button-link>
                <p-button-link
                  @click="handleFeedback(record)"
                  v-else-if="checkAllowFeedback(record)"
                >
                  新建拜访反馈
                </p-button-link>
                <!-- <p-button-link
                  v-if="record.fdStatus === 'draft'"
                  @click="handleDel(record.id)"
                  >删除
                </p-button-link> -->
              </template>
            </span>
          </template>
        </p-table>
      </div>
    </template>
  </list-layout>
</template>

<script>
import formMixin from '../VisitEdit/form';
import { buildListMixin, formatMixin } from '@/mixins';
import api from '@/api';
import SelectYear from '../../components/select/year';
import SelectWeek from '../../components/select/week';
import SelectVisitStatus from '../components/select/visit-status';
import dayjs from 'dayjs';
import { getWeekOfDate, getWeeksOfYear } from '@/utils/date';
import { buildTable4ListMixin } from '@/views/mixins';

const now = dayjs();
const { weekNumber } = getWeekOfDate(now);

const listMixin = buildListMixin({
  properties: [
    'fdVisitName',
    'fdModuleType',
    'fdVisitAddress',
    { key: 'sorter', value: [] },
    { key: 'fdVisitType', value: [] },
    { key: 'date', value: [] },
    { key: 'year', value: `${now.year()}` },
    { key: 'week', value: `${weekNumber + 1}` },
    { key: 'fdStatus', value: [] },
  ],
  getQuery: (_, query) => {
    const { date = [], year, week, sorter = [] } = query;
    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdVisitName: query.fdVisitName,
      fdVisitName: query.fdVisitName,
      fdVisitAddress: query.fdVisitAddress,
      fdVisitType: (query.fdVisitType[0] || {}).value,
      fdModuleType: query.fdModuleType,
      fdStatus: (query.fdStatus[0] || {}).value,
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
        fdVisitPlanBeginTimeParam: `${date[0].format('YYYY-MM-DD')} 00:00:00`,
        fdVisitPlanEndTimeParam: `${date[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    if (!!year && !!week) {
      const weeks = getWeeksOfYear(parseInt(year));
      const currentWeek = weeks[parseInt(week) - 1];
      targetQuery = {
        ...targetQuery,
        fdVisitPlanBeginTimeParam: `${currentWeek.start.format('YYYY-MM-DD')} 00:00:00`,
        fdVisitPlanEndTimeParam: `${currentWeek.end.format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    _.reportQuery = targetQuery;
    return targetQuery;
  },
  getData: (_, query) => {
    return api.salesman.getVisitByIdList(query);
  },
});
const tableMixin = buildTable4ListMixin({
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
        title: '拜访类型',
        dataIndex: 'fdVisitType',
        sorter: true,
        hider: true,
        scopedSlots: { customRender: 'fdVisitType' },
      },
      {
        title: '拜访名称',
        sorter: true,
        hider: true,
        dataIndex: 'fdModuleType',
      },
      {
        title: '单据编号',
        sorter: true,
        hider: true,
        dataIndex: 'fdNumber',
      },
      {
        title: '拜访人',
        sorter: true,
        hider: true,
        dataIndex: 'fdVisitName',
      },
      {
        title: '拜访地址',
        sorter: true,
        hider: true,
        dataIndex: 'fdVisitAddress',
      },
      {
        title: '拜访目的',
        sorter: true,
        hider: true,
        dataIndex: 'fdVisitPurpose',
      },
      {
        title: '打卡状态',
        sorter: true,
        hider: true,
        dataIndex: 'fdClockCount',
        customRender: (text, record) => (record.fdClockCount > 0 ? '已打卡' : '未打卡'),
      },
      {
        title: '反馈状态',
        sorter: true,
        hider: true,
        dataIndex: 'fdFeedbackCount',
        customRender: (text, record) =>
          record.fdFeedbackCount > 0 ? '已反馈' : '未反馈',
      },
      {
        title: '创建时间',
        sorter: true,
        hider: true,
        dataIndex: 'createTime',
        customRender: (text, record) => _.formatDateTime(record.createTime),
      },
      {
        title: '状态',
        dataIndex: 'fdStatus',
        scopedSlots: { customRender: 'fdStatus' },
        width: 100,
        fixed: 'right',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 120,
        scopedSlots: {
          customRender: 'operation',
        },
      },
    ];
  },
});
export default {
  name: '拜访计划',
  computed: {
    reportTitle() {
      const { year = '', week = '' } = this.query;
      if (!!year && !!week) {
        const weeks = getWeeksOfYear(parseInt(year));
        const currentWeek = weeks[parseInt(week) - 1];
        return `${`${currentWeek.start.format('YYYY-MM-DD')}到${currentWeek.end.format(
          'YYYY-MM-DD'
        )}的`}拜访报表.xlsx`;
      } else {
        return `拜访报表.xlsx`;
      }
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
    SelectVisitStatus,
  },
  methods: {
    // 删除逻辑
    handleDel(id) {
      this.$confirm({
        title: '是否确认删除该数据?',
        onOk: () => {
          api.salesman.delVisitMain(id);
          this.$message.success('删除成功');
          this.onRefresh();
        },
        onCancel: () => {},
      });
    },
    checkAllowFeedback(record, action) {
      if (
        record.fdStatus === 'draft' ||
        dayjs().valueOf() < record.fdVisitPlanBeginTime
      ) {
        return false;
      }

      if (action === 'clockin' && dayjs().valueOf() > record.fdVisitPlanEndTime) {
        return false;
      }

      return true;
    },
    checkAllowEdit(record) {
      if (
        record.fdClockCount > 0 ||
        record.fdFeedbackCount > 0 ||
        dayjs().valueOf() > record.fdVisitPlanEndTime
      ) {
        return false;
      }

      return true;
    },

    handleFeedback(record, isEdit) {
      if (isEdit) {
        this.$router.push({
          path: `/Salesman/Visit/VisitFeedbackEdit/${record.visitId}`,
        });
      } else {
        this.$router.push({
          path: '/Salesman/Visit/VisitFeedbackCreate',
          query: {
            visitId: record.id,
          },
        });
      }
    },
  },
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'draft':
          return '暂存';
        case 'todo':
          return '有效';
        default:
          return v;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
