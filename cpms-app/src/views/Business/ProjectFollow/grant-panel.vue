<template>
  <block title="授权信息" theme="primary">
    <div class="table">
      <div class="table-main">
        <table v-if="list.length > 0">
          <thead>
            <th>序号</th>
            <th>被授权代理商名称</th>
            <th>项目名称</th>
            <th>盖章法人</th>
            <th>创建时间</th>
            <th>被授权时间起</th>
            <th>授权理由</th>
            <th>授权状态</th>
            <th>操作</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdCustName }}</td>
              <td>{{ item.fdProjectName }}</td>
              <td>{{ item.fdCorporateName }}</td>
              <td>{{ formatDateTime(item.createTime) }}</td>
              <td>{{ formatDateTime(item.fdBeginTime) }}</td>
              <td>{{ item.fdReasonSummary }}</td>
              <td>{{ item.fdStatus | foramtStatus }}</td>
              <td @click="handleDetail(item)" style="color: #e50113">详情</td>
            </tr>
          </tbody>
        </table>

        <van-empty v-else image-size="100px" description="暂无数据" />
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
    limit: query.pageSize,
    fdProjectMainId: _.moduleId,
  }),
  getData: (_, query) => {
    return !!query.fdProjectMainId
      ? api.grant.getProjectGrantList(query)
      : Promise.resolve({
          data: [],
        });
  },
});

export default {
  name: 'grant-panel',
  props: {
    moduleId: String,
  },
  mixins: [listMixin, formatMixin],
  methods: {
    handleDetail(record) {
      this.$router.push({
        path: `/Business/Grant/GrantDetail/${record.id}`,
      });
    },
  },
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'success':
          return '通过';
        case 'done':
          return '完成';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '审批驳回';
        case 'draft':
          return '暂存';
        default:
          return v || '-无-';
      }
    },
  },
  watch: {
    moduleId() {
      this.onRefresh();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
