<template>
  <div @click="handleDetail">
    <van-cell title="街道名称" :value="tempValue.fdStreetName" />
    <van-cell title="Corde" :value="tempValue.fdStreetCode" />
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});
export default {
  name: 'street-item',
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
