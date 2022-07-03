<template>
  <div class="project-sum">
    <div>
      <span>项目总数：</span>
      <span>{{ tempValue.fdProjectTotal }}</span>
    </div>
    <div>
      <span>项目总金额(元)：</span>
      <span>{{ formatAmount(tempValue.fdProjectSum) }}</span>
    </div>
    <div></div>
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
  filters: {
    calcTotalAmount(v) {
      return v.reduce((p, c) => {
        return p + (c.fdProjectSum || 0);
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
.project-sum {
  padding: 6px;
  background-color: #eeeeee;
  font-size: 14px;

  div {
    padding: 2px 0;
  }
}
</style>
