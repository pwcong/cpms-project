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
      <p-form-model-item label="销售组织" prop="fdSalesOrganization">
        <select-sales-organization
          :fdCorporateCode="companyCode"
          :value="
            !!tempValue.fdSalesOrganizationCode
              ? [
                  {
                    text: tempValue.fdSalesOrganization,
                    value: tempValue.fdSalesOrganizationCode,
                  },
                ]
              : []
          "
          allow-clear
          placeholder="请选择"
          @change="handleSalesOrganization"
        />
      </p-form-model-item>
      <p-form-model-item label="经营部-销售办公室" prop="fdSalesOffice">
        <select-business-department
          :fdSaleOrgCode="tempValue.fdSalesOrganizationCode"
          :value="
            !!tempValue.fdSalesOfficeCode
              ? [
                  {
                    text: tempValue.fdSalesOffice,
                    value: tempValue.fdSalesOfficeCode,
                  },
                ]
              : []
          "
          allow-clear
          placeholder="请选择"
          @change="
            (tempValue.fdSalesOffice = ($event[0] || {}).text),
              (tempValue.fdSalesOfficeCode = ($event[0] || {}).value)
          "
        />
      </p-form-model-item>
      <p-form-model-item label="客户组-市场级别" prop="fdMarketLevel">
        <select-dict
          placeholder="请选择"
          systemCode="cpms"
          dictCode="cpms_shop_level"
          allow-clear
          :value="
            !!tempValue.fdMarketLevelCode
              ? [
                  {
                    text: tempValue.fdMarketLevel,
                    value: tempValue.fdMarketLevelCode,
                  },
                ]
              : []
          "
          @change="
            (tempValue.fdMarketLevel = ($event[0] || {}).text),
              (tempValue.fdMarketLevelCode = ($event[0] || {}).value)
          "
        />
      </p-form-model-item>
      <p-form-model-item label="一级渠道" prop="fdChannelOneName">
        <select-first-channel
          :saleCode="tempValue.fdSalesOrganizationCode"
          :value="
            !!tempValue.fdChannelOneCode
              ? [
                  {
                    text: tempValue.fdChannelOneName,
                    value: tempValue.fdChannelOneCode,
                  },
                ]
              : []
          "
          allow-clear
          placeholder="请选择"
          @change="handleFirstChannel"
        />
      </p-form-model-item>
      <p-form-model-item label="二级渠道" prop="fdChannelTwoName">
        <select-secondary-channel
          :saleCode="tempValue.fdChannelOneCode"
          :value="
            !!tempValue.fdChannelTwoCode
              ? [
                  {
                    text: tempValue.fdChannelTwoName,
                    value: tempValue.fdChannelTwoCode,
                  },
                ]
              : []
          "
          @change="handleSecondaryChannel"
          allow-clear
          placeholder="请选择"
        />
      </p-form-model-item>
      <p-form-model-item label="三级渠道" prop="fdChannelThreeName">
        <select-third-channel
          :saleCode="tempValue.fdChannelTwoCode"
          :value="
            !!tempValue.fdChannelThreeCode
              ? [
                  {
                    text: tempValue.fdChannelThreeName,
                    value: tempValue.fdChannelThreeCode,
                  },
                ]
              : []
          "
          allow-clear
          placeholder="请选择"
          @change="
            ((tempValue.fdChannelThreeCode = ($event[0] || {}).value) || true) &&
              (tempValue.fdChannelThreeName = ($event[0] || {}).text)
          "
        />
      </p-form-model-item>
      <p-form-model-item label="业务员ZB" prop="fdSalesMan">
        <select-salesman
          :value="
            !!tempValue.fdSalesManCode
              ? [
                  {
                    text: tempValue.fdSalesMan,
                    value: tempValue.fdSalesManCode,
                  },
                ]
              : []
          "
          allow-clear
          placeholder="请选择"
          @change="
            (tempValue.fdSalesMan = ($event[0] || {}).text),
              (tempValue.fdSalesManCode = ($event[0] || {}).value)
          "
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
import SelectSalesman from '../components/select/salesman';
import SelectSalesOrganization from '../components/select/sales-organization';
import SelectBusinessDepartment from '../components/select/business-department';
import SelectFirstChannel from '../components/select/first-channel';
import SelectSecondaryChannel from '../components/select/secondary-channel';
import SelectThirdChannel from '../components/select/third-channel';

