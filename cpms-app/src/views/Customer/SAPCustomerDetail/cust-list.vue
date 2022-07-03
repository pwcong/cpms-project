<template>
  <block theme="primary" title="关联客户信息">
    <div class="table">
      <div class="table-main">
        <table v-if="relatedCustList.length > 0">
          <thead>
            <th>序号</th>
            <th>客户名称</th>
            <th>所属行业</th>
            <th>客户类型</th>
            <th>经营状态</th>
            <th>创建人</th>
            <th>名下项目数</th>
            <th>最新更新时间</th>
            <th>申请单状态</th>
            <th>操作</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in relatedCustList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.fdCustName }}</td>
              <td>
                <dict-text :value="(item.fdCustIndustry || '').split(',')" systemCode="cpms" dictCode="cpms_business" />
              </td>
              <td>
                <dict-text :value="(item.fdCustType || '').split(',')" systemCode="cpms" dictCode="cpms_cust_type" />
              </td>
              <td>{{ item.fdCustManageforms }}</td>
              <td>{{ item.createByName }}</td>
              <td>
                {{ item.fdProjectCount || '0' }}
              </td>
              <td>
                {{ formatDateTime(item.updateTime) }}
              </td>
              <td>
                {{ item.fdStatus | foramtStatus }}
              </td>
              <td>
                <van-button type="primary" size="mini" native-type="button" @click="handleDeatil(item, index)">
                  详情
                </van-button>
              </td>
            </tr>
          </tbody>
        </table>

        <van-empty v-else image-size="100px" description="暂无数据" />
      </div>
      <div class="table-footer" v-if="!readonly">
        <van-button plain block type="danger" icon="plus" size="mini" native-type="button"> 关联客户信息 </van-button>
      </div>
    </div>
  </block>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin, formatMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});
export default {
  name: 'sales-list',
  mixins: [selectionMixin, formatMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '审批驳回';
        case 'draft':
          return '草稿';
        default:
          return v;
      }
    },
  },
  data() {
    return {
      relatedCustList: [],
    };
  },
  async created() {
    if (!!this.moduleId) {
      const relatedCustList = await api.customer.getRelatedCust(this.moduleId);
      this.relatedCustList = [relatedCustList];
    }
  },
  methods: {
    handleDeatil(record) {
      this.$router.push({
        path: `/Customer/InterdCustomerDetail/${record.id}`,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
