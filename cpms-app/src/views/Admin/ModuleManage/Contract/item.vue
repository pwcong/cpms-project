<template>
  <div class="project-item" @click="handleDetail">
    <div class="left">
      <div class="title">{{ tempValue.fdProjectMainName || '--' }}</div>
      <div class="desc">
        <span>法人: </span>
        <span>{{ tempValue.fdCorporateCode || '--' }}</span>
      </div>
      <div class="desc">
        <span>客户: </span>
        <span>{{ tempValue.fdCustName || '--' }}</span>
      </div>
      <div class="desc">
        <span>合同金额(元): </span>
        <span>{{ formatAmount(tempValue.fdTermContractPrice) || '0' }}元</span>
      </div>
    </div>
    <div class="right">
      <status-tag :status="tempValue.fdStatus">
        {{ tempValue.fdStatus | formStatus }}
      </status-tag>
    </div>

    <div class="bottom">
      <div style="text-align: right; margin-top: 10px">
        <van-button size="small" type="danger" v-if="checkButton(tempValue, 'contractEdit')" @click.stop="handleEdit">
          编辑
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import StatusTag from '@/views/components/status-tag';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});
export default {
  mixins: [selectionMixin, formatMixin, commonMixin],
  components: {
    StatusTag,
  },
  name: 'contract-item',
  methods: {
    handleDetail() {
      this.$router.push({
        path: `/Business/Contract/ContractDetail/${this.tempValue.id}`,
      });
    },
    handleEdit() {
      this.$router.push({
        path: `/Business/Contract/ContractEdit/${this.tempValue.id}`,
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
