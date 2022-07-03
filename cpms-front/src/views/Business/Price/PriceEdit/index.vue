<template>
  <p-spin :spinning="loading">
    <list-layout style="padding-bottom: 16px">
      <p-form-model
        ref="form"
        :model="formData"
        :rules="formRules"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <block>
          <template v-slot:title>
            <p-breadcrumb>
              <p-breadcrumb-item>首页</p-breadcrumb-item>
              <p-breadcrumb-item>商机管理</p-breadcrumb-item>
              <p-breadcrumb-item>价格管理</p-breadcrumb-item>
              <p-breadcrumb-item
                >{{ isEdit ? '编辑' : '新建' }}价格申请</p-breadcrumb-item
              >
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              :loading="loading"
              type="primary"
              v-if="!isEdit || formData.fdStatus === 'draft'"
              style="margin-right: 8px"
              @click="handleSubmit(true)"
            >
              暂存
            </p-button>

            <oasubmit-wrapper
              moduleFlag="cpms_project_price_main"
              :moduleId="id"
              style="margin-left: 8px"
              :beforeSubmit="handleBeforeSubmit"
              :status="formData.fdStatus"
              @submit="handleSubmit(false, $event)"
            >
              <p-button type="primary" :loading="loading">
                {{ formData.fdStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
              </p-button>
            </oasubmit-wrapper>

            <p-button style="margin-left: 8px" @click="handleCancel()"> 取消 </p-button>
          </template>
        </block>

        <block title="基本信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="项目名称" prop="fdProjectMainId">
                <select-project
                  status="follow"
                  allow-clear
                  :value="
                    !!formData.fdProjectMainId
                      ? [
                          {
                            value: formData.fdProjectMainId,
                            text: formData.fdProjectMainName,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  @change="handleChangeProject"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="合同交货时间" prop="fdContractDeliveryTime">
                <div style="display: flex; flex-wrap: no-wrap">
                  <p-date-picker
                    style="flex: 1"
                    v-model="formData.fdContractDeliveryTime"
                    valueFormat="YYYY-MM-DD"
                  />
                  <!-- <p-button type="primary">查看详情</p-button> -->
                </div>
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="开单开始时间" prop="fdBeginTime">
                <p-date-picker v-model="formData.fdBeginTime" valueFormat="YYYY-MM-DD" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="开单截止时间" prop="fdOrderEndTime">
                <p-date-picker
                  v-model="formData.fdOrderEndTime"
                  valueFormat="YYYY-MM-DD"
                /> </p-form-model-item
            ></p-col>

            <p-col :span="8">
              <p-form-model-item label="分公司" prop="fdBranchCompanyCode">
                <select-sap-company
                  allow-clear
                  :value="
                    !!formData.fdBranchCompanyCode
                      ? [
                          {
                            value: formData.fdBranchCompanyCode,
                            text: formData.fdBranchCompanyName,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  @change="handleChangeFdBranchCompanyCode"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="销售部" prop="fdSaleDeptCode">
                <select-sap-sale
                  :sapCompanyCode="formData.fdBranchCompanyCode"
                  :value="
                    !!formData.fdSaleDeptCode
                      ? [
                          {
                            value: formData.fdSaleDeptCode,
                            text: formData.fdSaleDeptName,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  allow-clear
                  @change="handleChangeFdSaleDeptCode"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8"
              ><p-form-model-item label="客户名称" prop="fdCustName">
                <select-customer
                  placeholder="请选择"
                  allow-clear
                  status="pass"
                  :value="
                    !!formData.fdCustName
                      ? [
                          {
                            value: formData.fdCustMainId,
                            text: formData.fdCustName,
                          },
                        ]
                      : []
                  "
                  @change="handlenCustMainId"
                /> </p-form-model-item
            ></p-col>
            <p-col :span="8">
              <p-form-model-item label="CRM客户名称" prop="fdSapCustName">
                <div style="display: flex; flex-wrap: no-wrap">
                  <!-- <p-input
                    style="flex: 1"
                    placeholder="请输入"
                    :maxLength="200"
                    v-model="formData.fdSapCustName"
                  /> -->
                  <select-crm-customer
                    placeholder="请选择"
                    allow-clear
                    :value="
                      !!formData.fdSapCustName
                        ? [
                            {
                              text: formData.fdSapCustName,
                              value: formData.fdSapCustCode,
                            },
                          ]
                        : []
                    "
                    @change="handlenSapCustName"
                    :customerId="formData.fdCustMainId"
                    :branchCode="formData.fdBranchCompanyCode"
                    :deptCode="formData.fdSaleDeptCode"
                  />
                  <!-- <p-button type="primary">转正式客户</p-button> -->
                </div>
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="一级渠道" prop="fdChannelOneName">
                <p-input readOnly v-model="formData.fdChannelOneName" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="二级渠道" prop="fdChannelTwoName">
                <p-input readOnly v-model="formData.fdChannelTwoName" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="联系人" prop="fdUserName">
                <p-input
                  :maxLength="200"
                  placeholder="请输入"
                  v-model="formData.fdUserName"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="联系电话" prop="fdUserMobile">
                <p-input-number
                  style="width: 100%"
                  placeholder="请输入"
                  :maxLength="11"
                  v-model="formData.fdUserMobile"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="项目所在城市" prop="fdCity">
                <p-input readOnly v-model="formData.fdCity" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="项目是否跨区" prop="fdIsRegion">
                <p-input readOnly :value="formData.fdIsRegion > 0 ? '是' : '否'" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="项目预计收入(元)" prop="fdEstimatedRevenue">
                <p-input readOnly :value="formatAmount(fdEstimatedRevenue)" />
              </p-form-model-item>
            </p-col>

            <!-- <p-col :span='8'>
              <p-form-model-item label="分公司" prop="fdCorporateCode">
                <select-corporate
                  allow-clear
                  :value="
                    !!formData.fdCorporateCode
                      ? [
                          {
                            value: formData.fdCorporateCode,
                            text: formData.fdCorporateName,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  @change="handleChangeFdCorporateCode"
                />
              </p-form-model-item>
            </p-col> -->

            <p-col :span="24">
              <p-form-model-item label="申请理由" prop="fdApplyReason">
                <p-textarea
                  placeholder="请输入"
                  v-model="formData.fdApplyReason"
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="价格附件" prop="sysAttContractAspectParams">
                <uploader v-model="formData.sysAttContractAspectParams" multiple />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <!-- <selection-customer
          status="pass"
          :value="[]"
          :visible.sync="showSelectionCustomer"
          @change="handleChangeCustomer"
        /> -->
        <price-list
          v-model="formData"
          @change="changeInfo"
          :moduleId="id"
          style="margin-top: 16px"
        />
        <!-- <install-list
          v-model="formData"
          :moduleId="id"
          style="margin-top: 16px"
        /> -->
        <!-- <transport-list
          v-model="formData"
          :moduleId="id"
          style="margin-top: 16px"
        /> -->
        <block style="text-align: center; margin-top: 32px">
          <oasubmit-wrapper
            moduleFlag="cpms_project_price_main"
            :moduleId="id"
            :beforeSubmit="handleBeforeSubmit"
            :status="formData.fdStatus"
            @submit="handleSubmit(false, $event)"
          >
            <p-button type="primary" style="width: 150px" :loading="loading">
              {{ formData.fdStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
            </p-button>
          </oasubmit-wrapper>
        </block>
      </p-form-model>
    </list-layout>
  </p-spin>
</template>

<script>
import SelectCustomer from '@/views/components/select/customer';
import SelectCrmCustomer from '@/views/components/select/crm-customer';
import SelectCorporate from '@/views/components/select/corporate';
import SelectProject from '@/views/components/select/project';
import formMixin from './form';
import SelectSapSale from '@/views/components/select/sap-sale';
import SelectSapCompany from '@/views/components/select/sap-company';
import PriceList from './price-list';
// import InstallList from "./install-list";
// import TransportList from "./transport-list";

export default {
  name: '价格编辑',
  mixins: [formMixin],
  components: {
    PriceList,
    // InstallList,
    // TransportList,
    SelectProject,
    SelectCorporate,
    SelectSapSale,
    SelectSapCompany,
    SelectCustomer,
    SelectCrmCustomer,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showSelectionCustomer: false,
    };
  },
  created() {
    this.initFormData(this.id);
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },
  methods: {
    // handleChangeFdCorporateCode(res) {
    //   this.formData.fdCorporateCode = (res[0] || {}).value;
    //   this.formData.fdCorporateName = (res[0] || {}).text;
    // },
    handleChangeFdBranchCompanyCode(res) {
      this.formData.fdBranchCompanyCode = (res[0] || {}).value;
      this.formData.fdBranchCompanyName = (res[0] || {}).text;
      this.formData.fdSaleDeptCode = '';
      this.formData.fdSaleDeptName = '';

      this.getCrmCustInfo(
        this.formData.fdBranchCompanyCode,
        this.formData.fdCustMainId,
        this.formData.fdSaleDeptCode
      );
    },
    handleChangeFdSaleDeptCode(res) {
      this.formData.fdSaleDeptCode = (res[0] || {}).value;
      this.formData.fdSaleDeptName = (res[0] || {}).text;
      this.getCrmCustInfo(
        this.formData.fdBranchCompanyCode,
        this.formData.fdCustMainId,
        this.formData.fdSaleDeptCode
      );
    },

    handleBeforeSubmit() {
      if (this.loading) {
        return false;
      }
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          if (!valid || !this.checkFormData(this.formData)) {
            this.$message.error('表单字段校验未通过');
            resolve(false);
            return;
          }
          resolve(true);
        });
      });
    },

    handleSubmit(isDraft, form) {
      if (this.loading) {
        return false;
      }
      this.formData = {
        ...this.formData,
        ...(form || {}),
      };
      this.$confirm({
        title: isDraft ? '是否确认暂存表单?' : '是否确认提交表单?',
        onOk: () => {
          if (isDraft) {
            this.submitFormData(this.formData, 'draft');
          } else {
            this.submitFormData(this.formData, this.isEdit ? 'edit' : 'add');
          }
        },
        onCancel: () => {},
      });
    },

    handleChangeProject(res) {
      this.formData.fdProjectMainId = '';
      this.formData.fdProjectMainName = '';
      this.formData.fdCustMainId = '';
      this.formData.fdCustName = '';
      this.formData.fdChannelOneName = '';
      this.formData.fdChannelOneCode = '';
      this.formData.fdChannelTwoName = '';
      this.formData.fdChannelTwoCode = '';
      this.formData.fdSapCustName = '';
      this.formData.fdSapCustCode = '';
      this.formData.fdIsRegion = '';
      this.formData.priceMessageListAddParams = [];

      this.formData.fdProjectMainId = (res[0] || {}).value;
      this.formData.fdProjectMainName = (res[0] || {}).text;

      res = res[0];

      if (!res) {
        this.formData.fdProjectMainId = '';
        this.formData.fdProjectMainName = '';
        this.formData.fdCustMainId = '';
        this.formData.fdCustName = '';
        this.formData.fdChannelOneName = '';
        this.formData.fdChannelOneCode = '';
        this.formData.fdChannelTwoName = '';
        this.formData.fdChannelTwoCode = '';
        this.formData.fdSapCustName = '';
        this.formData.fdSapCustCode = '';
        this.formData.fdIsRegion = '';
        this.formData.priceMessageListAddParams = [];
      } else {
        this.loadProject(res.value);
      }
    },
    handlenCustMainId(value) {
      this.formData.fdCustName =
        (value[0] || {}).text === undefined ? '' : (value[0] || {}).text;
      this.formData.fdCustMainId = (value[0] || {}).value;

      this.getCrmCustInfo(
        this.formData.fdBranchCompanyCode,
        this.formData.fdCustMainId,
        this.formData.fdSaleDeptCode
      );
    },
    handlenSapCustName(res) {
      this.formData.fdSapCustName =
        (res[0] || {}).text === undefined ? '' : (res[0] || {}).text;
      this.formData.fdSapCustCode = (res[0] || {}).value;
      this.formData.fdChannelOneName = (res[0] || {}).fdChannelOneName;
      this.formData.fdChannelOneCode = (res[0] || {}).fdChannelOneCode;
      this.formData.fdChannelTwoName = (res[0] || {}).fdChannelTwoName;
      this.formData.fdChannelTwoCode = (res[0] || {}).fdChannelTwoCode;
    },
  },
};
</script>

<style lang="scss" scoped></style>
