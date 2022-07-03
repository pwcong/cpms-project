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
      <p-form-model-item label="银行国家/地区" prop="fdBankCountry">
        <select-dict
          allow-clear
          placeholder="请选择"
          systemCode="cpms"
          dictCode="cpms_country"
          :value="
            !!tempValue.fdBankCountry
              ? [
                  {
                    text: tempValue.fdBankCountry,
                    value: tempValue.fdBankCountryCode,
                  },
                ]
              : []
          "
          @change="
            (tempValue.fdBankCountry = ($event[0] || {}).text),
              (tempValue.fdBankCountryCode = ($event[0] || {}).value)
          "
        />
      </p-form-model-item>
      <p-form-model-item label="银行账号" prop="fdBankAccount">
        <p-input v-model="tempValue.fdBankAccount" placeholder="请输入" />
      </p-form-model-item>
      <p-form-model-item label="开户行详细名称" prop="fdBankAccName">
        <p-input v-model="tempValue.fdBankAccName" placeholder="请输入" />
      </p-form-model-item>
      <p-form-model-item label="是否为专用发票" prop="fdIsVat">
        <select-dict
          allow-clear
          placeholder="请选择"
          systemCode="cpms"
          dictCode="cpms_sap_is_vat"
          :value="
            !!tempValue.fdIsVat
              ? [
                  {
                    value: tempValue.fdIsVat,
                  },
                ]
              : []
          "
          @change="tempValue.fdIsVat = ($event[0] || {}).value"
        />
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit(true)">确 定</p-button>
    </span>
  </p-modal>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';

const defaultValue = {
  fdBankCountryCode: '', //银行国家/地区code
  fdBankCountry: '', //银行国家/地区
  fdBankAccount: '', //银行账号
  fdBankAccName: '', //开户行详细名称
  fdIsVat: '', //是否为专用发票
};

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue,
});

export default {
  name: 'setting-bank',
  mixins: [selectionMixin],
  props: {
    moduleId: {
      type: String,
    },
  },

  computed: {
    isEdit() {
      return this.mode === 'edit';
    },
    title() {
      return `${!this.isEdit ? '新增' : '编辑'}银行账户信息`;
    },
    rules() {
      const {} = this.tempValue;

      return {};
    },
    // allowEdit() {
    //   return !this.tempValue.id;
    // },
  },
  data() {
    return {};
  },
  methods: {
    handleSubmit(done) {
      this.$refs.form.validate(async (valid) => {
        if (!valid) {
          return;
        }

        if (done) {
          this.onOk();
        } else {
          this.onOk(false);
          this.tempValue = {
            ...defaultValue,
          };
        }
      });
    },
  },
};
</script>
