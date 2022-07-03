<template>
  <p-modal
    :maskClosable="false"
    title="废弃操作"
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
      <p-form-model-item>
        <span style="font-size: 16px; color: #666666"> 请确认是否要废弃此条数据? </span>
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
  defaultValue: {},
});

export default {
  name: 'operation-release',
  mixins: [selectionMixin],
  props: {
    moduleId: String,
  },
  data() {
    return {
      rules: {},
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.moduleId) {
        return;
      }

      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        }

        await api.contract.delContractMain(this.moduleId);

        this.$message.success('数据废弃成功');
        this.onOk();
      });
    },
  },
};
</script>
