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
      <p-form-model-item label="费用承担方" prop="fdCostBearName">
        <select-dict
          :value="
            !!tempValue.fdCostBearName
              ? [
                  {
                    value: tempValue.fdCostBearCode,
                    text: tempValue.fdCostBearName,
                  },
                ]
              : []
          "
          @change="handleChangeFdCostBearName"
          placeholder="请选择"
          systemCode="cpms"
          allow-clear
          dictCode="cpms_cost_bear"
        />
      </p-form-model-item>
      <p-form-model-item label="金额(元)" prop="fdAmount">
        <p-input-number
          style="width: 100%"
          placeholder="请输入"
          v-model="tempValue.fdAmount"
        />
      </p-form-model-item>
      <p-form-model-item label="是否需要上楼" prop="fdIsGoUpstairs">
        <select-yes-or-no
          :value="!!tempValue.fdIsGoUpstairs ? [{ value: tempValue.fdIsGoUpstairs }] : []"
          placeholder="请选择"
          @change="tempValue.fdIsGoUpstairs = $event[0].value"
        />
      </p-form-model-item>
      <p-form-model-item label="楼层" prop="fdFloor">
        <p-input
          style="width: 100%"
          placeholder="请输入"
          v-model="tempValue.fdFloor"
          :maxLength="200"
        />
      </p-form-model-item>
      <p-form-model-item label="是否有电梯" prop="fdIsElevator">
        <select-yes-or-no
          :value="!!tempValue.fdIsElevator ? [{ value: tempValue.fdIsElevator }] : []"
          placeholder="请选择"
          @change="tempValue.fdIsElevator = $event[0].value"
        />
      </p-form-model-item>
      <p-form-model-item label="运输方式" prop="fdTransportTypeName">
        <select-dict
          allow-clear
          :value="
            !!tempValue.fdTransportTypeName
              ? [
                  {
                    value: tempValue.fdTransportTypeCode,
                    text: tempValue.fdTransportTypeName,
                  },
                ]
              : []
          "
          @change="handleChangeFdTransportTypeName"
          placeholder="请选择"
          systemCode="cpms"
          dictCode="cpms_transport_type"
        />
      </p-form-model-item>
      <p-form-model-item label="付费方式" prop="fdPaymentTypeName">
        <select-dict
          allow-clear
          :value="
            !!tempValue.fdPaymentTypeName
              ? [
                  {
                    value: tempValue.fdPaymentTypeCode,
                    text: tempValue.fdPaymentTypeName,
                  },
                ]
              : []
          "
          @change="handleChangeFdPaymentTypeName"
          placeholder="请选择"
          systemCode="cpms"
          dictCode="cpms_payment_type"
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
// import SelectCostBear from "@/views/Business/Price/components/select/cost-bear";
import SelectPaymentType from '@/views/Business/Price/components/select/payment-type';
import SelectTransportType from '@/views/Business/Price/components/select/transport-type';
import SelectYesOrNo from '@/views/components/select/yes-or-no';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdAmount: 0,
    fdCostBearCode: '',
    fdCostBearName: '',
    fdPaymentTypeCode: '',
    fdPaymentTypeName: '',
    fdTransportTypeCode: '',
    fdTransportTypeName: '',
    fdFloor: '',
    fdIsElevator: 0,
    fdIsGoUpstairs: 0,
  },
});

export default {
  name: 'setting-transport',
  mixins: [selectionMixin],
  props: {
    moduleId: String,
  },
  components: {
    // SelectCostBear,
    SelectPaymentType,
    SelectTransportType,
    SelectYesOrNo,
  },
  computed: {
    title() {
      return `${this.mode === 'add' ? '新增' : '编辑'}运输费`;
    },
  },
  data() {
    return {
      rules: {
        fdCostBearName: [
          {
            required: true,
            message: '请选择费用承担方',
            trigger: 'change',
          },
        ],
        fdTransportTypeName: [
          {
            required: true,
            message: '请选择运输方式',
            trigger: 'change',
          },
        ],
        fdPaymentTypeName: [
          {
            required: true,
            message: '请选择付费方式',
            trigger: 'change',
          },
        ],
        fdAmount: [
          {
            required: true,
            message: '请输入金额(元)',
            trigger: 'blur',
          },
        ],
        fdIsGoUpstairs: [
          {
            required: true,
            message: '请选择是否需要上楼',
            trigger: 'change',
          },
        ],
        fdFloor: [
          {
            required: true,
            message: '请输入楼层',
            trigger: 'blur',
          },
        ],
        fdIsElevator: [
          {
            required: true,
            message: '请选择是否有电梯',
            trigger: 'change',
          },
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
        this.onOk();
      });
    },
    handleChangeFdCostBearName(value) {
      this.tempValue.fdCostBearCode = (value[0] || {}).value;
      this.tempValue.fdCostBearName = (value[0] || {}).text;
    },
    handleChangeFdTransportTypeName(value) {
      this.tempValue.fdTransportTypeCode = (value[0] || {}).value;
      this.tempValue.fdTransportTypeName = (value[0] || {}).text;
    },
    handleChangeFdPaymentTypeName(value) {
      this.tempValue.fdPaymentTypeCode = (value[0] || {}).value;
      this.tempValue.fdPaymentTypeName = (value[0] || {}).text;
    },
  },
};
</script>
