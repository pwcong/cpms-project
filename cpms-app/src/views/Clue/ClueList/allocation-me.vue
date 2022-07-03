<template>
  <list-layout class="allocation-me-list">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="我跟进的"
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
                <card-item
                  :checkActions="[
                    'edit',
                    'allot',
                    'release',
                    'follow',
                    'visit',
                    'discard',
                    'followUp',
                    'changeCust',
                    'changeProject',
                  ]"
                  :value="item"
                  :query="{ queryType: 'followBy' }"
                  @change="onRefresh"
                />
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
import omit from 'omit.js';
import CardItem from '../components/card-item';
import api from '@/api';
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
    queryType: 'followBy',
  }),
  getData: async (_, query) => {
    let data = await api.clue.getMyClueList(query);
    return data;
  },
});

export default {
  name: 'ClueAllocationMe',
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

.allocation-me-list {
  .list-layout-toolbar {
    display: flex;
    align-items: center;
    .van-search {
      flex: 1;
    }
  }
}
</style>
