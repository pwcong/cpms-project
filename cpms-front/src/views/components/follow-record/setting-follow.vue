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
      <p-form-model-item label="跟进记录信息" prop="fdRecord">
        <p-textarea
          v-model="tempValue.fdRecord"
          :maxLength="500"
          :autoSize="{
            minRows: 4,
          }"
          placeholder="请输入"
        >
        </p-textarea>
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
    fdRecord: '',
  },
});

export default {
  name: 'setting-follow',
  mixins: [selectionMixin],
  props: {
    moduleFlag: String,
    moduleId: String,
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}跟进记录`;
    },
    rules() {
      return {
        fdRecord: [
          {
            required: true,
            message: '请输入跟进记录信息',
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

        await api.common.postFollowRecord({
          fdRelateModule: this.moduleFlag,
          fdRelateModuleId: this.moduleId,
          ...this.tempValue,
        });
        this.$message.success(`${this.title}成功`);

        this.onOk();
      });
    },
  },
};
</script>
