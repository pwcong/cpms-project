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
              <p-breadcrumb-item>合同管理</p-breadcrumb-item>
              <p-breadcrumb-item>合同申请</p-breadcrumb-item>
              <p-breadcrumb-item
                >{{ isEdit ? '编辑' : '新建' }}合同申请</p-breadcrumb-item
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
              moduleFlag="cpms_project_contract_main"
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
              <p-form-model-item label="项目名称" prop="fdProjectMainName">
                <select-project
                  status="follow"
                  allow-clear
                  :value="
                    !!formData.fdProjectMainName
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
              <p-form-model-item label="客户名称" prop="fdCustName">
                <div style="display: flex; flex-wrap: no-wrap">
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
                  />
                </div>
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="CRM客户名称" prop="fdSapCustName">
                <div>
                  <select-crm-customer
                    allow-clear
                    :customerId="formData.fdCustMainId"
                    placeholder="请选择"
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
                    style="flex: 1"
                  />
                  <!-- <p-button type="primary">转正式客户</p-button> -->
                </div>
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="先行盖章方" prop="fdFirstSealCode">
                <select-dict
                  allow-clear
                  :value="
                    !!formData.fdFirstSealCode
                      ? [
                          {
                            value: formData.fdFirstSealCode,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_first_seal"
                  @change="handleFirstSealCode"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="分公司" prop="fdCorporateCode">
                <select-corporate
                  allow-clear
                  placeholder="请选择"
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
                  @change="handleCorporateCode"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="4">
              <p-form-model-item label="合同正本数量-对方">
                <div style="display: flex">
                  <p-input
                    v-model="formData.fdQuantityParty"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    placeholder="请输入对方合同正本数量"
                  />
                </div>
              </p-form-model-item>
            </p-col>
            <p-col :span="4">
              <p-form-model-item label="合同正本数量-我方">
                <div style="display: flex">
                  <p-input
                    v-model="formData.fdQuantityWe"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    placeholder="请输入我方合同正本数量"
                  />
                </div>
              </p-form-model-item>
            </p-col>
          </p-row>
          <p-row :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="事务类别" prop="fdBusinessTypeCode">
                <select-dict
                  allow-clear
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_business_type"
                  :value="
                    !!formData.fdBusinessTypeCode
                      ? [
                          {
                            value: formData.fdBusinessTypeCode,
                          },
                        ]
                      : []
                  "
                  @change="handleBusinessTypeCode"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="印章类型" prop="fdSealTypeCode">
                <select-dict
                  allow-clear
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_seal_type"
                  :value="
                    !!formData.fdSealTypeCode
                      ? [
                          {
                            value: formData.fdSealTypeCode,
                          },
                        ]
                      : []
                  "
                  @change="handleSealTypeCode"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="合同类别" prop="fdContractTypeCode">
                <select-dict
                  allow-clear
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_contract_type"
                  :value="
                    !!formData.fdContractTypeCode
                      ? [
                          {
                            value: formData.fdContractTypeCode,
                          },
                        ]
                      : []
                  "
                  @change="handleContractTypeCode"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="合同模板" prop="fdContractTemplateCode">
                <select-dict
                  allow-clear
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_contract_template"
                  :value="
                    !!formData.fdContractTemplateCode
                      ? [
                          {
                            value: formData.fdContractTemplateCode,
                          },
                        ]
                      : []
                  "
                  @change="handleContractTemplateCode"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="期限内合同金额(元)" prop="fdTermContractPrice">
                <p-input-number
                  placeholder="请输入"
                  style="width: 100%"
                  step="0.01"
                  precision="2"
                  v-model="formData.fdTermContractPrice"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8"
              ><p-form-model-item label="合同开始时间" prop="fdBeginTime">
                <p-date-picker
                  valueFormat="YYYY-MM-DD"
                  v-model="formData.fdBeginTime" /></p-form-model-item
            ></p-col>

            <p-col :span="8">
              <p-form-model-item label="合同截至时间" prop="fdEndTime">
                <p-date-picker valueFormat="YYYY-MM-DD" v-model="formData.fdEndTime" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="合同相对方全称" prop="fdPartyFullName">
                <p-input
                  placeholder="请输入"
                  v-model="formData.fdPartyFullName"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="金额为0理由" prop="fdPriceZeroReason">
                <p-input
                  placeholder="请输入"
                  v-model="formData.fdPriceZeroReason"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="业务范畴" prop="fdBusinessScopeCode">
                <select-dict
                  allow-clear
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_business_scope"
                  :value="
                    !!formData.fdBusinessScopeCode
                      ? [
                          {
                            value: formData.fdBusinessScopeCode,
                          },
                        ]
                      : []
                  "
                  @change="handleBusinessScopeCode"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8"
              ><p-form-model-item label="合同附件主题" prop="fdContractTitle">
                <p-input
                  placeholder="请输入"
                  v-model="formData.fdContractTitle"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="合同附件" prop="sysAttContractAspectParams">
                <uploader v-model="formData.sysAttContractAspectParams" multiple />
              </p-form-model-item>
            </p-col>

            <p-col :span="24">
              <p-form-model-item label="合同内容概述" prop="fdContentDescribe">
                <p-textarea
                  placeholder="请输入"
                  v-model="formData.fdContentDescribe"
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="直管/分部领导" prop="fdLeaderList">
                <!-- <p-input v-model="formData.directLeader" /> -->
                <p-select-user
                  :max="1"
                  :selectData="
                    (formData.fdLeaderList || []).map((d) => ({
                      uid: d.fdPersonId,
                      name: d.fdPersonName,
                    }))
                  "
                  @confirm="
                    formData.fdLeaderList = ($event || []).map((d, index) => ({
                      fdPersonId: d.uid,
                      fdPersonName: d.name,
                      fdOrderBy: index,
                      fdFieldFlag: 'leader',
                    }))
                  "
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="一级部门负责人/商总" prop="fdManagerList">
                <p-select-user
                  :max="1"
                  :selectData="
                    (formData.fdManagerList || []).map((d) => ({
                      uid: d.fdPersonId,
                      name: d.fdPersonName,
                    }))
                  "
                  @confirm="
                    formData.fdManagerList = ($event || []).map((d, index) => ({
                      fdPersonId: d.uid,
                      fdPersonName: d.name,
                      fdOrderBy: index,
                      fdFieldFlag: 'manager',
                    }))
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="其他相关领导" prop="fdOtherList">
                <!-- <p-input v-model="formData.otherLeader" /> -->
                <p-select-user
                  :selectData="
                    (formData.fdOtherList || []).map((d) => ({
                      uid: d.fdPersonId,
                      name: d.fdPersonName,
                    }))
                  "
                  @confirm="
                    formData.fdOtherList = ($event || []).map((d, index) => ({
                      fdPersonId: d.uid,
                      fdPersonName: d.name,
                      fdOrderBy: index,
                      fdFieldFlag: 'other',
                    }))
                  "
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
      </p-form-model>
      <selection-customer
        status="pass"
        :value="[]"
        :visible.sync="showSelectionCustomer"
        @change="handleChangeCustomer"
      />
      <contract-list
        style="margin-top: 16px"
        v-model="formData"
        :moduleId="id"
      ></contract-list>
      <!-- <install-list v-model="formData" :moduleId="id"></install-list> -->
      <!-- <transport-list v-model="formData" :moduleId="id"></transport-list> -->
      <block style="text-align: center; margin-top: 32px">
        <oasubmit-wrapper
          moduleFlag="cpms_project_contract_main"
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
    </list-layout>
  </p-spin>
</template>

<script>
import SelectCustomer from '@/views/components/select/customer';
import SelectCorporate from '@/views/components/select/corporate';
import SelectCrmCustomer from '@/views/components/select/crm-customer';
import ContractList from './contract-list';
import formMixin from './form';
import SelectProject from '@/views/components/select/project';
// import InstallList from "./install-list";
// import TransportList from "./transport-list";

export default {
  name: '合同编辑',
  mixins: [formMixin],
  components: {
    ContractList,
    SelectProject,
    // InstallList,
    // TransportList,
    SelectCrmCustomer,
    SelectCorporate,
    SelectCustomer,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showSelectionCustomer: false,
    };
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },

  created() {
    this.initFormData(this.id);
  },

  methods: {
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
      this.formData.fdSapCustName = '';
      this.formData.fdSapCustCode = '';
      this.formData.fdPartyFullName = '';
      this.formData.contractPriceAddParamLists = [];

      this.formData.fdProjectMainId = (res[0] || {}).value;
      this.formData.fdProjectMainName = (res[0] || {}).text;
      res = res[0];

      if (!res) {
        this.formData.fdProjectMainId = '';
        this.formData.fdProjectMainName = '';
        this.formData.fdCustMainId = '';
        this.formData.fdCustName = '';
        this.formData.fdSapCustName = '';
        this.formData.fdSapCustCode = '';
        this.formData.fdPartyFullName = '';
        this.formData.contractPriceAddParamLists = [];
      } else {
        this.loadProject(res.value);
      }
    },

    handleCorporateCode(value) {
      this.formData.fdCorporateCode =
        (value[0] || {}).value === undefined ? '' : (value[0] || {}).value;
      this.formData.fdCorporateName = (value[0] || {}).text;
    },
    handleFirstSealCode(res) {
      this.formData.fdFirstSealCode =
        (res[0] || {}).value === undefined ? '' : (res[0] || {}).value;
    },
    handleSealTypeCode(res) {
      this.formData.fdSealTypeCode =
        (res[0] || {}).value === undefined ? '' : (res[0] || {}).value;
    },
    handleBusinessTypeCode(res) {
      this.formData.fdBusinessTypeCode =
        (res[0] || {}).value === undefined ? '' : (res[0] || {}).value;
    },
    handleContractTemplateCode(res) {
      this.formData.fdContractTemplateCode =
        (res[0] || {}).value === undefined ? '' : (res[0] || {}).value;
    },
    handleContractTypeCode(res) {
      this.formData.fdContractTypeCode =
        (res[0] || {}).value === undefined ? '' : (res[0] || {}).value;
    },
    handleBusinessScopeCode(res) {
      this.formData.fdBusinessScopeCode =
        (res[0] || {}).value === undefined ? '' : (res[0] || {}).value;
    },
    handleChangeCustomer(value) {
      this.formData.fdCustName = value[0].fdCustName;
      this.formData.fdCustMainId = value[0].id;
    },
    handlenCustMainId(value) {
      this.formData.fdCustName =
        (value[0] || {}).text === undefined ? '' : (value[0] || {}).text;
      this.formData.fdCustMainId = (value[0] || {}).value;

      this.getCrmCustInfo(this.formData.fdCustMainId);
    },
    handlenSapCustName(res) {
      this.formData.fdSapCustName =
        (res[0] || {}).text === undefined ? '' : (res[0] || {}).text;
      this.formData.fdSapCustCode = (res[0] || {}).value;
    },
  },
};
</script>

<style lang="scss" scoped></style>
