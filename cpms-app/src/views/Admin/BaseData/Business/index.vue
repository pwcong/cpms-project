<template>
  <list-layout class="page-project-query">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="商务中心" left-text="返回" left-arrow @click-left="handleCancel" />
    </template>

    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div class="toolbar">
          <van-search v-model="query.fdBusinessName" clearable placeholder="请输入业务中心名称"> </van-search>
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
              <business-item :value="item" @click="handleDetail" />
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
import { buildListMixin, userMixin } from '@/mixins';
import SettingItem from './setting-item.vue';
import BusinessItem from './item';

const listMixin = buildListMixin({
  properties: ['fdBusinessName'],
  getQuery: (_, query) => ({
    ...query,
    limit: query.pageSize,
    fdBusinessName: query.fdBusinessName,
  }),
  getData: (_, query) => {
    return api.basedata.getBusinessList(query);
  },
});

export default {
  name: 'BusinessList',
  mixins: [listMixin, userMixin],
  components: {
    BusinessItem,
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
