<template>
  <p-modal
    :maskClosable="false"
    title="更换负责人"
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
      <p-form-model-item label="负责人" prop="fdLoginName">
        <p-select-user
          :max="1"
          :selectData="
            tempValue.fdLoginName
              ? [{ uid: tempValue.fdLoginName, name: tempValue.fdUserName }]
              : []
          "
          @confirm="handleSelectUser"
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
import { buildSelectionMixin } from '@/mixins';
import api from '@/api';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdLoginName: '',
    fdUserName: '',
  },
});

export default {
  name: 'project-change-manager',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },
  data() {
    return {
      rules: {
        fdLoginName: [{ required: true, message: '请选择负责人', trigger: 'change' }],
      },
    };
  },
  methods: {
    handleSelectUser(res) {
      this.tempValue.fdLoginName = (res[0] || {}).uid;
      this.tempValue.fdUserName = (res[0] || {}).name;
    },
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
            await api.business.postChangeProjectManager({
              id: this.moduleId,
              fdLoginName: this.tempValue.fdLoginName,
              fdUserName: this.tempValue.fdUserName,
            });

            this.onOk();
          },
          onCancel: () => {},
        });
      });
    },
  },
};
</script>
