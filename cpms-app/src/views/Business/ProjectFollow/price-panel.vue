<template>
  <block title="价格信息" theme="primary">
    <div class="table">
      <div class="table-main">
        <table v-if="list.length > 0">
          <thead>
            <th>序号</th>
            <th>客户名称</th>
            <th>项目名称</th>
            <th>预计收入(元)</th>
            <th>创建时间</th>
            <th>合同交货时间</th>
            <th>开始时间</th>
            <th>开单截止时间</th>
            <th>审批状态</th>
            <th>操作</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdCustName }}</td>
              <td>{{ item.fdProjectMainName }}</td>
              <td>{{ item.fdEstimatedRevenue }}</td>
              <td>{{ formatDateTime(item.createTime) }}</td>
              <td>{{ item.fdContractDeliveryTime }}</td>
              <td>{{ formatDateTime(item.fdBeginTime) }}</td>
              <td>{{ formatDateTime(item.fdOrderEndTime) }}</td>
              <td>{{ item.fdStatus | formStatus }}</td>
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
      ? api.price.getPriceList(query)
      : Promise.resolve({
          data: [],
        });
  },
});

export default {
  name: 'price-panel',
  props: {
    moduleId: String,
  },
  mixins: [listMixin, formatMixin],
  watch: {
    moduleId() {
      this.onRefresh();
    },
  },
  methods: {
    handleDetail(record) {
      this.$router.push({
        path: `/Business/Price/PriceDetail/${record.id}`,
      });
    },
  },
  filters: {
    formStatus(v) {
      switch (v) {
        case 'draft':
          return '暂存';
        case 'todo':
          return '待审批';
        case 'reject':
          return '驳回';
        case 'pass':
          return '审批通过';
        case 'audit':
          return '审批中';
        default:
          return v;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
