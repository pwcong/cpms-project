<template>
  <list-layout class="page-project-query">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="客户" left-text="返回" left-arrow @click-left="handleCancel" />
    </template>

    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div class="toolbar">
          <van-search v-model="query.fdCustomerName" clearable placeholder="请输入客户名称"> </van-search>
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
              <customer-item :value="item" @click="handleDetail" />
            </template>
          </card-list>
        </van-list>
      </van-pull-refresh>
    </template>

    <setting-item :value="itemValue" :visible.sync="itemVisible" />

    <page-filter v-model="query.filter" :visible.sync="showFilter" />
  </list-layout>
</template>

<script>
import api from '@/api';
import omit from 'omit.js';
import { buildListMixin, userMixin } from '@/mixins';
import PageFilter, { convertFilter2Query } from '@/views/Admin/BaseData/components/filter/customer';
import SettingItem from './setting-item.vue';
import CustomerItem from './item';

const listMixin = buildListMixin({
  properties: [
    'name',
    {
      key: 'filter',
      value: {
        createTime: [],
      },
    },
  ],
  getQuery: (_, query) => ({
    fdCustomerName: query.name,
    ...omit(query, ['filter']),
    ...convertFilter2Query(query.filter),
  }),
  getData: (_, query) => {
    return api.basedata.getCustomerList(query);
  },
});

export default {
  name: 'CustomerList',
  mixins: [listMixin, userMixin],
  components: {
    PageFilter,
    CustomerItem,
    SettingItem,
  },
  data() {
    return {
      showFilter: false,
      itemValue: {},
      itemVisible: false,
    };
  },
  methods: {
    handleCancel() {
      this.$root.goBack();
    },
    handleDetail(value) {
      this.itemValue = value;
      this.itemVisible = true;
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
