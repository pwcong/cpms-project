<template>
  <div class="weekly-item" @click="handleDetail(tempValue.id)">
    <van-cell title="周报名称" :value="`${tempValue.fdYear} 年第 ${tempValue.fdWeek} 周周报`" />
    <van-cell title="业务员" :value="tempValue.fdUserName" />
    <van-cell title="所属部门" :value="tempValue.fdDeptName" />
    <van-cell title="本周重点工作" :value="tempValue.fdMonthPerformance" />
    <van-cell title="重大项目进展" :value="tempValue.fdProjectProgress" />
    <van-cell title="本周目标达成" :value="tempValue.fdWeeklySituation" />
    <van-cell title="所需支持" :value="tempValue.fdNeedHelp" />
    <van-cell title="创建时间" :value="formatDateTime(tempValue.createTime)" />
    <van-cell title="审核状态">
      <status-tag :status="tempValue.fdStatus">
        {{ formatStatus(tempValue.fdStatus) }}
      </status-tag>
    </van-cell>
  </div>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';
import StatusTag from '@/views/components/status-tag';
import formMixin from '@/views/Salesman/Weekly/WeeklyEdit/form';
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'project-item',
  components: {
    StatusTag,
  },
  mixins: [formMixin, selectionMixin, formatMixin],
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
