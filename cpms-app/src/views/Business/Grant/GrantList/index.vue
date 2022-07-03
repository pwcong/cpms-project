<template>
  <list-layout class="page-project-query">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="授权查询"
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
          <van-search v-model="query.fdProjectName" clearable placeholder="请输入项目名称"> </van-search>
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
              <grant-item :value="item" @change="onRefresh" />
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
import formMixin from '../GrantEdit/form';
import omit from 'omit.js';
import { buildListMixin, userMixin } from '@/mixins';
import PageFilter, { convertFilter2Query } from '../../components/filter/grant';

import GrantItem from './item';

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
    fdProjectName: query.name,
    ...omit(query, ['filter']),
    ...convertFilter2Query(query.filter),
  }),
  getData: (_, query) => {
    return api.grant.getProjectGrantList(query);
  },
});

export function formatStatus(v) {
  switch (v) {
    case 'todo':
      return '待审批';
    case 'success':
      return '通过';
    case 'done':
      return '完成';
    case 'audit':
      return '审批中';
    case 'pass':
      return '审批通过';
    case 'reject':
      return '审批驳回';
    case 'draft':
      return '暂存';
    default:
      return v;
  }
}

export default {
  name: 'GrantList',
  mixins: [listMixin, userMixin, formMixin],
  components: {
    PageFilter,
    GrantItem,
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
