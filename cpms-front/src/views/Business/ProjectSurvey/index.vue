<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>商机管理</p-breadcrumb-item>
            <p-breadcrumb-item>项目推进状态</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 16px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="业务员名称">
            <p-input v-model="query.fdUserName" placeholder="请输入" />
          </p-switch-form-item>
          <p-switch-form-item label="客户/代理商">
            <select-customer
              status="pass"
              v-model="query.fdCustMainId"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
          <p-switch-form-item label="项目类型" required>
            <select-project-type
              :type="0"
              v-model="query.fdProjectTypeId"
              placeholder="请选择"
              allow-clear
            />
          </p-switch-form-item>
          <p-switch-form-item label="产品线">
            <select-product-line
              v-model="query.fdProductLine"
              placeholder="请选择"
              allow-clear
              multiple
            />
          </p-switch-form-item>
          <p-switch-form-item label="项目状态">
            <select-project-status
              v-model="query.fdProjectStatus"
              placeholder="请选择"
              allow-clear
              multiple
            />
          </p-switch-form-item>
          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.createTime" />
          </p-switch-form-item>
          <p-switch-form-item label="更新时间">
            <p-range-picker v-model="query.updateTime" />
          </p-switch-form-item>
          <template slot="button">
            <p-button type="primary" @click="handleSearch" icon="search" />
          </template>
        </p-switch-form>
      </div>
    </template>
    <template v-slot:main="{ className }">
      <div :class="className">
        <project-counter v-model="report" />
        <project-follow v-model="list" />
      </div>
    </template>
  </list-layout>
</template>

<script>
import api from '@/api';
import { buildListMixin } from '@/mixins';

import ProjectCounter from '../ProjectList/project-counter';
import ProjectFollow from './project-follow';
import SelectProjectStatus from '../components/select/project-status';
import SelectProjectType from '../components/select/project-type';
import SelectCustomer from '@/views/components/select/customer';
import SelectProductLine from '@/views/components/select/product-line';

const listMixin = buildListMixin({
  properties: [
    'fdUserName',
    { key: 'fdCustMainId', value: [] },
    {
      key: 'fdProjectTypeId',
      value: [],
    },
    { key: 'fdProductLine', value: [] },
    { key: 'createTime', value: [] },
    { key: 'updateTime', value: [] },
    { key: 'fdProjectStatus', value: [] },
  ],
  getQuery: (_, query) => {
    const { createTime = [], updateTime = [] } = query;

    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      fdUserName: query.fdUserName,
      fdCustMainId: (query.fdCustMainId[0] || {}).value,
      fdProjectTypeId: (query.fdProjectTypeId[0] || {}).value,
      fdProductLine: query.fdProductLine.map((d) => d.value).join(','),
      fdProjectStatus: query.fdProjectStatus.map((d) => d.value).join(','),
    };

    if (createTime.length > 0) {
      targetQuery = {
        ...targetQuery,
        fdCreateStartTime: `${createTime[0].format('YYYY-MM-DD')} 00:00:00`,
        fdCreateEndTime: `${createTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    if (updateTime.length > 0) {
      targetQuery = {
        ...targetQuery,
        fdUpdateStartTime: `${updateTime[0].format('YYYY-MM-DD')} 00:00:00`,
        fdUpdateEndTime: `${updateTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }

    return targetQuery;
  },
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
  name: '项目推进状态',
  mixins: [listMixin],
  components: {
    SelectProjectType,
    SelectCustomer,
    SelectProductLine,
    ProjectCounter,
    ProjectFollow,
    SelectProjectStatus,
  },
  data() {
    return {
      report: {},
    };
  },
  methods: {
    handleSearch() {
      const { fdProjectTypeId = [] } = this.query;

      if (fdProjectTypeId.length <= 0) {
        this.$message.error('请选择项目类型搜索');
        return;
      }

      this.query = { ...this.query };
    },
  },
};
</script>

<style lang="scss" scoped></style>
