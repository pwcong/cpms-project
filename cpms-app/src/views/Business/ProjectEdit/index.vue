<template>
  <list-layout class="page-project-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        :title="`项目${isEdit ? '编辑' : '新建'}`"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(true)"
        :right-text="!isEdit || formData.fdProjectStatus === 'draft' ? '暂存' : undefined"
        @click-right="onSubmit('draft')"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 90px)">
        <van-form ref="form" @submit="onSubmit(isEdit ? 'edit' : 'add')">
          <block title="项目信息" theme="primary">
            <van-field
              :value="projectName"
              name="fdName"
              readonly
              label="项目名称"
              placeholder="注：项目名称自动生成，生成格式为“商务中心+客户名称+地址+用途的项目报备”"
              type="textarea"
            />
            <van-field
              required
              v-model="formData.fdProjectTypeName"
              name="fdProjectTypeName"
              label="项目类型"
              is-link
              readonly
              clickable
              @click="showProjectType = true"
              placeholder="请选择"
              :rules="[{ required: true, message: '请选择项目类型' }]"
            />
            <van-field
              v-model="formData.fdTenderNum"
              name="fdTenderNum"
              label="项目招投标编号"
              placeholder="请输入"
              :disabled="isEdit && formData.fdProjectStatus !== 'draft'"
            />
            <van-field
              required
              v-model="formData.fdBusinessCode"
              name="fdBusinessCode"
              label="所属行业"
              is-link
              readonly
              clickable
              @click="showBusinessCode = true"
              placeholder="请选择"
              :rules="[{ required: true, message: '请选择所属行业' }]"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdBusinessCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_business"
                />
              </template>
            </van-field>
            <van-field
              required
              v-model="formData.fdCorporateName"
              name="fdCorporateName"
              label="分公司"
              is-link
              readonly
              clickable
              @click="showSapCompany = true"
              placeholder="请选择"
              :rules="[{ required: true, message: '请选择分公司' }]"
            />
            <van-field
              required
              v-model="formData.fdAgencyName"
              name="fdAgencyName"
              label="业务单元"
              is-link
              readonly
              clickable
              @click="showAgency = true"
              placeholder="请选择"
              :rules="[{ required: true, message: '请选择业务单元' }]"
            />
            <van-field
              required
              v-model="formData.fdBusinessCenter"
              name="fdBusinessCenter"
              label="商务中心"
              is-link
              readonly
              clickable
              @click="allowChangeBusiness && (showBusinessCenter = true)"
              placeholder="请选择"
              :rules="[{ required: true, message: '请选择商务中心' }]"
            />
            <van-field
              required
              v-model="formData.fdSuccessRate"
              name="fdSuccessRate"
              label="预计成交率(%)"
              is-link
              readonly
              clickable
              @click="showSucessRate = true"
              placeholder="请选择"
              :rules="[{ required: true, message: '请选择预计成交率' }]"
            />
            <van-field
              required
              v-model="formData.fdEndTime"
              name="fdEndTime"
              label="项目有效截止日期"
              placeholder="请选择"
              is-link
              readonly
              clickable
              @click="showEndTime = true"
              :rules="[{ required: true, message: '请选择项目有效截止日期' }]"
            />
            <van-field
              required
              v-model="formData.fdUse"
              name="fdUse"
              type="textarea"
              label="用途"
              placeholder="请输入"
              :rules="[{ required: true, message: '请输入用途' }]"
            />
            <van-field
              required
              :value="(formData.sysBusinessCenterPersonList || []).map((d) => d.fdPersonName).join(',')"
              name="sysBusinessCenterPersonList"
              label="商务中心工程接口人"
              placeholder="请选择"
              is-link
              readonly
              clickable
              @click="showBusinessCenterPerson = true"
              :rules="[{ required: true, message: '请选择商务中心工程接口人' }]"
            />
            <!-- <van-field
              :value="(formData.ccPersonPersonList || []).map((d) => d.fdPersonName).join(',')"
              name="ccPersonPersonList"
              label="抄送人"
              placeholder="请选择"
              is-link
              readonly
              clickable
              @click="showBusinessCC = true"
            /> -->
            <van-field :value="formatAmount(fdProjectSum)" name="fdProjectSum" readonly label="预计成交总金额(元)" />
            <van-field
              required
              v-model="formData.fdProjectDesc"
              name="fdProjectDesc"
              label="项目情况简介"
              placeholder="请输入"
              type="textarea"
              :rules="[{ required: true, message: '请输入项目情况简介' }]"
            />
          </block>

          <site-list v-model="formData" @change="isChangeProjectSites = true" />

          <block title="客户信息" theme="primary">
            <van-field
              required
              v-model="formData.fdProjectManner"
              name="fdProjectManner"
              label="项目方式"
              is-link
              readonly
              clickable
              @click="showProjectManner = true"
              placeholder="请选择"
              :rules="[{ required: true, message: '请选择项目方式' }]"
            />

            <template v-if="!!formData.fdProjectManner">
              <van-field
                required
                v-model="formData.fdCustName"
                name="fdCustName"
                is-link
                readonly
                clickable
                @click="handleSelectCustomer"
                label="客户/代理商"
                placeholder="请选择"
                :rules="[{ required: true, message: '请选择客户/代理商' }]"
              />
              <van-field
                v-model="formData.fdSapCustName"
                name="fdSapCustName"
                label="CRM客户名称"
                is-link
                readonly
                clickable
                @click="showCrm = true"
              />
              <van-field readonly v-model="formData.fdChannelOneName" name="fdChannelOneName" label="一级渠道" />
              <van-field readonly v-model="formData.fdChannelTwoName" name="fdChannelTwoName" label="二级渠道" />

              <!-- <van-field
                required
                v-model="formData.fdTianyanchaName"
                name="fdTianyanchaName"
                v-if="formData.fdProjectManner === '代理商操作'"
                is-link
                readonly
                clickable
                @click="showTianyancha = true"
                label="终端客户名称"
                placeholder="请选择"
                :rules="[{ required: true, message: '请选择终端客户名称' }]"
              /> -->

              <van-field
                required
                v-model="formData.fdTianyanchaName"
                name="fdTianyanchaName"
                v-if="formData.fdProjectManner === '代理商操作'"
                label="终端客户名称"
                placeholder="请输入"
                :rules="[{ required: true, message: '请输入终端客户名称' }]"
              >
                <template #extra>
                  <van-button type="danger" size="mini" native-type="button" @click="showTianyancha = true">
                    选择
                  </van-button>
                </template>
              </van-field>
            </template>
          </block>
          <block title="其他信息" theme="primary">
            <van-field
              required
              v-model="formData.fdUserName"
              name="fdUserName"
              label="关联业务员"
              placeholder="请选择"
              is-link
              readonly
              clickable
              @click="showUser = true"
              :rules="[{ required: true, message: '请选择关联业务员' }]"
            />
            <van-field
              v-model="formData.fdClueName"
              name="fdClueName"
              label="关联线索"
              placeholder="请选择"
              is-link
              readonly
              clickable
              @click="showClue = true"
            />
            <van-field
              :value="(formData.sysDatascopePersonAspectParams || []).map((d) => d.fdPersonName).join(',')"
              name="sysDatascopePersonAspectParams"
              label="团队其他成员"
              placeholder="请选择"
              is-link
              readonly
              clickable
              @click="showOtherUsers = true"
            />
          </block>
          <party-list v-model="formData" />
          <address-list :moduleId="id" v-model="formData" @change="isChangeProjectSites = true" />
          <product-list v-model="formData" @change="isChangeProjectSites = true" />
        </van-form>
      </div>
    </template>

    <template v-slot:footer="{ className }">
      <div :class="className">
        <oasubmit-wrapper
          :moduleId="id"
          moduleFlag="cpms_project_main"
          :beforeSubmit="handleBeforeSubmit"
          :status="formData.fdProjectStatus"
          @submit="handleSubmit($event)"
        >
          <van-button :loading="loading" block type="danger">
            {{ formData.fdProjectStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
          </van-button>
        </oasubmit-wrapper>
      </div>
    </template>

    <selection-dict
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
      title="选择所属行业"
      :visible.sync="showBusinessCode"
      @change="
        ((formData.fdBusinessCode = ($event[0] || {}).value) || true) &&
          (formData.fdBusinessName = ($event[0] || {}).text)
      "
      searchable
    />

    <selection-sap-company
      searchable
      :visible.sync="showSapCompany"
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
      title="选择分公司"
      @change="handleChangeCorporate"
    />

    <selection-project-type
      :visible.sync="showProjectType"
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
      title="选择项目类型"
      searchable
      @change="handleChangeCate"
    />

    <selection-agency
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
      title="选择业务单元"
      searchable
      :visible.sync="showAgency"
      @change="
        ((formData.fdAgencyCode = ($event[0] || {}).value) || true) && (formData.fdAgencyName = ($event[0] || {}).text)
      "
    />

    <selection-business
      :visible.sync="showBusinessCenter"
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
      title="选择商务中心"
      searchable
      @change="
        ((formData.fdBusinessCenterCode = ($event[0] || {}).value) || true) &&
          (formData.fdBusinessCenter = ($event[0] || {}).text)
      "
    />

    <selection-rate
      :visible.sync="showSucessRate"
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
      title="选择预计成交率"
      @change="formData.fdSuccessRate = ($event[0] || {}).value"
    />

    <selection-user
      multiple
      searchable
      :visible.sync="showBusinessCenterPerson"
      :value="
        (formData.sysBusinessCenterPersonList || []).map((d) => ({
          text: d.fdPersonName,
          value: d.fdPersonId,
        }))
      "
      title="选择商务中心工程接口人"
      @change="
        formData.sysBusinessCenterPersonList = $event.map((d, i) => ({
          fdPersonName: d.text,
          fdPersonId: d.value,
          fdOrderBy: i + 1,
        }))
      "
    />

    <!-- <selection-user
      multiple
      searchable
      :visible.sync="showBusinessCC"
      :value="
        (formData.ccPersonPersonList || []).map((d) => ({
          text: d.fdPersonName,
          value: d.fdPersonId,
        }))
      "
      title="抄送人"
      @change="
        formData.ccPersonPersonList = $event.map((d, i) => ({
          fdPersonName: d.text,
          fdPersonId: d.value,
          fdOrderBy: i + 1,
        }))
      "
    /> -->

    <selection-user
      searchable
      :visible.sync="showUser"
      :value="
        !!formData.fdLoginName
          ? [
              {
                value: formData.fdLoginName,
                text: formData.fdUserName,
              },
            ]
          : []
      "
      title="选择关联业务员"
      @change="handleChangeUser"
    />

    <selection-user
      multiple
      searchable
      :visible.sync="showOtherUsers"
      :value="
        formData.sysDatascopePersonAspectParams.map((d) => ({
          text: d.fdPersonName,
          value: d.fdPersonId,
        }))
      "
      title="选择团队其他成员"
      @change="
        formData.sysDatascopePersonAspectParams = $event.map((d) => ({
          fdPersonName: d.text,
          fdPersonId: d.value,
        }))
      "
    />

    <selection-project-manner
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
      title="选择项目方式"
      :visible.sync="showProjectManner"
      @change="formData.fdProjectManner = ($event[0] || {}).value"
    />

    <selection-customer
      searchable
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
      title="选择客户/代理商"
      :visible.sync="showCustomer"
      @change="handleChangeCustomer"
    />

    <van-popup :get-container="getDocumentBody" v-model="showEndTime" position="bottom">
      <van-datetime-picker
        type="date"
        :max-date="CALENDAR_MAX_DATE"
        :min-date="CALENDAR_MIN_DATE"
        @confirm="handleChangeEndTime"
      />
    </van-popup>

    <selection-crm-customer
      searchable
      :customerId="formData.fdCustMainId"
      :branchCode="formData.fdCorporateCode"
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
      :visible.sync="showCrm"
      @change="handleSelectCRM"
      title="选择CRM客户名称"
    />

    <selection-tianyancha
      :value="
        !!formData.fdTianyanchaName
          ? [
              {
                text: formData.fdTianyanchaName,
                value: formData.fdTianyanchaMainId,
              },
            ]
          : []
      "
      searchable
      :visible.sync="showTianyancha"
      @change="handleChangeTianyancha"
      title="选择终端客户名称"
    />

    <selection-clue
      searchable
      :visible.sync="showClue"
      queryType="followBy"
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
      title="选择关联线索"
      @change="
        ((formData.fdClueId = ($event[0] || {}).value) || true) && (formData.fdClueName = ($event[0] || {}).text)
      "
    />
  </list-layout>
</template>

<script>
import dayjs from 'dayjs';
import { userMixin, formatMixin } from '@/mixins';
import { commonMixin } from '@/views/mixins';
import PartyList from './party-list';
import AddressList from './address-list';
import ProductList from './product-list';
import SiteList from './site-list';

import SelectionAgency from '@/views/components/selection/agency';
import SelectionSapCompany from '@/views/components/selection/sap-company';
import SelectionCRMCustomer from '@/views/components/selection/crm-customer';
import SelectionProjectType from '../components/selection/project-type';
import SelectionBusiness from '@/views/components/selection/business';
import SelectionCustomer from '@/views/components/selection/customer';
import SelectionClue from '@/views/components/selection/clue';
import SelectionTianyancha from '@/views/components/selection/tianyancha';
import SelectionRate from '../components/selection/rate';
import SelectionProjectManner from '../components/selection/project-manner';

import formMixin from './form';

export default {
  mixins: [userMixin, formMixin, formatMixin, commonMixin],
  components: {
    PartyList,
    AddressList,
    SiteList,
    ProductList,
    SelectionSapCompany,
    SelectionProjectType,
    SelectionAgency,
    SelectionBusiness,
    SelectionRate,
    SelectionCustomer,
    SelectionProjectManner,
    'selection-crm-customer': SelectionCRMCustomer,
    SelectionTianyancha,
    SelectionClue,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showProjectType: false,
      showBusinessCode: false,
      showSapCompany: false,
      showAgency: false,
      showBusinessCenter: false,
      showSucessRate: false,
      showEndTime: false,
      showBusinessCenterPerson: false,
      showBusinessCC: false,
      showProjectManner: false,
      showCustomer: false,
      showCrm: false,
      showTianyancha: false,
      showUser: false,
      showClue: false,
      showOtherUsers: false,
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
        this.$refs.form
          .validate()
          .then(() => {
            if (!this.checkFormData(this.formData)) {
              resolve(false);
              return;
            }
            resolve(true);
          })
          .catch(() => resolve(false));
      });
    },
    handleSubmit(form) {
      this.formData = {
        ...this.formData,
        ...(form || {}),
      };
      this.$refs.form.submit();
    },
    onSubmit(action) {
      if (this.loading) {
        return;
      }

      this.$dialog
        .confirm({
          title: `是否确认${action === 'draft' ? '暂存' : '提交'}表单?`,
        })
        .then(() => {
          this.submitFormData(this.formData, action);
        });
    },
    handleChangeCorporate(res) {
      this.formData.fdCorporateCode = (res[0] || {}).value;
      this.formData.fdCorporateName = (res[0] || {}).text;

      this.loadCRMInfo(this.formData.fdCorporateCode, this.formData.fdCustMainId);
    },
    handleChangeCate(res) {
      this.formData.fdProjectTypeId = (res[0] || {}).value;
      this.formData.fdProjectTypeName = (res[0] || {}).text;
    },
    handleChangeEndTime(res) {
      this.formData.fdEndTime = dayjs(res).format('YYYY-MM-DD');
      this.showEndTime = false;
    },
    handleSelectCustomer() {
      if (!this.formData.fdCorporateCode) {
        this.$toast.fail({
          message: '请先选择分公司',
        });
        return;
      }
      this.showCustomer = true;
    },
    async handleChangeCustomer(res) {
      this.formData.fdCustName = res[0].fdCustName;
      this.formData.fdCustMainId = res[0].id;

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
    handleChangeTianyancha(res) {
      this.formData.fdTianyanchaName = (res[0] || {}).name;
      this.formData.fdTianyanchaMainId = (res[0] || {}).id;
    },
    handleChangeUser(res) {
      this.formData.fdLoginName = (res[0] || {}).value;
      this.formData.fdUserName = (res[0] || {}).text;
    },
  },
};
</script>

<style lang="scss" scoped></style>
