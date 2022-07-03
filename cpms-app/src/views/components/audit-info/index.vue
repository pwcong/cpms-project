<template>
  <block title="审批信息" theme="primary">
    <van-field label="当前环节" :value="formData['当前环节']" readonly />
    <van-field label="当前处理人" :value="formData['当前处理人']" readonly />
    <van-field label="已处理人" :value="formData['已处理人']" readonly />
  </block>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';

const listMixin = buildListMixin({
  getQuery: (_, query) => ({
    ...query,
    limit: query.pageSize,
    fdModuleId: _.moduleId,
    fdModuleFlag: _.moduleFlag,
  }),
  getData: async (_, query) => {
    if (!!query.fdModuleFlag && !!query.fdModuleId) {
      const data = await api.common.getAuditInfo(query);

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
    };
  },
  watch: {
    moduleId() {
      this.onRefresh();
    },
    moduleFlag() {
      this.onRefresh();
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
