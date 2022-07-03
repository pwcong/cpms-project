<template>
  <p-modal
    :maskClosable="false"
    title="认领操作"
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
        <span style="font-size: 16px; color: #666666"> 请确认是否要认领此线索? </span>
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
  defaultValue: { version: '' },
});

export default {
  name: 'operation-claim',
  mixins: [selectionMixin],
  props: {
    moduleId: String,
    version: Number,
  },
  watch: {
    version() {
      this.tempValue.version = this.version;
    },
  },
  data() {
    return {
      rules: {},
    };
  },
  methods: {
    handleSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        }

        await api.clue.putFollowClue([
          {
            id: this.moduleId,
            version: this.version,
          },
        ]);

        this.$message.success('线索认领成功');

        this.onOk();
      });
    },
  },
};
</script>
