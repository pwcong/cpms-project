<template>
  <list-layout class="page-customer-list">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="正式客户列表"
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
          <van-search v-model="query.fdSapCustName" placeholder="输入客户名称搜索" />
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
import formMixin from '../SAPCustomerEdit/form';
import CustomerItem from './item';
import PageFilter, { convertFilter2Query } from '../components/filter/sap-customer';

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
    const res = await api.customer.getSapCustomerList(query);
    return res;
  },
});

export default {
  name: 'SAPCustomerList',
  mixins: [listMixin, userMixin, formMixin],
  components: {
    PageFilter,
    CustomerItem,
  },
  data() {
    return {
      showFilter: false,
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
