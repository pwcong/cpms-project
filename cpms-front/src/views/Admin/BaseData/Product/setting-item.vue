<template>
  <p-modal
    :maskClosable="false"
    :title="title"
    :visible="visible"
    width="400px"
    @cancel="onCancel"
  >
    <p-form-model ref="form" :model="tempValue" :rules="rules">
      <p-form-model-item label="产品" prop="fdProductName">
        <p-input
          v-model="tempValue.fdProductName"
          :readOnly="!allowEdit"
          :placeholder="allowEdit ? '请输入' : ''"
          :maxLength="200"
        />
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <template v-if="allowEdit">
        <p-button @click="onCancel">取 消</p-button>
        <p-button type="primary" @click="handleSubmit">确 定</p-button>
      </template>
      <template v-else>
        <p-button @click="onCancel">关 闭</p-button>
      </template>
    </span>
  </p-modal>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'setting-item',
  mixins: [selectionMixin],
  components: {},
  data() {
    return {};
  },
  computed: {
    allowEdit() {
      return this.mode !== 'view';
    },
    title() {
      return `${this.allowEdit ? (this.mode === 'edit' ? '编辑' : '新增') : '查看'}数据`;
    },
    rules() {
      const {} = this.tempValue;

      return {
        fdProductName: [
          {
            required: this.allowEdit,
            message: '请输入产品标识',
            trigger: 'blur',
          },
        ],
      };
    },
  },
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
