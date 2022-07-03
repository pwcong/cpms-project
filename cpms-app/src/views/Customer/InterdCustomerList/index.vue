<template>
  <list-layout class="page-customer-list">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="意向客户列表"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(false)"
        right-text="新建"
        @click-right="handleCreate"
      />
    </template>

    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div class="filter">
          <van-search v-model="query.fdCustName" placeholder="输入客户名称搜索" />
          <filter-trigger :value="query.filter" @click="showFilter = true" />
        </div>
        <data-grid
          :value="[
            {
              key: 'fdCreateTotal',
              title: '我的总客户数',
              value: reportStatistics.fdCreateTotal || 0,
            },
            {
              key: 'fdShareTotal',
              title: '共享给我的客户总数',
              value: reportStatistics.fdShareTotal || 0,
            },
            {
              key: 'fdNewCreateCount',
              title: '本月新建客户',
              value: reportStatistics.fdNewCreateCount || 0,
            },
            {
              key: 'fdSuccessCount',
              title: '本月成交客户',
              value: reportStatistics.fdSuccessCount || 0,
            },
            {
              key: 'fdVisitCount',
              title: '本月拜访客户',
              value: reportStatistics.fdVisitCount || 0,
            },
            {
              key: 'fdNewProjectCount',
              title: '本月新建项目',
              value: reportStatistics.fdNewProjectCount || 0,
            },
          ]"
        />
      </div>
    </template>

    <template v-slot:main="{ className }">
      <van-pull-refresh
        style="top: 151px; height: calc(100vh - 151px)"
        :class="className"
        :value="loading && !loadingMore"
        @refresh="onRefresh"
      >
        <van-list :value="loadingMore" :finished="!hasMore" finished-text="没有更多了" @load="onLoadMore">
          <card-list :data="list">
            <template v-slot="{ item }">
              <customer-item :value="item" @change="onRefresh" />
            </template>
          </card-list>
        </van-list>
      </van-pull-refresh>
    </template>

    <page-filter v-model="query.filter" :visible.sync="showFilter" />
  </list-layout>
</template>

<script>
import api from '@/api';
import omit from 'omit.js';
import { buildListMixin, userMixin } from '@/mixins';
import formMixin from '../InterdCustomerEdit/form';
import CustomerItem from './item';
import PageFilter, { convertFilter2Query } from '../components/filter';

const listMixin = buildListMixin({
  properties: [
    'fdCustName',
    {
      key: 'filter',
      value: {
        createTime: [],
        updateTime: [],
      },
    },
  ],
  getQuery: (_, query) => ({
    ...omit(query, ['filter']),
    limit: query.pageSize,
    ...convertFilter2Query(query.filter),
  }),
  getData: async (_, query) => {
    const res = await api.customer.getCustomerList(query);
    const data = await api.customer.getCustomerReportStatistics();
    _.reportStatistics = data.data;
    return res;
  },
});

export default {
  name: 'InterdCustomerList',
  mixins: [listMixin, userMixin, formMixin],
  components: {
    PageFilter,
    CustomerItem,
  },
  data() {
    return {
      showFilter: false,
      reportStatistics: {},
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.page-customer-list {
  .filter {
    display: flex;
    align-items: center;
    .van-search {
      flex: 1;
    }
  }
}
</style>
