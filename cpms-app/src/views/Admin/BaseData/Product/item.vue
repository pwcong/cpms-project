<template>
  <div @click="handleDetail">
    <van-cell title="产品名称" :value="tempValue.fdProductName" />
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});
export default {
  name: 'productItem-item',
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
  min-width: 80%;
}
</style>
