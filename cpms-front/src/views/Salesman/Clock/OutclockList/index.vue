<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>业务员管理</p-breadcrumb-item>
            <p-breadcrumb-item>考勤管理</p-breadcrumb-item>
            <p-breadcrumb-item>外勤申请列表 </p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div style="margin-top: 16px" :class="className">
        <p-switch-form :col="3">
          <p-switch-form-item label="打卡日期">
            <p-range-picker v-model="query.date" value-format="YYYY-MM-DD" />
          </p-switch-form-item>
          <template slot="button">
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
          :columns="[
            {
              title: '序号',
              dataIndex: 'index',
              width: 50,
              fixed: 'left',
              customRender: (text, record, index) => `${index + 1}`,
            },
            {
              title: '申请人',
              sorter: true,
              dataIndex: 'fdUserName',
            },
            {
              title: '外勤打卡地点',
              sorter: true,
              dataIndex: 'address',
            },
            {
              title: '外勤打卡时间',
              dataIndex: 'fdClockTime',
              sorter: true,
              customRender: (text, record) => formatDateTime(record.fdClockTime),
            },
            {
              title: '关联拜访',
              sorter: true,
              dataIndex: 'fdRelateModule',
            },
            {
              title: '外勤打卡理由',
              sorter: true,
              dataIndex: 'fdCause',
            },
            {
              title: '审批状态',
              dataIndex: 'fdStatus',
              fixed: 'right',
              width: 100,
              align: 'center',
              scopedSlots: {
                customRender: 'fdStatus',
              },
            },
            {
              title: '操作',
              dataIndex: 'operation',
              width: 120,
              fixed: 'right',
              scopedSlots: { customRender: 'operation' },
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
          <template slot="fdStatus" slot-scope="text, record">
            <status-tag :status="record.fdStatus">
              {{ formatStatus(record.fdStatus) }}
            </status-tag>
          </template>
          <!-- customRender: (text, record) => formatStatus(record.fdStatus), -->
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDetail(record.id)">详情</p-button-link>
              <!-- <p-button-link>查看审批意见</p-button-link> -->
            </span>
          </template>
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
import formMixin from '../OutclockDetail/form';
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
    return targetQuery;
  },
  getData: (_, query) => {
    return api.salesman.getOutclockList(query);
  },
});
const tableMixin = buildTable4ListMixin({
  sorterMap: {
    // address:"address"
  },
});
export default {
  name: '外勤申请列表',
  mixins: [formMixin, listMixin, formatMixin, tableMixin],
  methods: {
    formatStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'draft':
          return '草稿';
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
