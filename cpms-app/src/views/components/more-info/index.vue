<template>
  <block title="更多信息" theme="primary">
    <van-field label="创建人" :value="tempValue.createByName || tempValue.createBy" readonly />
    <van-field label="更新人" :value="tempValue.updateByName || tempValue.updateBy" readonly />
    <van-field label="创建时间" :value="formatDateTime(tempValue.createTime)" readonly />
    <van-field label="更新时间" :value="formatDateTime(tempValue.updateTime)" readonly />
  </block>
</template>

<script>
import { buildSelectionMixin, formatMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'more-info',
  mixins: [selectionMixin, formatMixin],
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
</style>
