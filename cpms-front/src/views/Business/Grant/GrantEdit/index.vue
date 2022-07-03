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
              <p-breadcrumb-item>授权管理</p-breadcrumb-item>
              <p-breadcrumb-item>授权{{ isEdit ? '编辑' : '新建' }}</p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleSubmit(true)"
              :loading="loading"
              v-if="!isEdit || formData.fdStatus === 'draft'"
            >
              暂存
            </p-button>

            <oasubmit-wrapper
              moduleFlag="cpms_project_grant_main"
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

            <p-button style="margin-left: 8px" @click="handleCancel"> 取消 </p-button>
          </template>
        </block>

        <block title="填单人信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="填单人姓名" prop="fdLoginName">
                <p-input :maxLength="200" v-model="formData.fdUserName" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8"
              ><p-form-model-item label="填单人部门" prop="fdDeptName">
                <p-input :maxLength="200" v-model="formData.fdDeptName" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="填单人电话" prop="fdUserPhone">
                <p-input
                  :maxLength="200"
                  v-model="formData.fdUserPhone"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="填单时间" prop="createTime">
                <p-input :maxLength="200" v-model="formData.createTime" readOnly />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <block title="授权信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="盖章法人" prop="fdCorporateCode">
                <select-corporate
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
                  allow-clear
                  @change="handleChangeCor"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="盖章类型" prop="fdSealType">
                <select-seal-type
                  :value="
                    !!formData.fdSealType
                      ? [
                          {
                            value: formData.fdSealType,
                            text: formData.fdSealType,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  allow-clear
                  @change="formData.fdSealType = ($event[0] || {}).value"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="项目名称" prop="fdProjectMainId">
                <div>
                  <select-project
                    status="follow"
                    style="flex: 1"
                    allow-clear
                    :value="
                      !!formData.fdProjectMainId
                        ? [
                            {
                              value: formData.fdProjectMainId,
                              text: formData.fdProjectName,
                            },
                          ]
                        : []
                    "
                    placeholder="请选择"
                    @change="handleChangeProject"
                  />
                  <!-- <p-button type="primary">查看详情</p-button> -->
                </div>
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="被授权代理商名称" prop="fdCustName">
                <div style="display: flex; flex-wrap: no-wrap">
                  <select-customer
                    status="pass"
                    allow-clear
                    :value="
                      !!formData.fdCustId
                        ? [
                            {
                              value: formData.fdCustId,
                              text: formData.fdCustName,
                            },
                          ]
                        : []
                    "
                    placeholder="请选择"
                    @change="handleChangeCustomer"
                  />
                  <!-- <p-button type="primary">查看详情</p-button> -->
                </div>
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="授权时间起" prop="fdBeginTime">
                <p-date-picker
                  v-model="formData.fdBeginTime"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="授权时间止" prop="fdEndTime">
                <p-date-picker
                  v-model="formData.fdEndTime"
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="品类" prop="fdProductLineList">
                <select-product-line
                  read-only
                  :value="
                    formData.fdProductLineList.map((d) => ({
                      text: d.fdProductLineName,
                      value: d.fdProductLineCode,
                    }))
                  "
                  placeholder="请选择"
                  multiple
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="授权附件" prop="sysAttContractAspectParams">
                <uploader v-model="formData.sysAttContractAspectParams" multiple />
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item label="授权理由概述" prop="fdReasonSummary">
                <p-textarea
                  v-model="formData.fdReasonSummary"
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <block title="审批人信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="直管/分部领导" prop="fdLeaderList">
                <p-select-user
                  :max="1"
                  :selectData="
                    formData.fdLeaderList.map((d) => ({
                      uid: d.fdPersonId,
                      name: d.fdPersonName,
                    }))
                  "
                  @confirm="
                    formData.fdLeaderList = $event.map((d) => ({
                      fdPersonId: d.uid,
                      fdPersonName: d.name,
                    }))
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="加签人员" prop="fdAuditorList">
                <p-select-user
                  :selectData="
                    formData.fdAuditorList.map((d) => ({
                      uid: d.fdPersonId,
                      name: d.fdPersonName,
                    }))
                  "
                  @confirm="
                    formData.fdAuditorList = $event.map((d) => ({
                      fdPersonId: d.uid,
                      fdPersonName: d.name,
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
                    formData.fdManagerList.map((d) => ({
                      uid: d.fdPersonId,
                      name: d.fdPersonName,
                    }))
                  "
                  @confirm="
                    formData.fdManagerList = $event.map((d) => ({
                      fdPersonId: d.uid,
                      fdPersonName: d.name,
                    }))
                  "
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <block style="text-align: center; margin-top: 32px">
          <oasubmit-wrapper
            moduleFlag="cpms_project_grant_main"
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
import SelectProductLine from '@/views/components/select/product-line';
import formMixin from './form';
import SelectProject from '@/views/components/select/project';
import SelectCorporate from '@/views/components/select/corporate';
import SelectSealType from '../components/select/seal-type';

export default {
  name: '授权编辑',
  mixins: [formMixin],
  components: {
    SelectCorporate,
    SelectSealType,
    SelectProject,
    SelectCustomer,
    SelectProductLine,
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
    // 暂存和保存
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
    handleChangeCor(res) {
      this.formData.fdCorporateCode = (res[0] || {}).value;
      this.formData.fdCorporateName = (res[0] || {}).text;
    },
    handleChangeProject(res) {
      res = res[0];

      if (!res) {
        this.formData.fdProjectMainId = '';
        this.formData.fdProjectName = '';
        this.formData.fdCustId = '';
        this.formData.fdCustName = '';
      } else {
        this.loadProject(res.value);
      }
    },
    handleChangeCustomer(value) {
      this.formData.fdCustName = (value[0] || {}).text;
      this.formData.fdCustId = (value[0] || {}).id;
    },
  },
};
</script>

<style lang="scss" scoped></style>
