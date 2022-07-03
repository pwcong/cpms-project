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
      <p-form-model-item label="产品线" prop="fdProductLineCode">
        <select-product-line
          allow-clear
          :value="
            !!tempValue.fdProductLineCode
              ? [
                  {
                    value: tempValue.fdProductLineCode,
                    text: tempValue.fdProductLineName,
                  },
                ]
              : []
          "
          @change="
            ((tempValue.fdProductLineCode = ($event[0] || {}).value) || true) &&
              (tempValue.fdProductLineName = ($event[0] || {}).text)
          "
          placeholder="请选择"
        />
      </p-form-model-item>
      <p-form-model-item label="实际收入（万）" prop="fdRealizedIncome">
        <p-input-number
          placeholder="请输入"
          style="width: 100%"
          :step="0.01"
          v-model="tempValue.fdRealizedIncome"
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
import formMixin from './form';

import SelectProductLine from '@/views/components/select/product-line';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdProductLineName: '',
    fdProductLineCode: '',
    fdRealizedIncome: 0,
  },
});

export default {
  name: 'setting-self',
  mixins: [selectionMixin, formMixin],
  components: {
    SelectProductLine,
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}个人销售达成`;
    },
    rules() {
      return {
        fdProductLineCode: [
          {
            required: true,
            message: '请选择产品线',
            trigger: 'change',
          },
        ],
        fdRealizedIncome: [
          {
            required: true,
            message: '请输入实际收入（万）',
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
