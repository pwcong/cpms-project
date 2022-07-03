<template>
  <div class="system-data">
    <div>
      本周拜访计划<span>{{ tempValue.planCount || 0 }} 个</span>
    </div>
    <div>
      本周已拜访计划<span>{{ tempValue.feedbackCount || 0 }} 个</span>
    </div>
    <div>
      本周拜访比例<span>{{ tempValue.percentage || '--' }} %</span>
    </div>
    <div>
      本周项目报备<span>{{ tempValue.projectCount || 0 }} 个</span>
    </div>
    <div>
      本周客户新建<span>{{ tempValue.custCount || 0 }} 个</span>
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
.system-data {
  display: flex;
  font-size: 14px;
  color: #666666;
  & > div {
    flex: 1;
    text-align: center;

    span {
      font-size: 18px;
      margin-left: 6px;
      color: #e50113;
    }
  }
}
</style>
