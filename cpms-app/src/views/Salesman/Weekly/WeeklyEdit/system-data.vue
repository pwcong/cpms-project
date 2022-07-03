<template>
  <div class="system-data">
    <div class="system-data-wrapper">
      <div>
        <div>{{ tempValue.planCount || 0 }}</div>
        <div>本周拜访计划</div>
      </div>
      <div>
        <div>{{ tempValue.feedbackCount || 0 }}</div>
        <div>本周已拜访计划</div>
      </div>
      <div>
        <div>{{ tempValue.percentage || '--' }} %</div>
        <div>本周拜访比例</div>
      </div>
      <div>
        <div>{{ tempValue.projectCount || 0 }}</div>
        <div>本周项目报备</div>
      </div>
      <div>
        <div>{{ tempValue.custCount || 0 }}</div>
        <div>本周客户新建</div>
      </div>
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
  name: 'system-data',
  mixins: [selectionMixin, formatMixin],
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.system-data {
  background-color: white;
  border-top: 1px solid #eeeeee;
  overflow-y: auto;

  &-wrapper {
    display: flex;
    align-items: center;
    & > div {
      white-space: nowrap;
      height: 50px;
      font-size: 12px;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      & > div:nth-child(1) {
        white-space: nowrap;
        font-size: 14px;
        color: $theme-color;
        margin-bottom: 2px;
      }
    }
  }
}
</style>
