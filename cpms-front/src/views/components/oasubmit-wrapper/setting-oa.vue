<template>
  <p-modal
    :maskClosable="false"
    title="OA信息设置"
    :visible="visible"
    width="600px"
    @cancel="onCancel"
  >
    <p-form-model ref="form" :model="tempValue" :rules="rules">
      <p-form-model-item label="审批意见" prop="fdAuditNote">
        <p-textarea
          :autoSize="{
            minRows: 4,
          }"
          v-model="tempValue.fdAuditNote"
          placeholder="请输入"
        />
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit" :loading="loading">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import mixin, { EStatus } from './mixin';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdAuditNote: '',
  },
});

export default {
  name: 'setting-oa',
  mixins: [selectionMixin, mixin],
  computed: {
    rules() {
      return {
        fdAuditNote: [
          {
            required: [this.statusMap[EStatus.reject]].indexOf(this.status) > -1,
            message: '请输入审批意见',
            trigger: 'blur',
          },
        ],
      };
    },
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        }

        this.onOk();
      });
    },
  },
};
</script>
