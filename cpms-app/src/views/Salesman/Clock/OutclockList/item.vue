<template>
  <div @click="handleDetail">
    <van-cell title="申请人" :value="tempValue.fdUserName" />
    <van-cell title="打卡地点" :value="tempValue.address" />
    <van-cell title="打卡时间" :value="formatDateTime(tempValue.fdClockTime)" />
    <van-cell title="审批状态">
      <status-tag :status="tempValue.fdStatus">
        {{ formatStatus(tempValue.fdStatus) }}
      </status-tag>
    </van-cell>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { buildSelectionMixin } from '@/mixins';
import StatusTag from '@/views/components/status-tag';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'clock-item',
  mixins: [selectionMixin],
  components: {
    StatusTag,
  },
  methods: {
    handleDetail() {
      this.$router.push({
        path: `/Salesman/Clock/OutclockDetail/${this.tempValue.id}`,
      });
    },
    formatDateTime(v) {
      if (!v) {
        return '-';
      }

      return dayjs(new Date(v)).format('YYYY-MM-DD HH:mm:ss');
    },
    formatStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'draft':
          return '草稿';
        case 'reject':
          return '驳回';
        default:
          return v;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
</style>
