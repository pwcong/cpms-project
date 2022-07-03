<template>
  <div @click="handleDetail">
    <van-cell title="产品分类" :value="tempValue.fdProductCategoryName" />
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});
export default {
  name: 'product-cate-item',
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