const defaultValue = {
  fdSalesOrganization: '', //销售组织
  fdSalesOrganizationCode: '', //销售组织code
  fdSalesOffice: '', //经营部
  fdSalesOfficeCode: '', //经营部code
  fdMarketLevel: '', //客户组-市场级别
  fdMarketLevelCode: '', //客户组-市场级别code
  fdChannelOneName: '', //一级渠道
  fdChannelOneCode: '', //一级渠道编号
  fdChannelTwoName: '', //二级渠道
  fdChannelTwoCode: '', //二级渠道编号
  fdChannelThreeName: '', //三级渠道
  fdChannelThreeCode: '', //三级渠道编号
  fdSalesMan: '', //业务员
  fdSalesManCode: '', //业务员id
};

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue,
});

export default {
  name: 'setting-bank',
  mixins: [selectionMixin],
  components: {
    SelectSalesman,
    SelectSalesOrganization,
    SelectBusinessDepartment,
    SelectFirstChannel,
    SelectSecondaryChannel,
    SelectThirdChannel,
  },
  props: {
    moduleId: {
      type: String,
    },
    custSapCompanyListAddParamList: {
      type: Array,
    },
  },
  watch: {
    custSapCompanyListAddParamList() {
      this.companyCode = this.custSapCompanyListAddParamList
        .map((d) => {
          return d.fdCompanyCode;
        })
        .join(',');
    },
  },
  computed: {
    isEdit() {
      return this.mode === 'edit';
    },
    title() {
      return `${!this.isEdit ? '新增' : '编辑'}销售视图`;
    },
    rules() {
      return {
        fdSalesOrganization: [
          { required: true, message: '请选择销售组织', trigger: 'change' },
        ],
        fdSalesOffice: [
          { required: true, message: '请选择经营部-销售办公室', trigger: 'change' },
        ],
        fdMarketLevel: [
          { required: true, message: '请选择客户组-市场级别', trigger: 'change' },
        ],
        fdSalesMan: [{ required: true, message: '请选择业务员', trigger: 'change' }],
        fdChannelOneName: [
          { required: true, message: '请选择一级渠道', trigger: 'change' },
        ],
        fdChannelTwoName: [
          { required: true, message: '请选择二级渠道', trigger: 'change' },
        ],
        fdChannelThreeName: [
          { required: true, message: '请选择三级渠道', trigger: 'change' },
        ],
      };
    },
    allowEdit() {
      return !this.tempValue.id;
    },
  },
  data() {
    return {
      companyCode: '',
    };
  },
  methods: {
    handleSalesOrganization(res) {
      this.tempValue.fdSalesOrganizationCode = (res[0] || {}).fdSaleOrgCode;
      this.tempValue.fdSalesOrganization = (res[0] || {}).fdSaleOrgName;
      this.tempValue.fdSalesOffice = '';
      this.tempValue.fdSalesOfficeCode = '';
      this.tempValue.fdMarketLevel = '';
      this.tempValue.fdMarketLevelCode = '';
      this.tempValue.fdChannelOneCode = '';
      this.tempValue.fdChannelOneName = '';
      this.tempValue.fdChannelTwoName = '';
      this.tempValue.fdChannelTwoCode = '';
      this.tempValue.fdChannelThreeName = '';
      this.tempValue.fdChannelThreeCode = '';
    },
    handleFirstChannel(res) {
      this.tempValue.fdChannelOneCode = (res[0] || {}).value;
      this.tempValue.fdChannelOneName = (res[0] || {}).text;
      this.tempValue.fdChannelTwoName = '';
      this.tempValue.fdChannelTwoCode = '';
      this.tempValue.fdChannelThreeName = '';
      this.tempValue.fdChannelThreeCode = '';
    },
    handleSecondaryChannel(res) {
      this.tempValue.fdChannelTwoName = (res[0] || {}).text;
      this.tempValue.fdChannelTwoCode = (res[0] || {}).value;
      this.tempValue.fdChannelThreeName = '';
      this.tempValue.fdChannelThreeCode = '';
    },
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
