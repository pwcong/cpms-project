<template>
  <list-layout class="my-create-list">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="我创建的"
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
        <!-- <info-card></info-card> -->
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
                <!-- 我创建的 -->
                <card-item
                  :value="item"
                  :query="{ queryType: 'createBy' }"
                  @change="onRefresh"
                  :checkActions="['edit', 'allot', 'release', 'follow', 'discard', 'changeCust', 'changeProject']"
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
import { buildListMixin, userMixin } from '@/mixins';

import api from '@/api';
import CardItem from '../components/card-item';
import PageFilter, { convertFilter2Query } from '../components/filter/clue';
import formMixin from '../ClueEdit/form';
import { commonMixin } from '@/views/mixins';

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
    queryType: 'createBy',
  }),
  getData: async (_, query) => {
    let res = await api.clue.getMyClueList(query);
    return res;
  },
});

export default {
  name: 'ClueMyCreate',
  mixins: [listMixin, userMixin, commonMixin, formMixin],
  components: {
    PageFilter,
    CardItem,
    // listCard,
    // infoCard,
  },
  data() {
    return {
      showFilter: false,
      selectedId: '',
      version: 0,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.my-create-list {
  .list-layout-toolbar {
    display: flex;
    align-items: center;
    .van-search {
      flex: 1;
    }
  }
}
</style>
