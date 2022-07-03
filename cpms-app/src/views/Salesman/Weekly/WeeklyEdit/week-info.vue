<template>
  <div class="week-info">
    <div class="week-info-wrapper">
      <div>
        <div>{{ tempValue.monday || '--' }}</div>
        <div>一</div>
      </div>
      <div>
        <div>{{ tempValue.tuesday || '--' }}</div>
        <div>二</div>
      </div>
      <div>
        <div>{{ tempValue.wednesday || '--' }}</div>
        <div>三</div>
      </div>
      <div>
        <div>{{ tempValue.thursday || '--' }}</div>
        <div>四</div>
      </div>
      <div>
        <div>{{ tempValue.friday || '--' }}</div>
        <div>五</div>
      </div>
      <div>
        <div>{{ tempValue.saturday || '--' }}</div>
        <div>六</div>
      </div>
      <div>
        <div>{{ tempValue.sunday || '--' }}</div>
        <div>日</div>
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
  name: 'week-info',
  mixins: [selectionMixin, formatMixin],
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.week-info {
  background-color: white;
  border-top: 1px solid #eeeeee;
  overflow-y: auto;

  &-wrapper {
    display: flex;
    align-items: center;
    & > div {
      flex: 1;
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
