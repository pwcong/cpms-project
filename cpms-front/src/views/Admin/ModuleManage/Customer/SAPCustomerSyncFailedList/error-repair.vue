<template>
  <p-modal
    :maskClosable="false"
    title="错误修复"
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
      <p-form-model-item label="意向客户" prop="cpmsCustId">
        <select-customer
          :readOnly="!!tempValue.fdCustName"
          :value="
            !!tempValue.cpmsCustId
              ? [
                  {
                    value: tempValue.cpmsCustId,
                  },
                ]
              : []
          "
          placeholder="请选择"
          @change="handleChangeCpmsCustId"
          allow-clear
          status="pass"
        >
        </select-customer>
      </p-form-model-item>

      <p-form-model-item label="客户名称" prop="fdCustName">
        <div style="display: flex; flex-wrap: no-wrap">
          <p-input
            readOnly
            v-model="tempValue.fdCustName"
            placeholder="请选择"
            style="flex: 1"
          />
          <p-button
            size="small"
            :disabled="!!tempValue.cpmsCustId"
            type="primary"
            @click="selectTianyanchaVisible = true"
            v-if="!id || tempValue.fdStatus === 'draft'"
            style="margin-left: 15px; margin-top: 3px"
            >选择</p-button
          >
        </div>
      </p-form-model-item>

      <p-form-model-item label="业务员" prop="fdLoginName">
        <p-select-user
          v-if="!tempValue.cpmsCustId"
          :max="1"
          :selectData="
            !!tempValue.fdLoginName
              ? [{ uid: tempValue.fdLoginName, name: tempValue.fdUserName }]
              : []
          "
          @confirm="handleSelectUser"
          placeholder="请选择"
        />
        <p-input v-else readOnly placeholder="请选择" />
      </p-form-model-item>
    </p-form-model>
    <span slot="footer">
      <p-button @click="onCancel">取 消</p-button>
      <p-button type="primary" @click="handleSubmit">确 定</p-button>
    </span>
    <selection-tianyancha
      :keyword="tempValue.fdCustName"
      :validate="tianyanchaValidator"
      :visible.sync="selectTianyanchaVisible"
      @change="handleSelectTianyancha"
    />
  </p-modal>
</template>

<script>
import api from '@/api';
import SelectCustomer from '../components/customer-list';
import { buildSelectionMixin } from '@/mixins';
import SelectionTianyancha from '@/views/components/selection-tianyancha';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdLoginName: '',
    fdUserName: '',
    cpmsCustId: '',
  },
});

export default {
  name: 'error-repair',
  mixins: [selectionMixin],
  props: {
    cpmsCustId: String,
    companyName: String,
    sapCustId: String,
  },
  components: {
    SelectionTianyancha,
    SelectCustomer,
  },
  computed: {
    rules() {
      const { cpmsCustId } = this.tempValue;
      return {
        fdCustName: [
          {
            required: cpmsCustId ? false : true,
            message: '请选择客户名称',
            trigger: 'change',
          },
        ],
        fdLoginName: [
          {
            required: cpmsCustId ? false : true,
            message: '请选择业务员',
            trigger: 'change',
          },
        ],
      };
    },
  },
  data() {
    return {
      selectTianyanchaVisible: false,
    };
  },
  watch: {
    visible(v) {
      if (v) {
        this.handleCustSapCustomer();
      }
    },
  },
  methods: {
    async handleCustSapCustomer() {
      if (!this.sapCustId) {
        return;
      }
      const custSapCustomerInfo = await api.customer.getCustSapCustomer(this.sapCustId);
      this.tempValue.fdCustName = custSapCustomerInfo.fdCompanyName;
      this.tempValue.fdUnifiedCode = custSapCustomerInfo.fdCreditCode;
      this.tempValue.fdLoginName = custSapCustomerInfo.fdLoginName;
      this.tempValue.fdUserName = custSapCustomerInfo.fdUserName;
    },
    async handleSelectTianyancha(value) {
      try {
        const res = await api.customer.getCustomerTianyanchaInfo((value || [])[0].id);
        this.tempValue = {
          ...this.tempValue,
          fdUnifiedCode: res.data.fdCreditCode,
          fdCustName: res.data.fdName,
        };
      } catch (e) {
      } finally {
      }
    },

    handleSelectUser(value) {
      this.tempValue.fdLoginName = (value[0] || {}).uid;
      this.tempValue.fdUserName = (value[0] || {}).name;
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.error('表单字段校验未通过');
          return;
        }

        this.$confirm({
          title: '请确认是否要错误修复?',
          onOk: async () => {
            await api.customer.postRelationCompany({
              fdLoginName: this.tempValue.fdLoginName,
              fdUserName: this.tempValue.fdUserName,
              cpmsCustId: this.tempValue.cpmsCustId,
              fdCompanyName: this.tempValue.fdCustName,
              fdUnifiedCode: this.tempValue.fdUnifiedCode,
              ids: [this.sapCustId],
            });

            this.$message.success('错误修复成功');
            this.onOk();
          },
          onCancel: () => {},
        });
      });
    },
    handleChangeCpmsCustId(res) {
      this.tempValue.cpmsCustId = (res[0] || {}).value;
    },
  },
};
</script>
