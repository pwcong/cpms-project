<template>
  <p-modal
    :maskClosable="false"
    :title="invalidReasons.action === 'valid' ? '作废操作' : '删除操作'"
    :visible="visible"
    width="600px"
    @cancel="onCancel"
  >
    <p-form-model
      ref="form"
      :model="tempValue"
      :rules="rules"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 16 }"
    >
      <p-form-model-item
        :label="invalidReasons.action === 'valid' ? '作废理由' : '删除理由'"
        prop="fdInvalidReason"
      >
        <p-textarea
          v-model="tempValue.fdInvalidReason"
          :maxLength="500"
          :autoSize="{
            minRows: 4,
          }"
          placeholder="请输入"
        />
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import api from '@/api';
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdInvalidReason: '',
  },
});

export default {
  name: 'operation-cancel',
  mixins: [selectionMixin],
  props: {
    invalidReasons: Object,
  },
  data() {
    return {
      rules: {
        fdInvalidReason: [{ required: true, message: '请输入理由', trigger: 'blur' }],
      },
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }

        this.$confirm({
          title: `${
            this.invalidReasons.action === 'valid'
              ? '请确认是否要作废此客户?'
              : '请确认是否要删除此客户?'
          }`,
          onOk: async () => {
            const query = {
              id: this.invalidReasons.id,
              version: this.invalidReasons.version,
              ...this.tempValue,
            };
            if (this.invalidReasons.action === 'valid') {
              await api.customer.putInvalidCustomer(query);
            } else if (this.invalidReasons.action === 'delete') {
              await api.customer.putDeleteCustomer(query);
            }

            this.$message.success(
              `${
                this.invalidReasons.action === 'valid' ? '客户作废成功' : '客户删除成功'
              }`
            );
            this.onOk();
          },
          onCancel: () => {},
        });
      });
    },
  },
};
</script>
