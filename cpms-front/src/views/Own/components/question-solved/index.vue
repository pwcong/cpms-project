<template>
  <p-modal
    :maskClosable="false"
    title="问题解决"
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
      <p-form-model-item label="解决方案" prop="fdHandleResult">
        <p-textarea
          v-model="tempValue.fdHandleResult"
          placeholder="请输入"
          :maxLength="500"
          :autoSize="{
            minRows: 4,
          }"
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
import { buildSelectionMixin, userMixin } from '@/mixins';
import api from '@/api';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdHandleResult: '',
  },
});

export default {
  name: 'question-solved',
  mixins: [selectionMixin, userMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      rules: {
        fdHandleResult: [{ required: true, message: '请输入解决方案', trigger: 'blur' }],
      },
    };
  },
  methods: {
    handleSubmit() {
      if (!this.moduleId) {
        return;
      }

      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }

        this.$confirm({
          title: '是否确认提交表单?',
          onOk: async () => {
            this.loading = true;
            try {
              await api.common.putQuestionForm({
                ...this.tempValue,
                id: this.moduleId,
                fdStatus: 'solved',
                fdHandleUserName: this.user.name,
                fdHandleLoginName: this.user.uid,
              });
              this.$message.success('问题解决成功');
              this.onOk();
            } finally {
              this.loading = false;
            }
          },
          onCancel: () => {},
        });
      });
    },
  },
};
</script>
