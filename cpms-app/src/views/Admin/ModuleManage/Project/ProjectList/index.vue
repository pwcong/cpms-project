<template>
  <list-layout class="page-project-list">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="项目列表"
        left-text="返回"
        left-arrow
        right-text="新建"
        @click-left="handleCancel"
        @click-right="showProjectType = true"
      />
    </template>

    <template v-slot:toolbar="{ className }">
      <div :class="className" style="top: 46px">
        <div class="toolbar">
          <van-search v-model="query.fdName" placeholder="请输入项目名称搜索" />
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
              <project-item :value="item" @change="onRefresh" />
            </template>
          </card-list>
        </van-list>
      </van-pull-refresh>
    </template>

    <project-filter v-model="query.filter" :visible.sync="showFilter" />

    <selection-project-type
      title="选择项目类型"
      :type="1"
      :value="[]"
      :visible.sync="showProjectType"
      @change="handleSelectProjectType"
      searchable
    />
  </list-layout>
</template>

<script>
import api from '@/api';
import { buildListMixin, userMixin } from '@/mixins';
import ProjectFilter, { convertFilter2Query } from '../../../../Business/components/filter/project';

import SelectionProjectType from '../../../../Business/components/selection/project-type';
import ProjectItem from './item';

const listMixin = buildListMixin({
  properties: [
    'fdName',
    {
      key: 'filter',
      value: {
        createTime: [],
        updateTime: [],
        fdProjectTypeId: [],
      },
    },
  ],
  getQuery: (_, query) => ({
    pageNo: query.pageNo,
    limit: query.pageSize,
    fdName: query.fdName,
    ...convertFilter2Query(query.filter),
  }),
  getData: async (_, query) => {
    const report = await api.business.getProjectReportList(query);
    _.report = report;

    const result = await api.business.getProjectList(query);
    return result;
  },
});

export default {
  name: 'ProjectList',
  mixins: [listMixin, userMixin],
  components: {
    ProjectFilter,
    ProjectItem,
    SelectionProjectType,
  },
  data() {
    return {
      showFilter: false,
      showProjectType: false,
      report: {},
    };
  },
  methods: {
    handleCancel() {
      this.$root.goBack();
    },
    handleCreate(query = {}) {
      this.$router.push({
        path: '/Business/ProjectCreate',
        query,
      });
    },
    handleSelectProjectType(res) {
      res = res[0];
      if (!!res) {
        this.handleCreate({
          projectTypeId: res.value,
          projectTypeName: res.text,
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.page-project-list {
  .toolbar {
    display: flex;
    align-items: center;
    .van-search {
      flex: 1;
    }
  }
}
</style>
