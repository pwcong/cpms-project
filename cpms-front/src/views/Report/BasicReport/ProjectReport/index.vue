<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>报表管理</p-breadcrumb-item>
            <p-breadcrumb-item>基础信息报表</p-breadcrumb-item>
            <p-breadcrumb-item>项目报备统计表</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action> </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="选择日期" required>
            <p-range-picker value-format="YYYY-MM-DD" v-model="query.createTime" />
          </p-switch-form-item>
          <p-switch-form-item label="业务员">
            <p-select-user
              placeholder="请选择"
              multiple
              :selectData="query.fdLoginName"
              @confirm="handleSalesmanConfirm"
            />
          </p-switch-form-item>
          <p-switch-form-item label="所属行业">
            <select-dict
              placeholder="请选择"
              systemCode="cpms"
              dictCode="cpms_business"
              v-model="query.fdBusinessCode"
              allow-clear
            />
          </p-switch-form-item>

          <p-switch-form-item label="产品线">
            <select-product-line
              v-model="query.fdProductLine"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
          <p-switch-form-item label="项目名称">
            <p-input v-model="query.fdName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="客户/代理商">
            <select-customer
              status="pass"
              v-model="query.fdCustMainId"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
          <p-switch-form-item label="更新日期">
            <p-range-picker v-model="query.updateTime" />
          </p-switch-form-item>
          <p-switch-form-item label="商务中心" prop="fdBusinessCenterCode">
            <select-business
              v-model="query.fdBusinessCenterCode"
              placeholder="请选择"
              allow-clear
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

          <template slot="button">
            <download-wrapper
              url="/api/cpms/project-main-report/export-project-report"
              :query="reportQuery"
              :title="reportTitle"
            >
              <p-button type="primary">导出报表</p-button>
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
          rowKey="id"
          :loading="loading"
          :columns="propertiesWithMeta"
          :scroll="{ x: true }"
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

      <batch-import :visible.sync="showBatchImport" @change="onRefresh" />
      <qianlima-import :visible.sync="showQianlimaImport" @change="onRefresh" />
    </template>
  </list-layout>
</template>

<script>
import dayjs from 'dayjs';
import { buildListMixin, formatMixin } from '@/mixins';
import { commonMixin, buildTable4ListMixin } from '@/views/mixins';
import api from '@/api';
import SelectProjectStatus from '../../../Business/components/select/project-status';
import SelectProductLine from '@/views/components/select/product-line';
import SelectCustomer from '@/views/components/select/customer';
import SelectBusiness from '@/views/components/select/business';

