<template>
  <div class="project-item" @click="handleDetail(tempValue.id)">
    <div class="title">
      {{ tempValue.fdModuleType || '-' }}
    </div>
    <div class="desc">
      <span>拜访人:</span>
      {{ tempValue.fdVisitName || '-' }}
    </div>
    <div class="desc">
      <span>拜访地址:</span>
      {{ tempValue.fdVisitAddress || '-' }}
    </div>
    <div class="desc">
      <span>单据编号:</span>
      {{ tempValue.fdNumber || '-' }}
    </div>
    <div class="desc">
      <span>业务员:</span>
      {{ tempValue.fdUserName || '-' }}
    </div>
    <div class="desc">
      <span>业务员所属部门:</span>
      {{ tempValue.fdDeptName || '-' }}
    </div>
    <div class="desc">
      <span>拜访目的:</span>
      {{ tempValue.fdVisitPurpose || '-' }}
    </div>
    <div class="desc">
      <span>创建时间:</span>
      {{ formatDateTime(tempValue.createTime) || '-' }}
    </div>
    <div class="right">
      <status-tag :status="tempValue.fdStatus">
        {{ tempValue.fdStatus | foramtStatus }}
      </status-tag>
    </div>
    <div class="bottom">
      <van-button size="mini" plain type="default">{{ tempValue.fdVisitType | formatType }}</van-button>
      <van-button size="mini" plain type="default">打卡{{ tempValue.fdClockCount }}次</van-button>
      <van-button size="mini" plain type="default">反馈{{ tempValue.fdFeedbackCount }}次</van-button>
    </div>
  </div>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';
import dayjs from 'dayjs';
import StatusTag from '@/views/components/status-tag';
import formMixin from '@/views/Salesman/Visit/VisitEdit/form';
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'visit-item',
  mixins: [formMixin, selectionMixin, formatMixin],
  components: {
    StatusTag,
  },
  methods: {
    checkAllowEdit(record) {
      if (record.fdClockCount > 0 || record.fdFeedbackCount > 0 || dayjs().valueOf() > record.fdVisitPlanEndTime) {
        return false;
      }

      return true;
    },
  },
  filters: {
    formatType(v) {
      switch (v) {
        case 'cust':
          return '客户拜访';
        case 'project':
          return '项目拜访';
        case 'clue':
          return '线索拜访';
        default:
          return '未知';
      }
    },
    foramtStatus(v) {
      switch (v) {
        case 'draft':
          return '暂存';
        case 'todo':
          return '有效';
        default:
          return v;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.project-item {
  background-color: white;
  font-size: 12px;
  padding: 10px;
  position: relative;
  .title {
    font-size: 14px;
    color: #333333;
    padding-right: 80px;
  }

  .desc {
    margin-top: 6px;
    margin-bottom: 6px;
    color: #666666;
    padding-right: 80px;
  }

  .right {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .bottom {
    margin-top: 10px;
    font-size: 0;
  }
}
</style>
