<template>
  <p-modal
    :maskClosable="false"
    :destroyOnClose="true"
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
      <p-form-model-item label="公司代码" prop="fdCompanyCode">
        <select-corporate-company
          :readOnly="!sapCustName"
          :value="
            !!tempValue.fdCompanyCode
              ? [
                  {
                    text: tempValue.fdCompanySapCode,
                    value: tempValue.fdCompanyCode,
                  },
                ]
              : []
          "
          allow-clear
          placeholder="请选择"
          @change="
            (tempValue.fdCompanySapCode = ($event[0] || {}).text),
              (tempValue.fdCompanyCode = ($event[0] || {}).value)
          "
        />
      </p-form-model-item>
      <p-form-model-item label="统御科目" prop="fdAccount">
        <select-dict
          allow-clear
          placeholder="请选择"
          systemCode="cpms"
          dictCode="cpms_sap_account"
          :value="
            !!tempValue.fdAccount
              ? [
                  {
                    text: tempValue.fdAccount,
                    value: tempValue.fdAccountCode,
                  },
                ]
              : []
          "
          @change="
            (tempValue.fdAccount = ($event[0] || {}).text),
              (tempValue.fdAccountCode = ($event[0] || {}).value)
          "
        />
      </p-form-model-item>
      <p-form-model-item label="自动清账标识" prop="autoClear">
        <select-dict
          allow-clear
          placeholder="请选择"
          systemCode="cpms"
          dictCode="cpms_sap_clear_account"
          :value="
            !!tempValue.fdClearAccount
              ? [
                  {
                    value: tempValue.fdClearAccount,
                  },
                ]
              : []
          "
          @change="tempValue.fdClearAccount = ($event[0] || {}).value"
        />
      </p-form-model-item>
      <!-- <p-form-model-item label="排序码" prop="sortCode">
        <p-input
          :maxLength="200"
          :disabled="!allowEdit"
          v-model="tempValue.sortCode"
          placeholder="请输入"
        />
      </p-form-model-item>
      <p-form-model-item label="金税备注" prop="goldTaxRemarks">
        <p-input
          :maxLength="200"
          :disabled="!allowEdit"
          v-model="tempValue.goldTaxRemarks"
          placeholder="请输入"
        />
      </p-form-model-item> -->
    </p-form-model>
    <span slot="footer">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          text-align: left;
        "
      >
        <span>注：请先选择客户，否则不允许选择公司代码。</span>
        <div>
          <p-button @click="onCancel">取 消</p-button>
          <p-button type="primary" @click="handleSubmit(true)">确 定</p-button>
        </div>
      </div>
    </span>
  </p-modal>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SelectCorporateCompany from '@/views/components/select/sap-company';

const defaultValue = {
  fdCompanySapCode: '', //公司代码（sap编码 系统对应法人）
  fdCompanyCode: '', //公司代码
  fdAccount: '', //统驭科目
  fdAccountCode: '', //统驭科目sap
  fdClearAccount: '', //自动清账标识
  //   sortCode: '0001',
  //   goldTaxRemarks: '',
};

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue,
});

export default {
  name: 'setting-company',
  mixins: [selectionMixin],
  components: {
    SelectCorporateCompany,
  },
  props: {
    moduleId: {
      type: String,
    },
    sapCustName: {
      type: String,
    },
    // itemLength: {
    //   type: Number,
    // },
  },
  watch: {
    // itemLength(n, o) {
    //   let index = n + 1;
    //   defaultValue.sortCode = '000' + index;
    //   this.tempValue = {
    //     ...defaultValue,
    //   };
    // },
  },
  computed: {
    isEdit() {
      return this.mode === 'edit';
    },
    title() {
      return `${!this.isEdit ? '新增' : '编辑'}公司代码视图`;
    },
    rules() {
      return {
        fdCompanyCode: [{ required: true, message: '请选择公司代码', trigger: 'change' }],
        fdAccount: [{ required: true, message: '请选择统御科目', trigger: 'change' }],
      };
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
