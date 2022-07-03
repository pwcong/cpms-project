<template>
  <div @click="handleDetail">
    <van-cell title="客户名称" :value="tempValue.fdCustomerName" />
    <van-cell title="分公司名称" :value="tempValue.fdSapCompanyName" />
    <van-cell title="销售部名称" :value="tempValue.fdSaleName" />
    <van-cell title="一级渠道" :value="tempValue.fdChannelOneName" />
    <van-cell title="二级渠道" :value="tempValue.fdChannelTwoName" />
    <van-cell title="三级渠道" :value="tempValue.fdChannelThreeName" />
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
  name: 'customer-item',
  mixins: [selectionMixin],
  methods: {
    handleDetail() {
      this.$emit('click', this.tempValue);
    },
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
.van-cell__value {
  min-width: 80%;
}
</style>
