<template>
  <list-layout class="page-project-query">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="无业务员客户" left-text="返回" left-arrow @click-left="handleCancel" />
    </template>

    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px; display: flex">
        <div class="toolbar" style="flex: 1">
          <van-search v-model="query.fdCustName" clearable placeholder="请输入客户名称搜索"> </van-search>
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
          <card-list :data="list">
            <template v-slot="{ item }">
              <without-salesman-item :value="item" />
            </template>
          </card-list>
        </van-list>
      </van-pull-refresh>
    </template>

    <without-salesman-filter v-model="query.filter" :visible.sync="showFilter" />
  </list-layout>
</template>

<script>
import api from '@/api';
import omit from 'omit.js';
import { buildListMixin, userMixin } from '@/mixins';
import WithoutSalesmanFilter, { convertFilter2Query } from '../../components/filter/without-salesman-list';

import WithoutSalesmanItem from './item';

const listMixin = buildListMixin({
  properties: [
    'fdCustName',
    {
      key: 'filter',
      value: {
        createTime: [],
      },
    },
  ],
  getQuery: (_, query) => ({
    ...omit(query, ['filter']),
    ...convertFilter2Query(query.filter),
    limit: query.pageSize,
    fdSapStatus: 'personMiss',
  }),
  getData: async (_, query) => {
    const res = await api.customer.getRelateTheCustomerlistInReverse(query);
    return res;
  },
});

export default {
  name: 'SAPCustomerSyncWithoutSalesmanList',
  mixins: [listMixin, userMixin],
  components: {
    WithoutSalesmanFilter,
    WithoutSalesmanItem,
  },
  data() {
    return {
      showFilter: false,
    };
  },
  methods: {
    handleCancel() {
      this.$root.goBack();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.page-project-query {
  .toolbar {
    display: flex;
    align-items: center;
    .van-search {
      flex: 1;
    }
  }
}
</style>
