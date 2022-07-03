<template>
  <div class="week-info">
    <div>
      <div>一</div>
      <div>{{ tempValue.monday || '--' }}</div>
    </div>
    <div>
      <div>二</div>
      <div>{{ tempValue.tuesday || '--' }}</div>
    </div>
    <div>
      <div>三</div>
      <div>{{ tempValue.wednesday || '--' }}</div>
    </div>
    <div>
      <div>四</div>
      <div>{{ tempValue.thursday || '--' }}</div>
    </div>
    <div>
      <div>五</div>
      <div>{{ tempValue.friday || '--' }}</div>
    </div>
    <div>
      <div>六</div>
      <div>{{ tempValue.saturday || '--' }}</div>
    </div>
    <div>
      <div>日</div>
      <div>{{ tempValue.sunday || '--' }}</div>
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
  mixins: [selectionMixin],
};
</script>

<style lang="scss" scoped>
.week-info {
  display: flex;
  font-size: 14px;
  color: #666666;
  & > div {
    flex: 1;
    text-align: center;

    & > div:nth-child(2) {
      margin-top: 4px;
      font-size: 16px;
      color: #e50113;
    }
  }
}
</style>
