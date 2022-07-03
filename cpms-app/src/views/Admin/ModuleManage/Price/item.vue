<template>
  <div class="project-item" @click="handleDetail">
    <div class="left">
      <div class="title">{{ tempValue.fdProjectMainName || '--' }}</div>
      <div class="desc">
        <span>分公司: </span>
        <span>{{ tempValue.fdBranchCompanyName || '--' }}</span>
      </div>
      <div class="desc">
        <span>客户: </span>
        <span>{{ tempValue.fdCustName || '--' }}</span>
      </div>
      <div class="desc">
        <span>项目预计收入: </span>
        <span>{{ formatAmount(tempValue.fdEstimatedRevenue) || '0' }}元</span>
      </div>
    </div>
    <div class="right">
      <status-tag :status="tempValue.fdStatus">
        {{ tempValue.fdStatus | formStatus }}
      </status-tag>
    </div>

    <div class="bottom">
      <div style="text-align: right; margin-top: 10px">
        <van-button size="small" type="danger" v-if="checkButton(tempValue, 'priceEdit')" @click.stop="handleEdit">
          编辑
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';
import StatusTag from '@/views/components/status-tag';
import { commonMixin } from '@/views/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});
export default {
  mixins: [selectionMixin, formatMixin, commonMixin],
  name: 'price-item',
  components: {
    StatusTag,
  },
  methods: {
    handleDetail() {
      this.$router.push({
        path: `/Business/Price/PriceDetail/${this.tempValue.id}`,
      });
    },
    handleEdit() {
      this.$router.push({
        path: `/Business/Price/PriceEdit/${this.tempValue.id}`,
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
@import '@/assets/scss/common.scss';

.project-item {
  background-color: white;
  font-size: 12px;
  padding: 10px;
  color: #666666;
  position: relative;
  .left {
    .title {
      font-size: 14px;
      color: #333333;
      margin-right: 70px;
    }

    .desc {
      margin-top: 6px;
      margin-right: 70px;
    }
  }
  .right {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
