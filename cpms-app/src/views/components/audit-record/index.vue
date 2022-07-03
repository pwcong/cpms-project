<template>
  <block title="审批记录" theme="primary">
    <div class="table">
      <div class="table-main">
        <table v-if="list.length > 0">
          <thead>
            <th>序号</th>
            <th>时间</th>
            <th>节点</th>
            <th>操作人</th>
            <th>动作</th>
            <th>审批意见</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ formatDateTime(item.fdTime) }}</td>
              <td>{{ `${item.fdNodeName}(${item.fdNodeId})` }}</td>
              <td>{{ item.fdUserName }}</td>
              <td>{{ item.fdActionInfo }}</td>
              <td>{{ item.fdOpinion }}</td>
            </tr>
          </tbody>
        </table>

        <van-empty v-else image-size="100px" description="暂无审批记录" />
      </div>
    </div>
  </block>
</template>

<script>
import api from '@/api';
import { buildListMixin, formatMixin } from '@/mixins';

const listMixin = buildListMixin({
  getQuery: (_, query) => ({
    ...query,
    limit: 999,
    fdModuleId: _.moduleId,
    fdModuleFlag: _.moduleFlag,
  }),
  getData: (_, query) => {
    return !!query.fdModuleId && !!query.fdModuleFlag
      ? api.common.getAuditRecord(query)
      : Promise.resolve({
          data: [],
        });
  },
});

export default {
  name: 'audit-record',
  props: {
    moduleFlag: String,
    moduleId: String,
  },
  mixins: [listMixin, formatMixin],
  watch: {
    moduleId() {
      this.onRefresh();
    },
    moduleFlag() {
      this.onRefresh();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
