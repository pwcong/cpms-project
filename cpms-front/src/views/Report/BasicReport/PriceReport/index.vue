<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>报表管理</p-breadcrumb-item>
            <p-breadcrumb-item>基础信息报表</p-breadcrumb-item>
            <p-breadcrumb-item>价格申请统计表</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 32px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="选择日期" required>
            <p-range-picker value-format="YYYY-MM-DD" v-model="query.createTime" />
          </p-switch-form-item>
          <p-switch-form-item label="业务员">
            <p-select-user
              placeholder="请选择"
              :selectData="query.fdLoginName"
              @confirm="handleSalesmanConfirm"
            />
          </p-switch-form-item>
          <p-switch-form-item label="所属行业">
            <select-dict
              placeholder="请选择"
              systemCode="cpms"
              dictCode="cpms_business"
              v-model="query.fdCustIndustry"
              allow-clear
            />
          </p-switch-form-item>

          <p-switch-form-item label="产品线">
            <select-product-line
              v-model="query.fdProductLineCode"
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
              url="/api/cpms/projectMainReport/export"
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
        </p-table>
      </div>
    </template>
  </list-layout>
</template>

<script>
import api from '@/api';
import dayjs from 'dayjs';
import { buildListMixin, formatMixin } from '@/mixins';
import { commonMixin, buildTable4ListMixin } from '@/views/mixins';

// import SelectProject from "@/views/components/select/project";
import SelectCustomer from '@/views/components/select/customer';
import SelectProjectStatus from '../../../Business/components/select/project-status';
import SelectProductLine from '@/views/components/select/product-line';
import SelectBusiness from '@/views/components/select/business';

