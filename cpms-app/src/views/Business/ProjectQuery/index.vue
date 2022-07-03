<template>
  <list-layout class="project-query">
    <template v-slot:header="{ className }">
      <van-nav-bar :class="className" title="项目查重" left-text="返回" left-arrow @click-left="handleCancel(false)" />
    </template>

    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div class="filter">
          <van-search v-model="query.fdName" placeholder="请输入项目名称"> </van-search>
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
              <card-item :data="item"></card-item>
            </template>
          </card-list>
        </van-list>
      </van-pull-refresh>
    </template>
    <page-filter v-model="query.filter" :visible.sync="showFilter" />
  </list-layout>
</template>

<script>
import CardItem from './query-item';
import api from '@/api';
import { buildListMixin, userMixin } from '@/mixins';

import PageFilter, { convertFilter2Query } from '../components/filter/project-query';

import formMixin from '../ProjectEdit/form';

const listMixin = buildListMixin({
  properties: [
    'fdName',
    {
      key: 'filter',
      value: {},
    },
  ],
  getQuery: (_, query) => ({
    ...convertFilter2Query(query.filter),
    pageNo: query.pageNo,
    limit: query.pageSize,
    fdName: query.fdName,
    ...query,
  }),
  getData: async (_, query) => {
    let data = await api.business.getProjectCheckList(query);
    return data;
  },
});

export default {
  name: 'ProjectQuery',
  mixins: [listMixin, userMixin, formMixin],
  components: {
    PageFilter,
    CardItem,
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

.project-query {
  .filter {
    display: flex;
    align-items: center;
    .van-search {
      flex: 1;
    }
  }
  .card-list {
    background-color: #fff;
  }
}
</style>
