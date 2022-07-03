<template>
  <p-spin :spinning="loading">
    <list-layout class="page-project-edit" style="padding-bottom: 16px">
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
              <p-breadcrumb-item> 项目{{ isEdit ? '编辑' : '新建' }} </p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <!-- <p-button
              style="margin-left: 8px;"
              type="primary"
              @click="handleShowQuery"
            >
              查看相似项目
            </p-button> -->

            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleSubmit(true)"
              :loading="loading"
              v-if="!isEdit || formData.fdProjectStatus === 'draft'"
            >
              暂存
            </p-button>

            <oasubmit-wrapper
              style="margin-left: 8px"
              moduleFlag="cpms_project_main"
              :moduleId="id"
              :beforeSubmit="handleBeforeSubmit"
              :status="formData.fdProjectStatus"
              @submit="handleSubmit(false, $event)"
            >
              <p-button type="primary" :loading="loading">
                {{
                  formData.fdProjectStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交'
                }}
              </p-button>
            </oasubmit-wrapper>

            <p-button style="margin-left: 8px" @click="handleCancel"> 取消 </p-button>
          </template>
        </block>
        <block title="项目信息" style="margin-top: 16px" theme="primary">
          <template v-slot:title>
            <div>
              <span>项目信息</span>
              <span
                style="font-size: 12px; color: #e50113"
                v-if="!!formData.fdRepeatPrompt"
              >
                ({{ formData.fdRepeatPrompt }})
              </span>
            </div>
          </template>

          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="24">
              <p-form-model-item label="项目名称" prop="fdName">
                <div style="display: flex">
                  <p-input
                    :value="projectName"
                    read-only
                    placeholder="请完善商务中心+客户名称+地址+用途的项目报备"
                  />
                  <!-- <p-button-link
                    v-if="!(isEdit && formData.fdProjectStatus !== 'draft')"
                    style="margin-left: 8px"
                    @click="showSettingName = true"
                  >
                    设置
                  </p-button-link> -->
                </div>
                <div class="tips">
                  注：项目名称自动生成，生成格式为“商务中心+客户名称+地址+用途的项目报备”
                </div>
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="项目类型" prop="fdProjectTypeId">
                <select-project-type
                  :type="1"
                  :value="
                    !!formData.fdProjectTypeId
                      ? [
                          {
                            value: formData.fdProjectTypeId,
                            text: formData.fdProjectTypeName,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  allow-clear
                  @change="handleChangeCate"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="项目招投标编号" prop="fdTenderNum">
                <p-input
                  :maxLength="200"
                  :disabled="isEdit && formData.fdProjectStatus !== 'draft'"
                  v-model="formData.fdTenderNum"
                  :placeholder="
                    isEdit && formData.fdProjectStatus !== 'draft' ? undefined : '请输入'
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="所属行业" prop="fdBusinessCode">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_business"
                  :value="
                    !!formData.fdBusinessCode
                      ? [
                          {
                            value: formData.fdBusinessCode,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  allow-clear
                  @change="
                    ((formData.fdBusinessCode = ($event[0] || {}).value) || true) &&
                      (formData.fdBusinessName = ($event[0] || {}).text)
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="分公司" prop="fdCorporateCode">
                <select-sap-company
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
                  @change="handleChangeCorporate"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="业务单元" prop="fdAgencyCode">
                <select-agency
                  :value="
                    !!formData.fdAgencyCode
                      ? [
                          {
                            value: formData.fdAgencyCode,
                            text: formData.fdAgencyName,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  allow-clear
                  @change="
                    ((formData.fdAgencyCode = ($event[0] || {}).value) || true) &&
                      (formData.fdAgencyName = ($event[0] || {}).text)
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="商务中心" prop="fdBusinessCenter">
                <select-business
                  :agencyCode="formData.fdAgencyCode"
                  :value="
                    !!formData.fdBusinessCenter
                      ? [
                          {
                            value: formData.fdBusinessCenterCode,
                            text: formData.fdBusinessCenter,
                          },
                        ]
                      : []
                  "
                  :placeholder="!allowChangeBusiness ? undefined : '请选择'"
                  allow-clear
                  :readOnly="!allowChangeBusiness"
                  @change="
                    ((formData.fdBusinessCenterCode = ($event[0] || {}).value) || true) &&
                      (formData.fdBusinessCenter = ($event[0] || {}).text)
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="预计成交率" prop="fdSuccessRate">
                <select-rate
                  allow-clear
                  :value="
                    !!formData.fdSuccessRate
                      ? [
                          {
                            value: formData.fdSuccessRate,
                            text: formData.fdSuccessRate,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  @change="formData.fdSuccessRate = ($event[0] || {}).value"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="项目有效截止日期" prop="fdEndTime">
                <p-date-picker v-model="formData.fdEndTime" valueFormat="YYYY-MM-DD" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="预计成交总金额(元)" prop="fdProjectSum">
                <p-input
                  style="width: 100%"
                  read-only
                  :value="formatAmount(fdProjectSum)"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item label="用途" prop="fdUse">
                <p-input :maxLength="20" v-model="formData.fdUse" placeholder="请输入" />
                <div class="tips">注：内容长度限20字以内</div>
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item
                label="商务中心工程接口人"
                prop="sysBusinessCenterPersonList"
              >
                <p-select-user
                  :selectData="
                    (formData.sysBusinessCenterPersonList || []).map((d) => ({
                      name: d.fdPersonName,
                      uid: d.fdPersonId,
                    }))
                  "
                  @confirm="
                    formData.sysBusinessCenterPersonList = $event.map((d, i) => ({
                      fdPersonName: d.name,
                      fdPersonId: d.uid,
                      fdOrderBy: i + 1,
                    }))
                  "
                />
              </p-form-model-item>
            </p-col>
            <!-- <p-col :span="8">
              <p-form-model-item label="抄送人" prop="ccPersonPersonList">
                <p-select-user
                  :selectData="
                    (formData.ccPersonPersonList || []).map((d) => ({
                      name: d.fdPersonName,
                      uid: d.fdPersonId,
                    }))
                  "
                  @confirm="
                    formData.ccPersonPersonList = $event.map((d, i) => ({
                      fdPersonName: d.name,
                      fdPersonId: d.uid,
                      fdOrderBy: i + 1,
                    }))
                  "
                />
              </p-form-model-item>
            </p-col> -->

            <!-- <p-row>
            <p-col :span="24">
              <p-form-model-item label="项目所在地" prop="projectSites">
                <site-list style="width: 100%;" v-model="formData" @change="isChangeProjectSites = true" />
              </p-form-model-item>
            </p-col>
          </p-row> -->

            <p-col :span="24">
              <p-form-model-item label="项目情况简介" prop="fdProjectDesc">
                <p-textarea
                  v-model="formData.fdProjectDesc"
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

        <site-list
          style="margin-top: 16px"
          v-model="formData"
          @change="isChangeProjectSites = true"
        />

        <block title="客户信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="项目方式" prop="fdProjectManner">
                <select-project-manner
                  allow-clear
                  :value="
                    !!formData.fdProjectManner
                      ? [
                          {
                            value: formData.fdProjectManner,
                            text: formData.fdProjectManner,
                          },
                        ]
                      : []
                  "
                  placeholder="请选择"
                  @change="formData.fdProjectManner = ($event[0] || {}).value"
                />
              </p-form-model-item>
            </p-col>

            <template v-if="!!formData.fdProjectManner">
              <p-col :span="8">
                <p-form-model-item label="客户/代理商" prop="fdCustName">
                  <p-input
                    v-model="formData.fdCustName"
                    read-only
                    placeholder="请选择"
                    @click="handleSelectCustomer"
                  >
                  </p-input>
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="CRM客户名称" prop="fdSapCustName">
                  <select-crm-customer
                    :customerId="formData.fdCustMainId"
                    :branchCode="formData.fdCorporateCode"
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
                    @change="handleSelectCRM"
                    placeholder="请选择"
                  />
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="一级渠道" prop="fdChannelOneName">
                  <p-input :value="formData.fdChannelOneName" read-only />
                </p-form-model-item>
              </p-col>
              <p-col :span="8">
                <p-form-model-item label="二级渠道" prop="fdChannelTwoName">
                  <p-input :value="formData.fdChannelTwoName" read-only />
                </p-form-model-item>
              </p-col>
              <!-- <p-col :span="8">
                <p-form-model-item label="三级渠道" prop="fdChannelThreeName">
                  <p-input v-model="formData.fdChannelThreeName" read-only />
                </p-form-model-item>
              </p-col> -->
              <p-col :span="8">
                <p-form-model-item
                  label="终端客户名称"
                  prop="fdTianyanchaName"
                  v-if="formData.fdProjectManner === '代理商操作'"
                >
                  <div style="display: flex">
                    <p-input
                      v-model="formData.fdTianyanchaName"
                      placeholder="请输入"
                      style="flex: 1"
                    >
                    </p-input>
                    <p-button-link
                      style="margin-left: 8px"
                      @click="showSelectionTianyancha = true"
                    >
                      选择
                    </p-button-link>
                  </div>
                </p-form-model-item>
              </p-col>
            </template>
          </p-row>
        </block>

        <block title="其他信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="关联业务员" prop="fdLoginName">
                <p-select-user
                  :max="1"
                  :selectData="
                    !!formData.fdLoginName
                      ? [
                          {
                            uid: formData.fdLoginName,
                            name: formData.fdUserName,
                          },
                        ]
                      : []
                  "
                  @confirm="
                    (formData.fdLoginName = ($event[0] || {}).uid) &&
                      (formData.fdUserName = ($event[0] || {}).name)
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="关联线索" prop="fdClueId">
                <select-clue
                  queryType="followBy"
                  :readOnly="isEdit"
                  :value="
                    !!formData.fdClueId
                      ? [
                          {
                            value: formData.fdClueId,
                            text: formData.fdClueName,
                          },
                        ]
                      : []
                  "
                  :placeholder="isEdit ? undefined : '请选择'"
                  allow-clear
                  @change="
                    ((formData.fdClueId = ($event[0] || {}).value) || true) &&
                      (formData.fdClueName = ($event[0] || {}).text)
                  "
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="24">
              <p-form-model-item
                label="团队其他成员"
                prop="sysDatascopePersonAspectParams"
              >
                <p-select-user
                  :selectData="
                    formData.sysDatascopePersonAspectParams.map((d) => ({
                      name: d.fdPersonName,
                      uid: d.fdPersonId,
                    }))
                  "
                  @confirm="
                    formData.sysDatascopePersonAspectParams = $event.map((d) => ({
                      fdPersonName: d.name,
                      fdPersonId: d.uid,
                    }))
                  "
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="24">
              <p-form-model-item label="其他资料" prop="sysAttContractAspectParams">
                <uploader multiple v-model="formData.sysAttContractAspectParams" />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <party-list :moduleId="id" v-model="formData" style="margin-top: 16px" />

        <address-list
          @change="isChangeProjectSites = true"
          :moduleId="id"
          v-model="formData"
          style="margin-top: 16px"
        />

        <product-list
          @change="isChangeProjectSites = true"
          v-model="formData"
          style="margin-top: 16px"
        />

        <block style="text-align: center; margin-top: 32px">
          <oasubmit-wrapper
            moduleFlag="cpms_project_main"
            :moduleId="id"
            :beforeSubmit="handleBeforeSubmit"
            :status="formData.fdProjectStatus"
            @submit="handleSubmit(false, $event)"
          >
            <p-button type="primary" style="width: 150px" :loading="loading">
              {{
                formData.fdProjectStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交'
              }}
            </p-button>
          </oasubmit-wrapper>
        </block>
      </p-form-model>

      <!-- <setting-name
        :value="{}"
        :visible.sync="showSettingName"
        @change="handleChangeName"
        :agencyCode="formData.fdAgencyCode"
      /> -->

      <selection-customer
        status="pass"
        :value="[]"
        :visible.sync="showSelectionCustomer"
        @change="handleChangeCustomer"
      />

      <selection-tianyancha
        :value="[]"
        :visible.sync="showSelectionTianyancha"
        @change="handleChangeTianyancha"
      />

      <project-query
        :searchable="false"
        :projectName="formData.fdName"
        :visible.sync="showProjectQuery"
      />
    </list-layout>
  </p-spin>
</template>

<script>
import formMixin from './form';
import { formatMixin } from '@/mixins';
import PartyList from './party-list';
import AddressList from './address-list';
import ProductList from './product-list';
import SiteList from './site-list';
import SelectProjectType from '../components/select/project-type';
import SelectProjectManner from '../components/select/project-manner';
import SelectRate from '../components/select/rate';
import SelectCorporate from '@/views/components/select/corporate';
import SelectYesOrNo from '@/views/components/select/yes-or-no';
import SelectAgency from '@/views/components/select/agency';
import SelectBusiness from '@/views/components/select/business';
import SelectClue from '../components/select/clue';
import SelectSapCompany from '@/views/components/select/sap-company';
import SelectCRMCustomer from '@/views/components/select/crm-customer';
import SettingName from './setting-name';
import SelectionCustomer from '@/views/components/selection-customer';
import SelectionTianyancha from '@/views/components/selection-tianyancha';
import ProjectQuery from '../components/project-query';

export default {
  name: '项目编辑',
  mixins: [formMixin, formatMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showSettingName: false,
      showSelectionCustomer: false,
      showSelectionTianyancha: false,
      showProjectQuery: false,
    };
  },
  components: {
    PartyList,
    AddressList,
    ProductList,
    SiteList,
    SelectProjectType,
    SelectCorporate,
    SettingName,
    SelectionCustomer,
    SelectionTianyancha,
    SelectProjectManner,
    SelectRate,
    SelectYesOrNo,
    SelectClue,
    ProjectQuery,
    SelectAgency,
    SelectBusiness,
    SelectSapCompany,
    'select-crm-customer': SelectCRMCustomer,
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
    // handleChangeName(value) {
    //   const {
    //     province = [],
    //     city = [],
    //     businessCenter,
    //     company,
    //     purpose,
    //   } = value;

    //   this.formData.fdProvince = province[0].value;
    //   this.formData.fdCity = city[0].value;
    //   this.formData.fdBusinessCenter = businessCenter;
    //   this.formData.fdCompany = company;
    //   this.formData.fdUse = purpose;
    //   this.formData.fdName = `${province[0].text}${city[0].text}${businessCenter}${company}${purpose}项目`;
    // },
    handleShowQuery() {
      this.formData.fdName = this.getProjectName(this.formData);
      this.showProjectQuery = true;
    },
    handleChangeCate(res) {
      this.formData.fdProjectTypeId = (res[0] || {}).value;
      this.formData.fdProjectTypeName = (res[0] || {}).text;
    },
    handleSelectCustomer() {
      if (!this.formData.fdCorporateCode) {
        this.$message.error('请先选择分公司');
        return;
      }
      this.showSelectionCustomer = true;
    },
    async handleChangeCustomer(value) {
      this.formData.fdCustName = value[0].fdCustName;
      this.formData.fdCustMainId = value[0].id;

      this.loadCRMInfo(this.formData.fdCorporateCode, this.formData.fdCustMainId);
    },
    handleChangeTianyancha(value) {
      this.formData.fdTianyanchaName = value[0].name;
      this.formData.fdTianyanchaMainId = value[0].id;
    },
    handleProjectQuery() {
      this.$router.push({
        path: '/Business/ProjectQuery',
        query: {
          fdName: this.formData.fdName,
        },
      });
    },
    handleChangeCorporate(res) {
      this.formData.fdCorporateCode = (res[0] || {}).value;
      this.formData.fdCorporateName = (res[0] || {}).text;

      this.loadCRMInfo(this.formData.fdCorporateCode, this.formData.fdCustMainId);
    },
    handleSelectCRM(res) {
      this.formData.fdSapCustName = (res[0] || {}).text;
      this.formData.fdSapCustCode = (res[0] || {}).value;
      this.formData.fdChannelOneName = (res[0] || {}).fdChannelOneName;
      this.formData.fdChannelOneCode = (res[0] || {}).fdChannelOneCode;
      this.formData.fdChannelTwoName = (res[0] || {}).fdChannelTwoName;
      this.formData.fdChannelTwoCode = (res[0] || {}).fdChannelTwoCode;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.page-project-edit {
  .tips {
    color: $theme-color;
  }
}
</style>
