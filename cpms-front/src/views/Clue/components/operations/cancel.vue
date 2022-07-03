<template>
  <p-modal
    :maskClosable="false"
    title="作废操作"
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
      <p-form-model-item label="作废理由" prop="fdDiscardDescription">
        <p-textarea
          v-model="tempValue.fdDiscardDescription"
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
    fdDiscardDescription: '',
  },
});

export default {
  name: 'operation-cancel',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
    version: {
      type: Number,
    },
  },
  data() {
    return {
      rules: {
        fdDiscardDescription: [
          { required: true, message: '请输入作废理由', trigger: 'blur' },
        ],
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
          title: '请确认是否要作废此线索?',
          onOk: async () => {
            await api.clue.putDiscardClue({
              deleteParamList: [
                {
                  id: this.moduleId,
                  version: this.version,
                },
              ],
              // version: this.version,
              ...this.tempValue,
            });

            this.$message.success('线索作废成功');
            this.onOk();
          },
          onCancel: () => {},
        });
      });
    },
  },
};
</script>
