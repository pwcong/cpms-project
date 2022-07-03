<template>
  <div @click="handleDetail">
    <van-cell title="机构名称" :value="tempValue.fdName" />
    <van-cell title="机构编码" :value="tempValue.fdCode" />
  </div>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});
export default {
  name: 'agency-item',
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
