<template>
  <p-modal
    :maskClosable="false"
    title="跟进操作"
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
      <p-form-model-item label="跟进内容" prop="fdRecord">
        <p-textarea
          v-model="tempValue.fdRecord"
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
import { buildSelectionMixin, userMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdRecord: '',
  },
});

export default {
  name: 'operation-fdrecord',
  mixins: [selectionMixin, userMixin],
  props: {
    moduleId: String,
  },
  data() {
    return {
      rules: {
        fdRecord: [{ required: true, message: '请输入跟进内容', trigger: 'blur' }],
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
          title: '请确认是否要跟进内容此线索?',
          onOk: async () => {
            await api.common.postFollowRecord({
              ...this.tempValue,
              fdIsValid: '',
              fdUserName: this.user.name,
              fdLoginName: this.user.uid,
              fdRelateModule: 'cpms_clue_main',
              fdRelateModuleId: this.moduleId,
            });

            this.$message.success('线索跟进内容成功');
            this.onOk();
          },
          onCancel: () => {},
        });
      });
    },
  },
};
</script>
