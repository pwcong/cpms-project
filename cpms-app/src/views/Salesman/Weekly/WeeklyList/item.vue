<template>
  <div class="weekly-item" @click="handleDetail(tempValue.id)">
    <van-cell title="周报名称" :value="`${tempValue.fdYear} 年第 ${tempValue.fdWeek} 周周报`" />
    <van-cell title="审核状态">
      <status-tag :status="tempValue.fdStatus">
        {{ formatStatus(tempValue.fdStatus) }}
      </status-tag>
    </van-cell>
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import StatusTag from '@/views/components/status-tag';
import formMixin from '../WeeklyEdit/form';
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'project-item',
  components: {
    StatusTag,
  },
  mixins: [formMixin, selectionMixin],
  methods: {
    formatStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '驳回';
        case 'draft':
          return '暂存';
        default:
          return v;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/variables.scss';
.weekly-item {
}
</style>
