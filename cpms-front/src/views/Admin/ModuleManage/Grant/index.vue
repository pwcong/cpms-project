<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>后台管理</p-breadcrumb-item>
            <p-breadcrumb-item>业务模块管理</p-breadcrumb-item>
            <p-breadcrumb-item>授权模块</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="客户名称">
            <select-customer
              allow-clear
              placeholder="请选择"
              status="pass"
              v-model="query.fdCustId"
            />
          </p-switch-form-item>
          <p-switch-form-item label="项目名称">
            <!-- <select-project
              allow-clear
              placeholder="请选择"
              v-model="query.fdProjectName"
            /> -->
            <p-input v-model="query.fdProjectName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.createTime" />
          </p-switch-form-item>
          <p-switch-form-item label="项目状态">
            <select-grant-status
              v-model="query.fdStatus"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
          <template slot="button">
            <download-wrapper
              url="/api/cpms/projectGrantMain/export"
              :query="reportQuery"
              :title="reportTitle"
            >
              <p-button type="primary">导出授权报表</p-button>
            </download-wrapper>
            <p-popover placement="bottomLeft" trigger="click">
              <template slot="content">
                <table-hider v-model="propertiesMeta" />
              </template>
              <p-button type="primary" icon="filter" />
            </p-popover>

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
          <template slot="fdStatus" slot-scope="text, record">
            <status-tag :status="record.fdStatus">
              {{ text | foramtStatus }}
            </status-tag>
          </template>
          <template slot="updateTime" slot-scope="text">
            {{ text | updateTime }}
          </template>
          <template slot="fdReasonSummary" slot-scope="text">
            <div
              :title="text"
              style="max-width: 200px; text-overflow: ellipsis; overflow: hidden"
            >
              {{ text }}
            </div>
          </template>

          <template slot="fdProjectName" slot-scope="text">
            <div
              :title="text"
              style="max-width: 200px; text-overflow: ellipsis; overflow: hidden"
            >
              {{ text }}
            </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDetail(record)">详情</p-button-link>
            </span>
          </template>
        </p-table>
      </div>
    </template>
  </list-layout>
</template>

<script>
import api from '@/api';
import { buildListMixin } from '@/mixins';
import { buildTable4ListMixin } from '@/views/mixins';
// import SelectProject from "@/views/components/select/project";
import SelectCustomer from '@/views/components/select/customer';
import SelectGrantStatus from '@/views/Business/Grant/components/select/grant-status';

const tableMixin = buildTable4ListMixin({
  sorterMap: {
    createByName: 'createBy',
    updateByName: 'updateBy',
  },
  getProperties: (_) => {
    return [
      {
        title: '序号',
        width: 50,
        fixed: 'left',
        dataIndex: 'index',
        customRender: (text, record, index) => `${index + 1}`,
      },
      {
        title: '被授权代理商名称',
        dataIndex: 'fdCustName',
        sorter: true,
        hider: true,
      },
      {
        title: '项目名称',
        dataIndex: 'fdProjectName',
        sorter: false,
        hider: true,
        scopedSlots: { customRender: 'fdProjectName' },
      },
      {
        title: '盖章法人',
        dataIndex: 'fdCorporateName',
        sorter: true,
        hider: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        sorter: true,
        hider: true,
      },
      {
        title: '被授权时间起',
        dataIndex: 'fdBeginTime',
        sorter: true,
        hider: true,
        scopedSlots: { customRender: 'updateTime' },
      },
      {
        title: '授权理由',
        ellipsis: true,
        dataIndex: 'fdReasonSummary',
        sorter: true,
        hider: true,
        scopedSlots: { customRender: 'fdReasonSummary' },
      },
      {
        title: '授权状态',
        dataIndex: 'fdStatus',
        scopedSlots: { customRender: 'fdStatus' },
        fixed: 'right',
        align: 'center',
        width: 100,
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
const listMixin = buildListMixin({
  properties: [
    'fdProjectName',
    { key: 'sorter', value: [] },
    { key: 'fdCustId', value: [] },
    { key: 'createTime', value: [] },
    { key: 'fdStatus', value: [] },
  ],
  getQuery: (_, query) => {
    const { createTime = [], sorter = [] } = query;
    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdProjectName: query.fdProjectName,
      fdCustId: (query.fdCustId[0] || {}).value,
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
    if (createTime.length > 0) {
      targetQuery = {
        ...targetQuery,
        fdCreateBeginTime: `${createTime[0].format('YYYY-MM-DD')} 00:00:00`,
        fdCreateEndTime: `${createTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    _.reportQuery = targetQuery;
    return targetQuery;
  },
  getData: (_, query) => {
    return api.grant.getProjectGrantList(query);
  },
});
export default {
  name: '授权模块',
  mixins: [listMixin, tableMixin],
  components: {
    // SelectProject,
    SelectCustomer,
    SelectGrantStatus,
  },
  data() {
    return {
      reportQuery: {},
    };
  },
  computed: {
    reportTitle() {
      const { createTime = [] } = this.query;

      return `${
        createTime.length > 0
          ? `${createTime[0].format('YYYY-MM-DD')}到${createTime[1].format(
              'YYYY-MM-DD'
            )}的`
          : ''
      }授权报表.xlsx`;
    },
  },
  methods: {
    // 跳转详情页
    handleDetail(record) {
      this.$router.push({
        path: `/Business/Grant/GrantDetail/${record.id}`,
      });
    },
  },
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'success':
          return '通过';
        case 'done':
          return '完成';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '审批驳回';
        case 'draft':
          return '暂存';
        default:
          return v;
      }
    },
    updateTime(v) {
      if (!v) {
        return '';
      }
      let date = new Date(v),
        Y = date.getFullYear() + '-',
        M =
          (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) +
          '-',
        D = date.getDate() + ' ';
      return Y + M + D;
    },
  },
};
</script>

<style lang="scss" scoped></style>
