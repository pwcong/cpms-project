<template>
  <list-layout class="page-sales-order-list">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="销售单列表"
        left-text="返回"
        left-arrow
        right-text="新建"
        @click-left="handleCancel(false)"
        @click-right="handleCreate"
      />
    </template>

    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div class="toolbar">
          <van-search v-model="query.fdCpmsCustName" placeholder="请输入客户名称搜索" />
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
              <sales-order-item :value="item" @change="onRefresh" />
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
import { buildListMixin, userMixin, formatMixin } from '@/mixins';
import PageFilter, { convertFilter2Query } from '../components/filter';
import SalesOrderItem from './item';
import formMixin from '../SalesOrderEdit/form';

const listMixin = buildListMixin({
  properties: [
    'fdCpmsCustName',
    {
      key: 'filter',
      value: {
        createTime: [],
        updateTime: [],
        fdProjectTypeId: [],
      },
    },
  ],
  getQuery: (_, query) => ({
    pageNo: query.pageNo,
    limit: query.pageSize,
    fdCpmsCustName: query.fdCpmsCustName,
    ...convertFilter2Query(query.filter),
  }),
  getData: async (_, query) => {
    const result = await api.order.getOrderList(query);
    return result;
  },
});

export default {
  name: 'SalesOrderList',
  mixins: [listMixin, userMixin, formatMixin, formMixin],
  components: {
    PageFilter,
    SalesOrderItem,
  },
  data() {
    return {
      showFilter: false,
    };
  },
  methods: {
    // 先放这，待会放到form里去
    handleCancel(needConfirm) {
      if (needConfirm === true) {
        this.$dialog
          .confirm({
            title: '当前内容未保存，是否确认返回?',
          })
          .then(() => {
            //退出
            this.$root.goBack();
          });
      } else {
        this.$root.goBack();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.page-sales-order-list {
  .toolbar {
    display: flex;
    align-items: center;
    .van-search {
      flex: 1;
    }
  }
}
</style>
