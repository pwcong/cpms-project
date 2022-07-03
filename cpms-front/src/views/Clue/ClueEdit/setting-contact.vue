<template>
  <p-modal
    :maskClosable="false"
    :title="title"
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
      <p-form-model-item label="姓名" prop="fdContactName">
        <p-input
          :maxLength="200"
          v-model="tempValue.fdContactName"
          :readOnly="!!isEdit && !!moduleId"
          :placeholder="!!isEdit && !!moduleId ? undefined : '请输入'"
        />
      </p-form-model-item>
      <p-form-model-item label="手机号" prop="fdContactPhone">
        <p-input
          :maxLength="200"
          v-model.number="tempValue.fdContactPhone"
          :placeholder="!!isEdit && !!moduleId ? undefined : '请输入'"
          :readOnly="!!isEdit && !!moduleId"
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

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdContactName: '',
    fdContactPhone: '',
  },
});

export default {
  name: 'setting-contact',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
    contactAddParamList: {
      type: Array,
    },
  },
  computed: {
    isEdit() {
      return this.mode === 'edit';
    },
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}联系人信息`;
    },
    rules() {
      return {
        fdContactName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        fdContactPhone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
      };
    },
  },
  // data() {
  //   return {
  //     rules: {
  //       fdContactName: [
  //         {
  //           required: true,
  //           message: "请输入姓名",
  //           trigger: "blur",
  //         },
  //       ],
  //       fdContactPhone: [
  //         {
  //           required: true,
  //           message: "请输入手机",
  //           trigger: "blur",
  //         },
  //       ],
  //     },
  //   };
  // },
  methods: {
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.onOk();
      });
    },
  },
};
</script>
