<template>
  <p-modal title="原始实体参数" :visible="visible" width="600px" @cancel="onCancel">
    <p-textarea
      v-model="fdRequestModel"
      readOnly
      :autoSize="{
        minRows: 10,
      }"
    />
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'entity-parameter',
  mixins: [selectionMixin],
  props: {
    fdRequestModel: String,
  },
  data() {
    return {};
  },
  methods: {
    handleSubmit() {
      this.onOk();
    },
  },
};
</script>
