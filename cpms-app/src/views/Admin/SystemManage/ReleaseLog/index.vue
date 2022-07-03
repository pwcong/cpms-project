<template>
  <list-layout class="page-project-query">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="发版日志" left-text="返回" left-arrow @click-left="handleCancel" />
    </template>

    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div class="toolbar">
          <van-search v-model="query.fdUserName" clearable placeholder="请输入发版人姓名"> </van-search>
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
              <release-log-item :value="item" />
            </template>
          </card-list>
        </van-list>
      </van-pull-refresh>
    </template>

    <release-log-filter v-model="query.filter" :visible.sync="showFilter" />
  </list-layout>
</template>

<script>
import api from '@/api';
import omit from 'omit.js';
import { buildListMixin, userMixin } from '@/mixins';
import ReleaseLogFilter, { convertFilter2Query } from '../components/filter/release-log-filter';

import ReleaseLogItem from './item';

const listMixin = buildListMixin({
  properties: [
    'fdUserName',
    {
      key: 'filter',
      value: {
        fdDate: [],
      },
    },
  ],
  getQuery: (_, query) => ({
    limit: query.pageSize,
    createBy: _.user.uid,
    ...omit(query, ['filter']),
    ...convertFilter2Query(query.filter),
  }),
  getData: async (_, query) => {
    const res = await api.common.getPublishLogList(query);
    return res;
  },
});

export default {
  name: 'IssueList',
  mixins: [listMixin, userMixin],
  components: {
    ReleaseLogFilter,
    ReleaseLogItem,
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
