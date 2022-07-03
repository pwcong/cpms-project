<template>
  <list-layout class="page-project-survey">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="项目推进状态"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(false)"
      />
    </template>

    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div class="filter">
          <van-search v-model="query.fdUserName" placeholder="请输入业务员名称" @input="onSearch"> </van-search>
          <filter-trigger :value="query.filter" @click="showFilterEvent" />
        </div>
        <van-cell
          title="项目类型"
          required
          is-link
          @click="showProjectType = true"
          :value="(query.fdProjectTypeId[0] || {}).text"
          value-class="cell-right"
        />
        <data-grid
          :value="[
            {
              key: 'fdProjectTotal',
              title: '总项目数',
              value: report.fdProjectTotal || 0,
            },
            {
              key: 'fdProjectTransitCount',
              title: '在途项目数',
              value: report.fdProjectTransitCount || 0,
            },
            {
              key: 'fdProjectTransitSum',
              title: '在途项目总金额(元)',
              value: formatAmount(report.fdProjectTransitSum || 0),
            },
            {
              key: 'fdNewProjectCount',
              title: '本月新建项目',
              value: report.fdNewProjectCount || 0,
            },
            {
              key: 'fdNewProjectSum',
              title: '新建项目总金额(元)',
              value: formatAmount(report.fdNewProjectSum || 0),
            },
            {
              key: 'fdProjectSuccessCount',
              title: '成交项目数',
              value: report.fdProjectSuccessCount || 0,
            },
            {
              key: 'fdFailProjectCount',
              title: '失效项目数',
              value: report.fdFailProjectCount || 0,
            },
          ]"
        />
      </div>
    </template>
    <template v-slot:main="{ className }">
      <van-pull-refresh
        style="top: 195px; height: calc(100vh - 195px)"
        :class="className"
        :value="loading && !loadingMore"
        @refresh="onRefresh"
      >
        <van-list
          :value="loadingMore"
          :finished="!hasMore"
          finished-text="没有更多了"
          @load="onLoadMore"
          style="height: 100%; overflow-y: hidden"
        >
          <template>
            <card-item v-if="list.length > 0" v-model="list"></card-item>
            <div v-else class="noMore"></div>
          </template>
        </van-list>
      </van-pull-refresh>
    </template>

    <page-filter v-model="query.filter" :visible.sync="showFilter" />

    <selection-project-type
      title="选择项目类型"
      searchable
      :visible.sync="showProjectType"
      v-model="query.fdProjectTypeId"
      search
    />
  </list-layout>
</template>

<script>
import CardItem from './info-item';
import api from '@/api';
import SelectionProjectType from '../components/selection/project-type';
import { buildListMixin, userMixin, formatMixin } from '@/mixins';
import PageFilter, { convertFilter2Query } from '../components/filter/project-survey';

import formMixin from '../ProjectEdit/form';

const listMixin = buildListMixin({
  properties: [
    'fdUserName',
    {
      key: 'fdProjectTypeId',
      value: [],
    },
    {
      key: 'filter',
      value: {},
    },
  ],
  getQuery: (_, query) => ({
    ...convertFilter2Query(query.filter),
    limit: query.pageSize,
    pageNo: query.pageNo,
    fdUserName: query.fdUserName,
    fdProjectTypeId: (query.fdProjectTypeId[0] || {}).value,
  }),
  getData: async (_, query) => {
    const data = await api.business.getProjectFollowList(query);
    data.data = (data.data || []).sort((a, b) => {
      switch (true) {
        case a.fdSortSum > b.fdSortSum:
          return 1;
        case a.fdSortSum < b.fdSortSum:
          return -1;
        default:
          return 0;
      }
    });
    _.report = data;

    return data;
  },
});

export default {
  name: 'ProjectSurvey',
  mixins: [listMixin, userMixin, formMixin, formatMixin],
  components: {
    PageFilter,
    CardItem,
    SelectionProjectType,
  },
  data() {
    return {
      showFilter: false,
      report: {},
      showProjectType: false,
    };
  },
  methods: {
    showFilterEvent() {
      const { fdProjectTypeId = [] } = this.query;
      if (fdProjectTypeId.length <= 0) {
        this.showFilter = false;
        this.$toast.fail('请优先选择项目类型搜索');
        return;
      } else {
        this.showFilter = true;
      }
      // this.query = { ...this.query }
    },
    onSearch(val) {
      if (val.trim().length > 0) {
        const { fdProjectTypeId = [] } = this.query;
        if (fdProjectTypeId.length <= 0) {
          this.$toast.fail('请优先选择项目类型搜索');
          return;
        }
      }
    },
  },
  created() {
    this.showFilterEvent();
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.page-project-survey {
  .filter {
    display: flex;
    align-items: center;
    .van-search {
      flex: 1;
    }
  }
  .project-follow {
    background-color: #fff;
  }
  .van-cell {
    font-size: 12px;
  }
  .cell-right {
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 3;
  }
}
</style>
