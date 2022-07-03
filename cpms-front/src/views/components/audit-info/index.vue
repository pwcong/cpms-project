<template>
  <block title="审批信息" theme="primary">
    <template #title>
      <span> 审批信息 </span>
      <span style="font-size: 12px; margin-left: 8px">
        <p-button-link @click="onRefresh"> 点击刷新 </p-button-link>
      </span>
    </template>

    <template #action v-if="!!processUrl">
      <a :href="processUrl" target="_blank">
        <p-button type="primary">查看OA流程</p-button>
      </a>
    </template>

    <p-spin :spinning="loading">
      <p-row style="margin-top: 16px" :gutter="24">
        <p-col :span="8">
          <p-form-model-item label="当前环节">
            <p-input :value="formData['当前环节']" read-only />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="当前处理人">
            <p-input :value="formData['当前处理人']" read-only />
          </p-form-model-item>
        </p-col>
        <p-col :span="8">
          <p-form-model-item label="已处理人">
            <p-input :value="formData['已处理人']" read-only />
          </p-form-model-item>
        </p-col>
      </p-row>
    </p-spin>
  </block>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';

const listMixin = buildListMixin({
  relation: ['moduleId', 'moduleFlag'],
  getQuery: (_, query) => ({
    ...query,
    limit: query.pageSize,
    fdModuleId: _.moduleId,
    fdModuleFlag: _.moduleFlag,
  }),
  getData: async (_, query) => {
    if (!!query.fdModuleFlag && !!query.fdModuleId) {
      const data = await api.common.getAuditInfo(query);

      _.processUrl = data.url;
      _.formData = (data.msg || []).reduce((p, c) => {
        p[c.name] = c.value;
        return p;
      }, {});
    } else {
      _.formData = {};
    }

    return Promise.resolve({
      data: [],
    });
  },
});

export default {
  name: 'audit-info',
  props: {
    moduleFlag: String,
    moduleId: String,
  },
  mixins: [listMixin, formatMixin],
  data() {
    return {
      formData: {},
      processUrl: '',
    };
  },
};
</script>
