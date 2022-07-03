<template>
  <p-modal
    :maskClosable="false"
    title="项目名称设置"
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
      <p-form-model-item label="省" prop="province">
        <select-province
          v-model="tempValue.province"
          placeholder="请选择"
          allow-clear
          @change="tempValue.city = []"
        />
      </p-form-model-item>
      <p-form-model-item label="市" prop="city">
        <select-city
          allow-clear
          :provinceCode="(tempValue.province[0] || {}).value"
          v-model="tempValue.city"
          placeholder="请选择"
        />
      </p-form-model-item>
      <p-form-model-item label="商务中心" prop="businessCode">
        <!-- <p-input v-model="tempValue.businessCode" placeholder="请输入" /> -->
        <select-business
          :agencyCode="agencyCode"
          allow-clear
          :value="
            !!tempValue.businessCode
              ? [{ value: tempValue.businessCode, text: businessCenter }]
              : []
          "
          placeholder="请选择"
          @change="
            ((tempValue.businessCode = ($event[0] || {}).value) || true) &&
              (tempValue.businessCenter = ($event[0] || {}).text)
          "
        />
      </p-form-model-item>
      <p-form-model-item label="单位/公司" prop="company">
        <p-input :maxLength="200" v-model="tempValue.company" placeholder="请输入" />
      </p-form-model-item>
      <p-form-model-item label="用途" prop="purpose">
        <p-input :maxLength="200" v-model="tempValue.purpose" placeholder="请输入" />
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

import SelectProvince from '@/views/components/select/province';
import SelectCity from '@/views/components/select/city';
import SelectBusiness from '@/views/components/select/business';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    province: [],
    city: [],
    businessCode: '',
    businessCenter: '',
    company: '',
    purpose: '',
  },
});

export default {
  name: 'setting-name',
  mixins: [selectionMixin],
  props: {
    agencyCode: {
      type: String,
    },
  },
  components: {
    SelectProvince,
    SelectCity,
    SelectBusiness,
  },
  data() {
    return {
      rules: {
        province: [
          {
            required: true,
            message: '请选择省',
            trigger: 'change',
          },
        ],
        city: [
          {
            required: true,
            message: '请选择市',
            trigger: 'change',
          },
        ],
        businessCode: [
          {
            required: true,
            message: '请选择商务中心',
            trigger: 'blur',
          },
        ],
        company: [
          {
            required: true,
            message: '请输入单位/公司',
            trigger: 'blur',
          },
        ],
        purpose: [
          {
            required: true,
            message: '请输入用途',
            trigger: 'blur',
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
  },
};
</script>
