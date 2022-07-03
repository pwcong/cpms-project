<template>
  <list-layout class="my-allocation-list">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="我分配的"
        left-text="返回"
        left-arrow
        right-text="新建"
        @click-right="handleCreate"
        @click-left="handleCancel(false)"
      />
    </template>

    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <van-search v-model="query.keyword" placeholder="输入关键词搜索"> </van-search>
        <filter-trigger :value="query.filter" @click="showFilter = true" />
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
              <van-cell-group @click="(priceItem = item) && (priceVisible = true)">
                <card-item :value="item" :checkActions="[]" :query="{ queryType: 'allotBy' }" />
              </van-cell-group>
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
import CardItem from '../components/card-item';
import formMixin from '../ClueEdit/form';
import { buildListMixin, userMixin } from '@/mixins';
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
    queryType: 'allotBy',
  }),
  getData: async (_, query) => {
    let data = await api.clue.getMyClueList(query);
    return data;
  },
});

export default {
  name: 'ClueMyAllocation',
  mixins: [listMixin, userMixin, formMixin],
  components: {
    PageFilter,
    CardItem,
    // listCard,
    // infoCard,
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

.my-allocation-list {
  .list-layout-toolbar {
    display: flex;
    align-items: center;
    .van-search {
      flex: 1;
    }
  }
}
</style>
