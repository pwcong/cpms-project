<template>
  <block title="更多信息" style="margin-top: 16px" theme="primary">
    <p-row style="margin-top: 16px" :gutter="24">
      <p-col :span="8">
        <p-form-model-item label="创建人">
          <p-input :value="tempValue.createByName || tempValue.createBy" read-only />
        </p-form-model-item>
      </p-col>
      <p-col :span="8">
        <p-form-model-item label="更新人">
          <p-input :value="tempValue.updateByName || tempValue.updateBy" read-only />
        </p-form-model-item>
      </p-col>
      <p-col :span="8">
        <p-form-model-item label="创建时间">
          <p-input :value="formatDateTime(tempValue.createTime)" read-only />
        </p-form-model-item>
      </p-col>
      <p-col :span="8">
        <p-form-model-item label="更新时间">
          <p-input :value="formatDateTime(tempValue.updateTime)" read-only />
        </p-form-model-item>
      </p-col>
    </p-row>
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
