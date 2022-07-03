<template>
  <div class="info">
    <div>
      <div>{{ tempValue.fdProjectTotal || 0 }}</div>
      <div>总线索数</div>
    </div>
    <div>
      <div>{{ tempValue.fdProjectTransitCount || 0 }}</div>
      <div>待认领</div>
    </div>
    <div>
      <div>{{ tempValue.fdNewProjectCount || 0 }}</div>
      <div>已转化</div>
    </div>
    <div>
      <div>{{ tempValue.fdProjectSuccessCount || 0 }}</div>
      <div>已作废</div>
    </div>
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'info-card',
  mixins: [selectionMixin],
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.info {
  background-color: white;
  display: flex;
  align-items: center;
  border-top: 1px solid #eeeeee;
  height: 50px;
  & > div {
    flex: 1;
    text-align: center;
    font-size: 12px;
    & > div:nth-child(1) {
      font-size: 16px;
      color: $theme-color;
      margin-bottom: 2px;
    }
  }
}
</style>
