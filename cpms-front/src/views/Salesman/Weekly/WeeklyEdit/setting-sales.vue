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
      <p-form-model-item label="月份" prop="fdMonth">
        <p-input-number
          placeholder="请输入"
          style="width: 100%"
          :min="1"
          :max="12"
          v-model="tempValue.fdMonth"
        />
      </p-form-model-item>
      <p-form-model-item label="商务中心" prop="fdBusinessCenterName">
        <select-business
          :value="
            !!tempValue.fdBusinessCenterCode
              ? [
                  {
                    value: tempValue.fdBusinessCenterCode,
                    text: tempValue.fdBusinessCenterName,
                  },
                ]
              : []
          "
          dictCode="cpms_visit_type"
          systemCode="cpms"
          placeholder="请选择"
          allow-clear
          @change="handleChangeBusiness"
        />
        <!-- <p-input placeholder="请输入" v-model="tempValue.fdBusinessCenterName" /> -->
      </p-form-model-item>

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
      <p-form-model-item label="销售任务（万）" prop="fdSalesTask">
        <p-input-number
          placeholder="请输入"
          style="width: 100%"
          :step="0.01"
          v-model="tempValue.fdSalesTask"
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
      <p-form-model-item label="完成率" prop="fdPercentageComplete">
        <p-input
          placeholder="请输入"
          style="width: 100%"
          :min="0"
          :max="100"
          read-only
          :value="`${fdPercentageComplete}%`"
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
import { buildSelectionMixin, formatMixin } from '@/mixins';
import formMixin from './form';

import SelectProductLine from '@/views/components/select/product-line';
import SelectBusiness from '@/views/components/select/business';

import dayjs from 'dayjs';
const currMonth = dayjs().month() + 1;

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdMonth: currMonth,
    fdBusinessCenterName: '',
    fdBusinessCenterCode: '',
    fdProductLineName: '',
    fdProductLineCode: '',
    fdSalesTask: 0,
    fdRealizedIncome: 0,
  },
});

export default {
  name: 'setting-visit',
  mixins: [selectionMixin, formMixin, formatMixin],
  components: {
    SelectProductLine,
    SelectBusiness,
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}销售任务达成`;
    },
    rules() {
      return {
        fdMonth: [
          {
            required: true,
            message: '请输入月份',
            trigger: 'blur',
          },
        ],
        fdBusinessCenterName: [
          {
            required: true,
            message: '请选择商务中心',
            trigger: 'change',
          },
        ],
        fdProductLineCode: [
          {
            required: true,
            message: '请选择产品线',
            trigger: 'change',
          },
        ],
        fdSalesTask: [
          {
            required: true,
            message: '请输入销售任务（万）',
            trigger: 'blur',
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
    fdPercentageComplete() {
      const { fdSalesTask = 0, fdRealizedIncome = 0 } = this.tempValue;

      return this.getAmount((fdRealizedIncome / (fdSalesTask || 1)) * 100);
    },
  },

  methods: {
    handleChangeBusiness(res) {
      this.tempValue.fdBusinessCenterName = (res[0] || {}).text;
      this.tempValue.fdBusinessCenterCode = (res[0] || {}).value;
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }
        this.tempValue = {
          ...this.tempValue,
          fdPercentageComplete: this.fdPercentageComplete,
        };
        this.onOk();
      });
    },
  },
};
</script>
