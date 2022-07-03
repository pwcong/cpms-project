<template>
  <div @click="handleDetail">
    <van-cell title="机构名称" :value="tempValue.fdAgencyName" />
    <van-cell title="业务中心名称" :value="tempValue.fdBusinessName" />
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});
export default {
  name: 'business-item',
  mixins: [selectionMixin],
  methods: {
    handleDetail() {
      this.$emit('click', this.tempValue);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';
.van-cell__value {
  min-width: 70%;
}
</style>
