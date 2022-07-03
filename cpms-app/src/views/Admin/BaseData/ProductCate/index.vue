<template>
  <list-layout class="page-project-query">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="产品分类" left-text="返回" left-arrow @click-left="handleCancel" />
    </template>

    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div class="toolbar">
          <van-search v-model="query.fdProductCategoryName" clearable placeholder="请输入"> </van-search>
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
              <product-cate-item :value="item" @click="handleDetail" />
            </template>
          </card-list>
        </van-list>
      </van-pull-refresh>
    </template>

    <setting-item :value="itemValue" :visible.sync="itemVisible" />
  </list-layout>
</template>

<script>
import api from '@/api';
import omit from 'omit.js';
import { buildListMixin, userMixin } from '@/mixins';
import SettingItem from './setting-item.vue';
import ProductCateItem from './item';

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
    fdProductCategoryName: query.name,
    ...omit(query, ['filter']),
  }),
  getData: (_, query) => {
    return api.basedata.getProductCateList(query);
  },
});

export default {
  name: 'ProductCateList',
  mixins: [listMixin, userMixin],
  components: {
    ProductCateItem,
    SettingItem,
  },
  data() {
    return {
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
