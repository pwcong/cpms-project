<template>
  <div class="project-counter">
    <div>
      <div>{{ tempValue.fdProjectTotal || 0 }}</div>
      <div>总项目数</div>
    </div>
    <div>
      <div>{{ tempValue.fdProjectTransitCount || 0 }}</div>
      <div>在途项目数</div>
    </div>
    <div>
      <div>{{ formatAmount(tempValue.fdProjectTransitSum || 0) }}</div>
      <div>在途项目总金额(元)</div>
    </div>
    <div>
      <div>{{ tempValue.fdNewProjectCount || 0 }}</div>
      <div>本月新建项目</div>
    </div>
    <div>
      <div>{{ formatAmount(tempValue.fdNewProjectSum || 0) }}</div>
      <div>新建项目总金额(元)</div>
    </div>
    <div>
      <div>{{ tempValue.fdProjectSuccessCount || 0 }}</div>
      <div>成交项目数</div>
    </div>
    <div>
      <div>{{ tempValue.fdFailProjectCount || 0 }}</div>
      <div>失效项目数</div>
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
.project-counter {
  display: flex;
  padding: 16px 0;
  & > div {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #333333;
    position: relative;

    &:not(:last-child)::after {
      position: absolute;
      content: '';
      width: 1px;
      background-color: #dddddd;
      height: 32px;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    & > div:nth-child(1) {
      margin-bottom: 4px;
      font-size: 16px;
      font-weight: bold;
      color: #e50113;
    }
  }
}
</style>
