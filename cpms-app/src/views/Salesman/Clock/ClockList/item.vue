<template>
  <div>
    <van-cell title="打卡人" :value="tempValue.fdUserName" />
    <van-cell title="打卡日期" :value="formatDateTime(tempValue.fdClockTime)" />
    <van-cell title="打卡地点" :value="tempValue.fdClockAddress" />
    <van-cell title="打卡类型" :value="formatType(tempValue.fdType)" />
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'clock-item',
  mixins: [selectionMixin],
  methods: {
    formatDateTime(v) {
      if (!v) {
        return '-';
      }

      return dayjs(new Date(v)).format('YYYY-MM-DD HH:mm:ss');
    },
    formatType(v) {
      switch (v) {
        case 'clock':
          return '考勤';
        case 'out':
          return '外勤';
        case 'visit':
          return '拜访';
        default:
          return v || '-';
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
</style>
