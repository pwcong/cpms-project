<template>
  <list-layout class="pool-list">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="淘一淘"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(false)"
        @click-right="handleCreate"
      />
    </template>

    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div class="filter">
          <van-search v-model="query.keyword" placeholder="输入关键词搜索"> </van-search>
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
              <card-item @change="onRefresh" :value="item" :query="{ queryType: 'disabled' }"></card-item>
            </template>
          </card-list>
        </van-list>
      </van-pull-refresh>
    </template>

    <page-filter v-model="query.filter" :visible.sync="showFilter" />
  </list-layout>
</template>

<script>
import CardItem from '../components/card-item/pick-item';
import api from '@/api';
import omit from 'omit.js';
import { buildListMixin, userMixin } from '@/mixins';
import formMixin from '../ClueEdit/form';
import PageFilter, { convertFilter2Query } from '../components/filter/clue';

const listMixin = buildListMixin({
  properties: [
    'keyword',
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
    ...query,
    queryType: 'disabled',
  }),
  getData: async (_, query) => {
    let data = await api.clue.getMyClueList(query);
    return data;
  },
});

export default {
  name: 'CluePick',
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

.pool-list {
  .filter {
    display: flex;
    align-items: center;
    .van-search {
      flex: 1;
    }
  }
}
</style>
