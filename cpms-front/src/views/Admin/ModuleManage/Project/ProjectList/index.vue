<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>后台管理</p-breadcrumb-item>
            <p-breadcrumb-item>业务模块管理</p-breadcrumb-item>
            <p-breadcrumb-item>项目模块</p-breadcrumb-item>
            <p-breadcrumb-item>项目</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="项目名称">
            <p-input v-model="query.fdName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="单据编号">
            <p-input v-model="query.fdNumber" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="客户/代理商">
            <select-customer
              status="pass"
              v-model="query.fdCustMainId"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
          <p-switch-form-item label="项目类型">
            <select-project-type
              :type="0"
              v-model="query.fdProjectTypeId"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
          <p-switch-form-item label="产品线">
            <select-product-line
              v-model="query.fdProductLine"
              placeholder="请选择"
              allow-clear
              multiple
            />
          </p-switch-form-item>
          <p-switch-form-item label="项目状态">
            <select-project-status
              v-model="query.fdProjectStatus"
              placeholder="请选择"
              allow-clear
              multiple
            />
          </p-switch-form-item>
          <p-switch-form-item label="业务员">
            <p-select-user
              :selectData="query.fdLoginName"
              @confirm="query.fdLoginName = $event"
            />
          </p-switch-form-item>
          <p-switch-form-item label="创建人">
            <p-select-user
              :selectData="query.createBy"
              @confirm="query.createBy = $event"
            />
          </p-switch-form-item>
          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.createTime" />
          </p-switch-form-item>
          <p-switch-form-item label="更新时间">
            <p-range-picker v-model="query.updateTime" />
          </p-switch-form-item>
          <template slot="button">
            <download-wrapper
              url="/api/cpms/projectMain/export-project"
              :query="reportQuery"
              :title="reportTitle"
            >
              <p-button type="primary">导出项目报表</p-button>
            </download-wrapper>
            <download-wrapper
              url="/api/cpms/projectMain/export-project-product"
              :query="reportQuery"
              title="产品报表.xlsx"
            >
              <p-button type="primary">导出产品报表</p-button>
            </download-wrapper>
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
          <template slot="fdProjectStatusName" slot-scope="text, record">
            <status-tag :status="record.fdProjectStatus">
              {{ record.fdProjectStatusName }}
            </status-tag>
          </template>

          <template slot="fdBusinessCode" slot-scope="text, record">
            <dict-text
              :value="(record.fdBusinessCode || '').split(',')"
              systemCode="cpms"
              dictCode="cpms_business"
            />
          </template>
          <template slot="operation" slot-scope="text, record">
            <span>
              <p-button-link @click="handleDetail(record)"> 详情 </p-button-link>
            </span>
          </template>
        </p-table>
      </div>
    </template>
  </list-layout>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';

import SelectProjectType from '@/views/Business/components/select/project-type';
import SelectProjectStatus from '@/views/Business/components/select/project-status';
import SelectCustomer from '@/views/components/select/customer';
import SelectProductLine from '@/views/components/select/product-line';

import { commonMixin, buildTable4ListMixin } from '@/views/mixins';

const tableMixin = buildTable4ListMixin({
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
        title: '客户/代理商',
        dataIndex: 'fdCustName',
        width: 250,
        sorter: true,
        hider: true,
      },
      {
        title: '项目名称',
        dataIndex: 'fdName',
        width: 300,
        sorter: true,
        hider: true,
      },
      {
        title: '单据编号',
        dataIndex: 'fdNumber',
        sorter: true,
        hider: true,
      },
      {
        title: '项目类型',
        dataIndex: 'fdProjectTypeName',
        sorter: true,
        hider: true,
      },
      {
        title: '产品线',
        dataIndex: 'productLineName',
        sorter: true,
        hider: true,
      },
      {
        title: '所属行业',
        dataIndex: 'fdBusinessCode',
        scopedSlots: { customRender: 'fdBusinessCode' },
        sorter: true,
        hider: true,
      },

      {
        title: '项目总金额(元)',
        dataIndex: 'fdProjectSum',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: true,
        hider: true,
      },
      {
        title: '预计成交把握度 ',
        dataIndex: 'fdSuccessRate',
        customRender: (text, record) => `${record.fdSuccessRate || '--'}%`,
        sorter: true,
        hider: true,
      },
      {
        title: '业务员',
        dataIndex: 'fdUserName',
        sorter: true,
        hider: true,
      },
      {
        title: '创建时间 ',
        dataIndex: 'fdCreateTime',
        customRender: (text, record) => _.formatDateTime(record.fdCreateTime),
        sorter: true,
        hider: true,
      },
      {
        title: '状态',
        dataIndex: 'fdProjectStatusName',
        fixed: 'right',
        width: 100,
        align: 'center',
        scopedSlots: {
          customRender: 'fdProjectStatusName',
        },
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
  sorterMap: {
    fdCreateTime: 'createTime',
  },
});

const listMixin = buildListMixin({
  properties: [
    'fdName',
    'fdNumber',
    { key: 'sorter', value: [] },
    { key: 'fdLoginName', value: [] },
    { key: 'createBy', value: [] },
    { key: 'fdCustMainId', value: [] },
    { key: 'fdProjectTypeId', value: [] },
    { key: 'fdProductLine', value: [] },
    { key: 'createTime', value: [] },
    { key: 'updateTime', value: [] },
    { key: 'fdProjectStatus', value: [] },
  ],
  getQuery: (_, query) => {
    const { createTime = [], updateTime = [], sorter = [] } = query;
    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdName: query.fdName,
      fdNumber: query.fdNumber,
      fdCustMainId: (query.fdCustMainId[0] || {}).value,
      fdProjectTypeId: (query.fdProjectTypeId[0] || {}).value,
      fdProductLine: query.fdProductLine.map((d) => d.value).join(','),
      fdProjectStatus: query.fdProjectStatus.map((d) => d.value).join(','),
      fdLoginName: query.fdLoginName.map((d) => d.uid).join(','),
      createBy: query.createBy.map((d) => d.uid).join(','),
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
        fdCreateStartTime: `${createTime[0].format('YYYY-MM-DD')} 00:00:00`,
        fdCreateEndTime: `${createTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    if (updateTime.length > 0) {
      targetQuery = {
        ...targetQuery,
        fdUpdateStartTime: `${updateTime[0].format('YYYY-MM-DD')} 00:00:00`,
        fdUpdateEndTime: `${updateTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }

    _.reportQuery = targetQuery;
    return targetQuery;
  },
  getData: (_, query) => {
    return api.business.getAllProjectList(query);
  },
});

export default {
  name: '项目',
  mixins: [listMixin, formatMixin, commonMixin, tableMixin],
  components: {
    SelectProjectType,
    SelectCustomer,
    SelectProductLine,
    SelectProjectStatus,
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
      }项目报表.xlsx`;
    },
  },
  data() {
    return {
      reportQuery: {},
    };
  },
  methods: {
    handleDetail(record) {
      this.$router.push({
        path: `/Business/ProjectDetail/${record.id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
