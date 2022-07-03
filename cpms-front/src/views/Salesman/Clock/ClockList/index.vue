<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>业务员管理</p-breadcrumb-item>
            <p-breadcrumb-item>考勤管理</p-breadcrumb-item>
            <p-breadcrumb-item>考勤打卡列表</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div style="margin-top: 16px" :class="className">
        <p-switch-form :col="3">
          <p-switch-form-item label="打卡日期">
            <p-range-picker value-format="YYYY-MM-DD" v-model="query.date" />
          </p-switch-form-item>

          <template slot="button">
            <!-- <download-wrapper
              url="/api/cpms/spersonClockRecordMain/export"
              :query="reportQuery"
              :title="reportTitle"
            >
              <p-button type="primary">导出考勤报表</p-button>
            </download-wrapper> -->
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
          :columns="[
            {
              title: '序号',
              dataIndex: 'index',
              width: 50,
              fixed: 'left',
              customRender: (text, record, index) => `${index + 1}`,
            },
            {
              title: '打卡人',
              dataIndex: 'fdUserName',
              sorter: true,
            },
            {
              title: '打卡地址',
              dataIndex: 'fdClockAddress',
              sorter: true,
            },
            {
              title: '打卡时间',
              dataIndex: 'fdClockTime',
              sorter: true,
              customRender: (text, record) => formatDateTime(record.fdClockTime),
            },
            {
              title: '打卡类型',
              dataIndex: 'fdType',
              customRender: (text, record) => formatType(record.fdType),
            },
          ]"
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
        </p-table>
      </div>
    </template>
  </list-layout>
</template>

<script>
import { buildListMixin } from '@/mixins';
import api from '@/api';
import { formatMixin } from '@/mixins';
import { buildTable4ListMixin } from '@/views/mixins';
import dayjs from 'dayjs';
const now = dayjs();

const listMixin = buildListMixin({
  properties: [
    { key: 'sorter', value: [] },
    {
      key: 'date',
      value: [now.startOf('M').format('YYYY-MM-DD'), now.endOf('M').format('YYYY-MM-DD')],
    },
  ],
  getQuery: (_, query) => {
    const { date = [], sorter = [] } = query;

    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
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
        startTime: `${date[0]} 00:00:00`,
        endTime: `${date[1]} 23:59:59`,
      };
    }
    _.reportQuery = targetQuery;
    return targetQuery;
  },
  getData: (_, query) => {
    return api.salesman.getClockList(query);
  },
});

const tableMixin = buildTable4ListMixin();

export default {
  name: '考勤打卡列表',
  computed: {
    reportTitle() {
      const { date = [] } = this.query;

      return `${date.length > 0 ? `${date[0]}到${date[1]}的` : ''}考勤打卡报表.xlsx`;
    },
  },
  mixins: [listMixin, formatMixin, tableMixin],
  data() {
    return {
      reportQuery: {},
    };
  },
  methods: {
    formatType(v) {
      switch (v) {
        case 'clock':
          return '考勤';
        case 'out':
          return '外勤';
        case 'visit':
          return '拜访';
        default:
          return v || '-';
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
