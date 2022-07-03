<template>
  <block title="合同信息" theme="primary">
    <div class="table">
      <div class="table-main">
        <table v-if="list.length > 0">
          <thead>
            <th>序号</th>
            <th>合同相对方名称</th>
            <th>项目名称</th>
            <th>创建时间</th>
            <th>合同开始时间</th>
            <th>合同截至时间</th>
            <th>合同总金额(元)</th>
            <th>合同法人</th>
            <th>合同类别</th>
            <th>审批状态</th>
            <th>操作</th>
          </thead>

          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdPartyFullName }}</td>
              <td>{{ item.fdProjectMainName }}</td>
              <td>{{ formatDateTime(item.createTime) }}</td>
              <td>{{ formatDateTime(item.fdBeginTime) }}</td>
              <td>{{ formatDateTime(item.fdEndTime) }}</td>
              <td>{{ item.fdTermContractPrice }}</td>
              <td>{{ item.fdCorporateCode }}</td>
              <td>
                <dict-text
                  dictCode="cpms_contract_type"
                  systemCode="cpms"
                  :value="(item.fdContractTypeCode || '').split(',')"
                />
              </td>
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
      ? api.contract.getContractList(query)
      : Promise.resolve({
          data: [],
        });
  },
});

export default {
  name: 'contract-panel',
  props: {
    moduleId: String,
  },
  mixins: [listMixin, formatMixin],
  methods: {
    handleDetail(record) {
      this.$router.push({
        path: `/Business/Contract/ContractDetail/${record.id}`,
      });
    },
  },
  filters: {
    formStatus(v) {
      switch (v) {
        case 'draft':
          return '草稿';
        case 'todo':
          return '待审批';
        case 'reject':
          return '驳回';
        case 'pass':
          return '审批通过';
        case 'audit':
          return '审批中';
        default:
          return v || '--';
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
