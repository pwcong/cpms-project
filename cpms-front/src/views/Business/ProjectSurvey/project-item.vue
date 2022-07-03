<template>
  <div class="project-item">
    <div>
      <span>项目名称：</span>
      <span>{{ tempValue.fdName }}</span>
    </div>
    <div>
      <span>客户/代理商：</span>
      <span>{{ tempValue.fdCustName }}</span>
    </div>
    <div>
      <span>项目把握度：</span>
      <span>{{ tempValue.fdSuccessRate || '--' }}%</span>
    </div>
    <div>
      <span>项目预计总金额(元)：</span>
      <span>{{ formatAmount(tempValue.fdProjectSum) }}</span>
    </div>
    <div>
      <span>负责人：</span>
      <span>{{ tempValue.fdUserName }}</span>
    </div>
    <div>
      <span>产品线：</span>
      <span>{{ tempValue.productLineName }}</span>
    </div>
    <div>
      <span>项目最后更新时间：</span>
      <span>{{ formatDateTime(tempValue.fdUpdateTime) }}</span>
    </div>
  </div>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  mixins: [selectionMixin, formatMixin],
};
</script>

<style lang="scss" scoped>
.project-item {
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #eeeeee;
  &:hover {
    background-color: #f5f5f5;
  }

  div {
    font-size: 13px;
    span:nth-child(1) {
      font-size: 12px;
      color: #999999;
    }
  }
}
</style>
