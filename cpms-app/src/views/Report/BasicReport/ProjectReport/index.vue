<template>
  <list-layout class="page-project-report">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="项目报备统计表"
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
import { buildListMixin, userMixin, formatMixin } from '@/mixins';
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

    const result = await api.business.getInfoEntryReportList(query).then((res) => ({
      ...res,
      data: (res.data || []).map((_d) => ({
        ..._d,
        updateTime: _.formatDateTime(_d.updateTime),
        createTime: _.formatDateTime(_d.createTime),
        fdEndTime: _.formatDate(_d.fdEndTime),
        fdShippingDate: _.formatDate(_d.fdShippingDate),
        fdProjectSum: _.formatAmount(_d.fdProjectSum),
        fdTotalSum: _.formatAmount(_d.fdTotalSum),
        fdPrice: _.formatAmount(_d.fdPrice),
        fdIsValid: _d.fdIsValid === '0' ? '否' : '是',
        fdSuccessRate: `${_d.fdSuccessRate || '--'}%`,
      })),
    }));
    return result;
  },
});

export default {
  name: 'ProjectList',
  mixins: [listMixin, userMixin, formMixin, formatMixin],
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
          title: '项目报表编号',
          field: 'fdNumber',
          fixed: 'left',
        },
        {
          title: '分公司',
          field: 'fdCorporateName',
        },
        {
          title: '业务单元',
          field: 'fdAgencyName',
        },
        {
          title: '商务中心',
          field: 'fdBusinessCenter',
        },
        {
          title: '项目名称',
          field: 'fdName',
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
          title: '产品线',
          field: 'fdProductLineName',
        },
        {
          title: '产品类型',
          field: 'fdProductCategoryName',
        },
        {
          title: '台数',
          field: 'fdNum',
        },
        {
          title: '预计销售单价(元)',
          field: 'fdPrice',
        },
        {
          title: '预售总金额',
          field: 'fdTotalSum',
        },
        {
          title: '项目干系人',
          field: 'fdStakeholderList',
        },
        {
          title: '电话',
          field: 'fdPhone',
        },
        {
          title: '预出货日期',
          field: 'fdShippingDate',
        },
        {
          title: '项目有效截止日期',
          field: 'fdEndTime',
        },
        {
          title: '是否有效',
          field: 'fdIsValid',
        },
        {
          title: '是否已转价格申请',
          field: 'fdIsPriceApply',
        },
        {
          title: '项目报备状态',
          field: 'fdProjectStatusName',
        },
        {
          title: '预计成交率',
          field: 'fdSuccessRate',
        },
        {
          title: '预计成交总金额（元）',
          field: 'fdProjectSum',
        },
        {
          title: '目主所在地（省）',
          field: 'fdProjectMainLocalProvince',
        },
        {
          title: '（市）',
          field: 'fdProjectMainLocalCity',
        },
        {
          title: '所属行业',
          field: 'fdBusinessName',
        },
        {
          title: '项目类型',
          field: 'fdProjectTypeName',
        },
        {
          title: '业务员',
          field: 'fdUserName',
        },
        {
          title: '登录名',
          field: 'fdLoginName',
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

.page-project-report {
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
