<template>
  <list-layout class="page-report-price">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="价格申请统计表"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(false)"
      />
    </template>

    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div class="toolbar">
          <van-search v-model="query.fdName" placeholder="请输入项目名称搜索" />
          <filter-trigger :value="query.filter" @click="showFilter = true" />
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
          <ve-table class="report-list" :columns="columns.map((d) => ({ ...d, key: d.field }))" :table-data="list" />
        </van-list>
      </van-pull-refresh>
    </template>

    <project-filter v-model="query.filter" :visible.sync="showFilter" />
  </list-layout>
</template>

<script>
import api from '@/api';
import { buildListMixin, userMixin } from '@/mixins';
import ProjectFilter, { convertFilter2Query } from '../../../Business/components/filter/project-report';

import formMixin from '../../../Business/ProjectEdit/form';

const listMixin = buildListMixin({
  properties: [
    'fdName',
    {
      key: 'filter',
      value: {
        createTime: [],
        updateTime: [],
      },
    },
  ],
  getQuery: (_, query) => ({
    pageNo: query.pageNo,
    limit: query.pageSize,
    fdName: query.fdName,
    ...convertFilter2Query(query.filter),
  }),
  getData: async (_, query) => {
    const report = await api.business.getProjectReportList(query);
    _.report = report;

    const result = await api.price.getPriceReportList(query).then((res) => ({
      ...res,
      data: (res.data || []).map((_d) => ({
        ..._d,
        updateTime: _.formatDateTime(_d.updateTime),
        createTime: _.formatDateTime(_d.createTime),
        fdBeginTime: _.formatDateTime(_d.fdBeginTime),
        fdOrderEndTime: _.formatDateTime(_d.fdOrderEndTime),
        fdCurrentNetSupplyPrice: _.formatAmount(_d.fdCurrentNetSupplyPrice),
        fdApplyForNetContribution: _.formatAmount(_d.fdApplyForNetContribution),
        fdSinglePrice: _.formatAmount(_d.fdSinglePrice),
        fdActualOrderPrice: _.formatAmount(_d.fdActualOrderPrice),
        fdInstallCost: _.formatAmount(_d.fdInstallCost),
        fdUpstairsCost: _.formatAmount(_d.fdUpstairsCost),
        fdSingleProjectCost: _.formatAmount(_d.fdSingleProjectCost),
        fdTotalAmount: _.formatAmount(_d.fdTotalAmount),
        fdTotalProjectCost: _.formatAmount(_d.fdTotalProjectCost),
        fdIsValid: _d.fdIsValid === '0' ? '否' : '是',
        fdSuccessRate: `${_d.fdSuccessRate || '--'}%`,
      })),
    }));
    return result;
  },
});

export default {
  name: 'ProjectList',
  mixins: [listMixin, userMixin, formMixin],
  components: {
    ProjectFilter,
  },
  data() {
    return {
      showFilter: false,
      report: {},
      fixedHeightColumns: [],
      columns: [
        {
          title: 'CPMS价格单据编号',
          field: 'fdPriceNumber',
          fixed: 'left',
        },
        {
          title: '产品线',
          field: 'fdProductLineName',
        },
        {
          title: '标题',
          field: 'fdOaSubject',
        },
        {
          title: '合同交货时间',
          field: 'fdContractDeliveryTime',
        },
        {
          title: '开始时间',
          field: 'fdBeginTime',
        },
        {
          title: '开单截至时间',
          field: 'fdOrderEndTime',
        },
        {
          title: 'CPMS项目报备编号',
          field: 'fdProjectNumber',
        },
        {
          title: '项目名称',
          field: 'fdProjectMainName',
        },
        {
          title: '业务员',
          field: 'fdUserName',
        },
        {
          title: '登陆名',
          field: 'fdLoginName',
        },
        {
          title: '所属部门',
          field: 'fdReasonSummary',
        },
        {
          title: '分公司',
          field: 'fdBranchCompanyName',
        },
        {
          title: '销售部',
          field: 'fdSaleDeptName',
        },
        {
          title: '客户',
          field: 'fdCustName',
        },
        {
          title: '一级渠道',
          field: 'fdChannelOneName',
        },
        {
          title: '二级渠道',
          field: 'fdChannelTwoName',
        },
        {
          title: '商务中心工程接口人',
          field: 'fdProjectBusinessPerson',
        },
        {
          title: '项目干系人',
          field: 'fdProjectStakeholderName',
        },
        {
          title: '联系电话',
          field: 'fdMobile',
        },
        {
          title: '项目预计收入（万元）',
          field: 'fdEstimatedRevenue',
        },
        {
          title: '项目主所在地',
          field: 'fdProjectMainAddress',
        },
        {
          title: '项目是否跨区',
          field: 'fdIsRegion',
        },
        {
          title: '申请理由',
          field: 'fdApplyReason',
        },
        {
          title: 'SKU',
          field: 'fdProductId',
        },
        {
          title: '型号',
          field: 'fdProductName',
        },
        {
          title: '现净供价',
          field: 'fdCurrentNetSupplyPrice',
        },
        {
          title: '申请净供价',
          field: 'fdApplyForNetContribution',
        },
        {
          title: '开台价差',
          field: 'fdSinglePrice',
        },
        {
          title: '实际开单价',
          field: 'fdActualOrderPrice',
        },
        {
          title: '安装费',
          field: 'fdInstallCost',
        },
        {
          title: '上楼费',
          field: 'fdUpstairsCost',
        },
        {
          title: '申请数量',
          field: 'fdQuantity',
        },
        {
          title: '单台项目费用',
          field: 'fdSingleProjectCost',
        },
        {
          title: '开单总金额',
          field: 'fdTotalAmount',
        },
        {
          title: '总项目费用',
          field: 'fdTotalProjectCost',
        },
        {
          title: '总申请价格资源',
          field: 'fdTotalApplyPriceAssets',
        },
        {
          title: '交货计划',
          field: 'fdDeliveryPlan',
        },
        {
          title: '创建人',
          field: 'createByName',
        },
        {
          title: '创建时间',
          field: 'createTime',
        },
        {
          title: '修改人',
          field: 'updateByName',
        },
        {
          title: '修改时间',
          field: 'updateTime',
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.page-report-price {
  .toolbar {
    display: flex;
    align-items: center;
    .van-search {
      flex: 1;
    }
  }

  .report-list {
    /deep/ th,
    /deep/ td {
      white-space: nowrap;
      font-size: 12px !important;
    }
  }
}
</style>