const now = dayjs();
const listMixin = buildListMixin({
  properties: [
    'fdName',
    'fdAgencyName',
    { key: 'sorter', value: [] },
    { key: 'fdProjectStatus', value: [] },
    { key: 'fdBusinessCode', value: [] },
    { key: 'fdProductLine', value: [] },
    { key: 'fdCustMainId', value: [] },
    { key: 'updateTime', value: [] },
    { key: 'fdBusinessCenterCode', value: [] },
    { key: 'fdLoginName', value: [] },
    {
      key: 'createTime',
      value: [now.startOf('M').format('YYYY-MM-DD'), now.endOf('M').format('YYYY-MM-DD')],
    },
  ],
  getQuery: (_, query) => {
    const { createTime = [], updateTime = [], sorter = [], fdLoginName = [] } = query;
    let targetQuery = {
      fdAgencyName: query.fdAgencyName,
      fdProjectStatus: query.fdProjectStatus.map((d) => d.value).join(','),
      fdBusinessCode: (query.fdBusinessCode[0] || {}).value,
      fdProductLine: (query.fdProductLine[0] || {}).value,
      fdCustMainId: (query.fdCustMainId[0] || {}).value,
      fdBusinessCenterCode: (query.fdBusinessCenterCode[0] || {}).value,
      fdName: query.fdName,
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
    if (fdLoginName.length > 0) {
      targetQuery = {
        ...targetQuery,
        fdLoginName: fdLoginName.map((d) => d.uid).join(','),
      };
    }
    if (createTime.length > 0) {
      targetQuery = {
        ...targetQuery,
        fdCreateStartTime: `${createTime[0]} 00:00:00`,
        fdCreateEndTime: `${createTime[1]} 23:59:59`,
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
    return !!query.fdCreateStartTime && !!query.fdCreateEndTime
      ? api.business.getInfoEntryReportList(query)
      : Promise.resolve({
          data: [],
        });
  },
});
const tableMixin = buildTable4ListMixin({
  sorterMap: {
    createByName: 'createBy',
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
        title: '项目报表编号',
        dataIndex: 'fdNumber',
        width: 300,
        sorter: true,
        hider: true,
      },
      {
        title: '分公司',
        dataIndex: 'fdCorporateName',
        sorter: true,
        hider: true,
      },
      {
        title: '业务单元',
        dataIndex: 'fdAgencyName',
        sorter: true,
        hider: true,
      },
      {
        title: '商务中心',
        dataIndex: 'fdBusinessCenter',
        sorter: true,
        hider: true,
      },
      {
        title: '项目名称',
        dataIndex: 'fdName',
        sorter: true,
        hider: true,
      },
      {
        title: 'SKU',
        dataIndex: 'fdProductId',
        sorter: false,
        hider: true,
      },
      {
        title: '型号',
        dataIndex: 'fdProductName',
        sorter: false,
        hider: true,
      },
      {
        title: '产品线',
        dataIndex: 'fdProductLineName',
        sorter: false,
        hider: true,
      },
      {
        title: '产品类型',
        dataIndex: 'fdProductCategoryName',
        sorter: false,
        hider: true,
      },
      {
        title: '台数',
        dataIndex: 'fdNum',
        sorter: false,
        hider: true,
      },
      {
        title: '预计销售单价(元)',
        dataIndex: 'fdPrice',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: false,
        hider: true,
      },
      {
        title: '预售总金额',
        dataIndex: 'fdTotalSum',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: false,
        hider: true,
      },
      {
        title: '项目干系人',
        dataIndex: 'fdStakeholderList',
        sorter: false,
        hider: true,
      },
      {
        title: '电话',
        dataIndex: 'fdPhone',
        hider: true,
      },
      {
        title: '预出货日期',
        dataIndex: 'fdShippingDate',
        customRender: (text, record) => _.formatDate(record.fdShippingDate),
        sorter: false,
        hider: true,
      },
      {
        title: '项目有效截止日期',
        dataIndex: 'fdEndTime',
        customRender: (text, record) => _.formatDate(record.fdEndTime),
        sorter: true,
        hider: true,
      },
      {
        title: '是否有效',
        dataIndex: 'fdIsValid',
        sorter: true,
        hider: true,
        customRender: (text, record, index) => (record.fdIsValid === '0' ? '否' : '是'),
      },
      {
        title: '是否已转价格申请',
        dataIndex: 'fdIsPriceApply',
        sorter: false,
        hider: true,
      },
      {
        title: '项目报备状态',
        dataIndex: 'fdProjectStatusName',
        sorter: true,
        hider: true,
      },
      {
        title: '预计成交率',
        dataIndex: 'fdSuccessRate',
        customRender: (text, record) => `${record.fdSuccessRate || '--'}%`,
        sorter: true,
        hider: true,
      },
      {
        title: '预计成交总金额（元）',
        dataIndex: 'fdProjectSum',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: true,
        hider: true,
      },
      {
        title: '项目主所在地（省）',
        dataIndex: 'fdProjectMainLocalProvince',
        sorter: false,
        hider: true,
      },
      {
        title: '（市）',
        dataIndex: 'fdProjectMainLocalCity',
        sorter: false,
        hider: true,
      },
      {
        title: '所属行业',
        dataIndex: 'fdBusinessName',
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
        title: '业务员',
        dataIndex: 'fdUserName',
        sorter: true,
        hider: true,
      },
      {
        title: '登录名',
        dataIndex: 'fdLoginName',
        sorter: true,
        hider: true,
      },
      {
        title: '创建人',
        dataIndex: 'createByName',
        sorter: true,
        hider: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        customRender: (text, record) => _.formatDateTime(record.createTime),
        sorter: true,
        hider: true,
      },
      {
        title: '修改人',
        dataIndex: 'updateByName',
        sorter: true,
        hider: true,
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        customRender: (text, record) => _.formatDateTime(record.updateTime),
        sorter: true,
        hider: true,
      },
    ];
  },
});
export default {
  name: '项目报备统计表',
  mixins: [listMixin, commonMixin, tableMixin, formatMixin],
  components: {
    SelectProjectStatus,
    SelectProductLine,
    SelectCustomer,
    SelectBusiness,
  },
  computed: {
    reportTitle() {
      const { createTime = [] } = this.query;

      return `${
        createTime.length > 0 ? `${createTime[0]}到${createTime[1]}的` : ''
      }项目报备统计表.xlsx`;
    },
  },
  data() {
    return {
      reportQuery: {},
      report: {},
    };
  },
  created() {
    const { fdCustMainId, fdCustName } = this.$route.query;

    if (!!fdCustMainId) {
      this.query.fdCustMainId = [
        {
          text: fdCustName,
          value: fdCustMainId,
        },
      ];
    }
  },
  methods: {
    handleSalesmanConfirm(list) {
      this.query.fdLoginName = list;
    },
  },
};
</script>

<style lang="scss" scoped></style>
