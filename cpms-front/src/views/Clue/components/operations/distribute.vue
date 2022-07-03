<template>
  <p-modal
    :maskClosable="false"
    title="分配人员操作"
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
      <p-form-model-item label="分配人员" prop="fdLoginName">
        <p-select-user
          :max="1"
          :selectData="
            !!tempValue.fdLoginName
              ? [{ uid: tempValue.fdLoginName, name: tempValue.fdUserName }]
              : []
          "
          @confirm="handleSelectUser"
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
    fdLoginName: '',
    fdUserName: '',
  },
});

export default {
  name: 'operation-distribute',
  mixins: [selectionMixin],
  props: {
    moduleId: String,
    version: Number,
  },
  data() {
    return {
      rules: {
        fdLoginName: [{ required: true, message: '请选择分配人员', trigger: 'change' }],
      },
    };
  },
  methods: {
    handleSelectUser(value) {
      value = value[0];
      if (!value) {
        return;
      }

      this.tempValue.fdLoginName = value.uid;
      this.tempValue.fdUserName = value.name;
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
          title: '请确认是否要分配此线索?',
          onOk: async () => {
            await api.clue.putAllotClue({
              allotEditParam: [
                {
                  id: this.moduleId,
                  version: this.version,
                },
              ],
              ...this.tempValue,
            });

            this.$message.success('线索分配成功');
            this.onOk();
          },
          onCancel: () => {},
        });
      });
    },
  },
};
</script>
