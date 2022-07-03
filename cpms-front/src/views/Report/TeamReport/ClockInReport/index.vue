<template>
  <list-layout>
    <template v-slot:header>
      <block>
        <template v-slot:title>
          <p-breadcrumb>
            <p-breadcrumb-item>首页</p-breadcrumb-item>
            <p-breadcrumb-item>报表管理</p-breadcrumb-item>
            <p-breadcrumb-item>团队报表</p-breadcrumb-item>
            <p-breadcrumb-item>团队打卡报表</p-breadcrumb-item>
          </p-breadcrumb>
        </template>
      </block>
    </template>
    <template v-slot:toolbar="{ className }">
      <div :class="className" style="margin-top: 32px">
        <p-switch-form :col="3" :model="query">
          <p-switch-form-item label="创建时间">
            <p-range-picker v-model="query.createTime" />
          </p-switch-form-item>
          <p-switch-form-item label="业务员">
            <p-select-user
              placeholder="请选择"
              :selectData="query.fdLoginName"
              @confirm="query.fdLoginName = $event"
            />
          </p-switch-form-item>
          <p-form-model-item label="部门">
            <p-select-org
              placeholder="请选择"
              orgType="1"
              :selectData="query.fdDeptCode"
              @confirm="query.fdDeptCode = $event"
            />
          </p-form-model-item>
          <p-switch-form-item label="工号">
            <p-input v-model="query.userCode" placeholder="请输入" />
          </p-switch-form-item>
          <template slot="button">
            <p-button
              style="margin-top: -4px"
              type="primary"
              @click="onRefresh(false)"
              icon="search"
            />
          </template>
        </p-switch-form>
      </div>
    </template>
    <template v-slot:main="{ className }">
      <div :class="className">
        <p-tabs>
          <p-tab-pane key="echart" tab="报表页">
            <report :reportQuery="reportQuery" />
          </p-tab-pane>
          <p-tab-pane key="detail" tab="详情页"> </p-tab-pane>
        </p-tabs>
      </div>
    </template>
  </list-layout>
</template>

<script>
import { buildListMixin, formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import Report from './report';

const listMixin = buildListMixin({
  properties: [
    'userCode',
    { key: 'fdLoginName', value: [] },
    { key: 'createTime', value: [] },
    { key: 'fdProductLineCode', value: [] },
    { key: 'fdDeptCode', value: [] },
  ],
  getQuery: (_, query) => {
    const { createTime = [] } = query;
    let targetQuery = {
      pageNo: query.pageNo,
      limit: query.pageSize,
      userCode: query.userCode,
      fdDeptCode: (query.fdDeptCode[0] || {}).code,
      fdLoginName: (query.fdLoginName[0] || {}).uid,
    };

    if (createTime.length > 0) {
      targetQuery = {
        ...targetQuery,
        fdCreateBeginTime: `${createTime[0].format('YYYY-MM-DD')} 00:00:00`,
        fdCreateEndTime: `${createTime[1].format('YYYY-MM-DD')} 23:59:59`,
      };
    }
    _.reportQuery = targetQuery;
    return targetQuery;
  },
  getData: (_, query) => {
    return Promise.resolve({
      data: [],
    });
  },
});

export default {
  name: '团队打卡报表',
  mixins: [listMixin, commonMixin, formatMixin],
  components: {
    Report,
  },
  data() {
    return {
      reportQuery: {},
    };
  },
};
</script>