const now = dayjs();
const listMixin = buildListMixin({
  properties: [
    'fdName',
    { key: 'sorter', value: [] },
    { key: 'fdLoginName', value: [] },
    { key: 'fdCustMainId', value: [] },
    { key: 'fdProjectStatus', value: [] },
    { key: 'fdProductLineCode', value: [] },
    { key: 'fdCustIndustry', value: [] },
    { key: 'updateTime', value: [] },
    { key: 'fdBusinessCenterCode', value: [] },
    {
      key: 'createTime',
      value: [now.startOf('M').format('YYYY-MM-DD'), now.endOf('M').format('YYYY-MM-DD')],
    },
  ],
  getQuery: (_, query) => {
    const { createTime = [], sorter = [], fdLoginName = [], updateTime = [] } = query;
    let targetQuery = {
      fdCustMainId: (query.fdCustMainId[0] || {}).value,
      fdProjectStatus: (query.fdProjectStatus[0] || {}).value,
      fdProductLineCode: (query.fdProductLineCode[0] || {}).value,
      fdCustIndustry: (query.fdCustIndustry[0] || {}).value,
      fdBusinessCenterCode: (query.fdBusinessCenterCode[0] || {}).value,
      fdName: query.fdName,
      pageNo: query.pageNo,
      limit: query.pageSize,
    };
    if (fdLoginName.length > 0) {
      targetQuery = {
        ...targetQuery,
        fdLoginName: fdLoginName.map((d) => d.uid).join(','),
      };
    }
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
      ? api.price.getPriceReportList(query)
      : Promise.resolve({
          data: [],
        });
  },
});

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
        title: 'CPMS价格单据编号',
        dataIndex: 'fdPriceNumber',
        sorter: true,
        hider: true,
      },
      {
        title: '产品线',
        dataIndex: 'fdProductLineName',
        sorter: false,
        hider: true,
      },
      {
        title: '标题',
        dataIndex: 'fdOaSubject',
        sorter: true,
        hider: true,
      },
      {
        title: '合同交货时间',
        dataIndex: 'fdContractDeliveryTime',
        customRender: (text, record) => _.formatDate(record.fdContractDeliveryTime),
        sorter: true,
        hider: true,
      },
      {
        title: '开始时间',
        dataIndex: 'fdBeginTime',
        customRender: (text, record) => _.formatDate(record.fdBeginTime),
        sorter: true,
        hider: true,
      },
      {
        title: '开单截至时间',
        dataIndex: 'fdOrderEndTime',
        customRender: (text, record) => _.formatDate(record.fdOrderEndTime),
        sorter: true,
        hider: true,
      },
      {
        title: 'CPMS项目报备编号',
        dataIndex: 'fdProjectNumber',
        sorter: true,
        hider: true,
      },
      {
        title: '项目名称',
        dataIndex: 'fdProjectMainName',
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
        title: '登陆名',
        dataIndex: 'fdLoginName',
        sorter: true,
        hider: true,
      },
      {
        title: '所属部门',
        dataIndex: 'fdReasonSummary',
        sorter: true,
        hider: true,
      },
      {
        title: '分公司',
        dataIndex: 'fdBranchCompanyName',
        sorter: true,
        hider: true,
      },
      {
        title: '销售部',
        dataIndex: 'fdSaleDeptName',
        sorter: true,
        hider: true,
      },
      {
        title: '客户',
        dataIndex: 'fdCustName',
        sorter: true,
        hider: true,
      },
      {
        title: '一级渠道',
        dataIndex: 'fdChannelOneName',
        sorter: true,
        hider: true,
      },
      {
        title: '二级渠道',
        dataIndex: 'fdChannelTwoName',
        sorter: true,
        hider: true,
      },
      {
        title: '商务中心工程接口人',
        dataIndex: 'fdProjectBusinessPerson',
        sorter: true,
        hider: true,
      },
      {
        title: '项目干系人',
        dataIndex: 'fdProjectStakeholderName',
        sorter: true,
        hider: true,
      },
      {
        title: '联系电话',
        dataIndex: 'fdMobile',
        sorter: true,
        hider: true,
      },
      {
        title: '项目预计收入（万元）',
        dataIndex: 'fdEstimatedRevenue',
        sorter: true,
        hider: true,
      },
      {
        title: '项目主所在地',
        dataIndex: 'fdProjectMainAddress',
        sorter: true,
        hider: true,
      },
      {
        title: '项目是否跨区',
        dataIndex: 'fdIsRegion',
        sorter: true,
        hider: true,
      },
      {
        title: '申请理由',
        dataIndex: 'fdApplyReason',
        sorter: true,
        hider: true,
      },
      {
        title: 'SKU',
        dataIndex: 'fdProductId',
        sorter: true,
        hider: true,
      },
      {
        title: '型号',
        dataIndex: 'fdProductName',
        sorter: true,
        hider: true,
      },
      {
        title: '现净供价',
        dataIndex: 'fdCurrentNetSupplyPrice',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: true,
        hider: true,
      },
      {
        title: '申请净供价',
        dataIndex: 'fdApplyForNetContribution',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: true,
        hider: true,
      },
      {
        title: '开台价差',
        dataIndex: 'fdSinglePrice',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: true,
        hider: true,
      },
      {
        title: '实际开单价',
        dataIndex: 'fdActualOrderPrice',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: true,
        hider: true,
      },
      {
        title: '安装费',
        dataIndex: 'fdInstallCost',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: true,
        hider: true,
      },
      {
        title: '上楼费',
        dataIndex: 'fdUpstairsCost',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: true,
        hider: true,
      },
      {
        title: '申请数量',
        dataIndex: 'fdQuantity',
        sorter: true,
        hider: true,
      },
      {
        title: '单台项目费用',
        dataIndex: 'fdSingleProjectCost',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: true,
        hider: true,
      },
      {
        title: '开单总金额',
        dataIndex: 'fdTotalAmount',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: true,
        hider: true,
      },
      {
        title: '总项目费用',
        dataIndex: 'fdTotalProjectCost',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: true,
        hider: true,
      },
      {
        title: '总申请价格资源',
        dataIndex: 'fdTotalApplyPriceAssets',
        customRender: (text, recode) => _.formatAmount(text),
        sorter: true,
        hider: true,
      },
      {
        title: '交货计划',
        dataIndex: 'fdDeliveryPlan',
        customRender: (text, record) => _.formatDate(record.fdDeliveryPlan),
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

// export function formatStatus(v) {
//   switch (v) {
//     case 'todo':
//       return '待审批';
//     case 'success':
//       return '通过';
//     case 'done':
//       return '完成';
//     case 'audit':
//       return '审批中';
//     case 'pass':
//       return '审批通过';
//     case 'reject':
//       return '审批驳回';
//     case 'draft':
//       return '暂存';
//     default:
//       return v;
//   }
// }

export default {
  name: '价格申请统计表',
  mixins: [listMixin, commonMixin, formatMixin, tableMixin],
  components: {
    // SelectProject,
    SelectCustomer,
    SelectProjectStatus,
    SelectProductLine,
    SelectBusiness,
  },
  computed: {
    reportTitle() {
      const { createTime = [] } = this.query;

      return `${
        createTime.length > 0 ? `${createTime[0]}到${createTime[1]}的` : ''
      }价格申请统计表.xlsx`;
    },
  },
  data() {
    return {
      selectedId: '',
      reportQuery: {},
      version: '',
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
  // filters: {
  //   formatStatus(v) {
  //     return formatStatus(v);
  //   },
  // },
};
</script>

<style lang="scss" scoped></style>
