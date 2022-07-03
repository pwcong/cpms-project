<template>
  <list-layout class="page-project-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        :title="`${isEdit ? '编辑' : '新建'}合同申请`"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(true)"
        :right-text="!isEdit || formData.fdStatus === 'draft' ? '暂存' : ''"
        @click-right="onSubmit('draft')"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 90px)">
        <van-form ref="form" @submit="onSubmit(isEdit ? 'edit' : 'add')">
          <block theme="primary" title="基本信息">
            <van-field
              v-model="formData.fdProjectMainName"
              is-link
              readonly
              clickable
              name="fdProjectMainName"
              label="项目名称"
              placeholder="请选择"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择项目名称',
                  trriger: 'change',
                },
              ]"
              @click="showProject = true"
            />
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              v-model="formData.fdCustName"
              name="fdCustName"
              label="客户名称"
              @click="showCustName = true"
            />
            <van-field
              is-link
              readonly
              required
              clickable
              :rules="[
                {
                  required: true,
                  message: '请选择CRM客户名称',
                  trriger: 'change',
                },
              ]"
              placeholder="请选择"
              v-model="formData.fdSapCustName"
              name="fdSapCustName"
              label="CRM客户名称"
              @click="showSapCustName = true"
            />
            <van-field
              is-link
              readonly
              clickable
              required
              placeholder="请选择"
              :rules="[
                {
                  required: true,
                  message: '请选择先行盖章方',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdFirstSealCode"
              name="fdFirstSealCode"
              label="先行盖章方"
              @click="showFirstSealCode = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdFirstSealCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_first_seal"
                />
              </template>
            </van-field>
            <van-field
              placeholder="请输入"
              v-model="formData.fdQuantityWe"
              name="fdQuantityWe"
              oninput="value=value.replace(/[^\d]/g,'')"
              label="合同正本数量-我方"
            />
            <van-field
              placeholder="请输入"
              v-model="formData.fdQuantityParty"
              name="fdQuantityParty"
              oninput="value=value.replace(/[^\d]/g,'')"
              label="合同正本数量-对方"
            />
            <van-field
              is-link
              readonly
              clickable
              required
              placeholder="请选择"
              :rules="[
                {
                  required: true,
                  message: '请选择分公司',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdCorporateName"
              name="fdCorporateName"
              label="分公司"
              @click="showCorporateCode = true"
            />
            <van-field
              is-link
              readonly
              clickable
              required
              placeholder="请选择"
              :rules="[
                {
                  required: true,
                  message: '请选择印章类型',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdSealTypeCode"
              name="fdSealTypeCode"
              label="印章类型"
              @click="showSealTyCode = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdSealTypeCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_seal_type"
                />
              </template>
            </van-field>
            <van-field
              is-link
              readonly
              clickable
              required
              placeholder="请选择"
              :rules="[
                {
                  required: true,
                  message: '请选择事务类别',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdBusinessTypeCode"
              name="fdBusinessTypeCode"
              label="事务类别"
              @click="showBusinessTypeCode = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdBusinessTypeCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_business_type"
                />
              </template>
            </van-field>
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择合同模板',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdContractTemplateCode"
              name="fdContractTemplateCode"
              label="合同模板"
              @click="showContractTemplateCode = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdContractTemplateCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_contract_template"
                />
              </template>
            </van-field>
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择合同类别',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdContractTypeCode"
              name="fdContractTypeCode"
              label="合同类别"
              @click="showContractTypeCode = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdContractTypeCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_contract_type"
                />
              </template>
            </van-field>

            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择合同开始时间',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdBeginTime"
              name="fdBeginTime"
              label="合同开始时间"
              @click="showBeginTime = true"
            />
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择合同截止时间',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdEndTime"
              name="fdEndTime"
              label="合同截止时间"
              @click="showEndTime = true"
            />

            <van-field
              placeholder="请输入"
              required
              :rules="[
                {
                  required: true,
                  message: '请输入期限内合同金额(元)',
                  trriger: 'blur',
                },
              ]"
              v-model="formData.fdTermContractPrice"
              name="fdTermContractPrice"
              label="期限内合同金额(元)"
            />

            <van-field
              v-if="formData.fdTermContractPrice == 0"
              placeholder="请输入"
              required
              v-model="formData.fdPriceZeroReason"
              name="fdPriceZeroReason"
              label="金额为0理由"
              :rules="[
                {
                  required: true,
                  message: '金额为0理由',
                  trriger: 'blur',
                },
              ]"
            />
            <van-field
              v-else
              placeholder="请输入"
              v-model="formData.fdPriceZeroReason"
              name="fdPriceZeroReason"
              label="金额为0理由"
            />

            <van-field
              placeholder="请输入"
              required
              v-model="formData.fdPartyFullName"
              name="fdPartyFullName"
              label="合同相对方全称"
              :maxLength="200"
              :rules="[
                {
                  required: true,
                  message: '合同相对方全称',
                  trriger: 'blur',
                },
              ]"
            />
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择业务范畴"
              required
              :rules="[
                {
                  required: true,
                  message: '请选择业务范畴',
                  trriger: 'change',
                },
              ]"
              v-model="formData.fdBusinessScopeCode"
              name="fdBusinessScopeCode"
              label="业务范畴"
              @click="showBusinessScopeCode = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdBusinessScopeCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_business_scope"
                />
              </template>
            </van-field>
            <van-field
              placeholder="请输入"
              required
              :rules="[
                {
                  required: true,
                  message: '请输入合同附件主题',
                  trriger: 'blur',
                },
              ]"
              v-model="formData.fdContractTitle"
              name="fdContractTitle"
              label="合同附件主题"
              :maxLength="200"
            />
            <van-field
              required
              show-word-limit
              name="fdContentDescribe"
              v-model="formData.fdContentDescribe"
              rows="4"
              type="textarea"
              :maxlength="500"
              label="合同内容概述"
              placeholder="请输入"
            />

            <van-field
              readonly
              name="files"
              :value="(formData.sysAttContractAspectParams || []).map((d) => d.value).join(',')"
              label="合同附件"
            >
              <uploader
                mode="file"
                slot="input"
                multiple
                :value="formData.sysAttContractAspectParams"
                @input="formData.sysAttContractAspectParams = $event"
              />
            </van-field>

            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              required
              :rules="[{ required: true, message: '请选择直管/分部领导' }]"
              :value="(formData.fdLeaderList || []).map((d) => d.fdPersonName).join(',')"
              name="fdLeaderList"
              label="直管/分部领导"
              @click="showLeaderList = true"
            />
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              required
              :rules="[{ required: true, message: '请选择一级部门负责人/商总' }]"
              :value="(formData.fdManagerList || []).map((d) => d.fdPersonName).join(',')"
              name="fdManagerList"
              label="一级部门负责人/商总"
              @click="showManagerList = true"
            />
            <van-field
              is-link
              readonly
              clickable
              placeholder="请选择"
              :value="(formData.fdOtherList || []).map((d) => d.fdPersonName).join(',')"
              name="fdOtherList"
              label="其他相关领导"
              @click="showOtherList = true"
            />
          </block>
          <contract-list v-model="formData" :moduleId="id"></contract-list>
        </van-form>
      </div>
    </template>
    <template v-slot:footer="{ className }">
      <div :class="className">
        <oasubmit-wrapper
          :moduleId="id"
          moduleFlag="cpms_project_contract_main"
          :beforeSubmit="handleBeforeSubmit"
          :status="formData.fdStatus"
          @submit="handleSubmit($event)"
        >
          <van-button :loading="loading" block type="danger">
            {{ formData.fdStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
          </van-button>
        </oasubmit-wrapper>
      </div>
    </template>

    <selection-project
      searchable
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
      title="选择项目名称"
      @change="handleChangeProject"
      :visible.sync="showProject"
    />
    <selection-customer
      title="选择客户名称"
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
      :visible.sync="showCustName"
      searchable
    />
    <selection-crm-customer
      allow-clear
      :customerId="formData.fdCustMainId"
      title="选择CRM客户名称"
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
      :visible.sync="showSapCustName"
      searchable
    />
    <selection-dict
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
      title="选择先行盖章"
      systemCode="cpms"
      dictCode="cpms_first_seal"
      @change="handleFirstSealCode"
      :visible.sync="showFirstSealCode"
      searchable
    />
    <selection-corporate
      allow-clear
      title="选择分公司"
      :value="
        !!formData.fdCorporateName
          ? [
              {
                value: formData.fdCorporateCode,
                text: formData.fdCorporateName,
              },
            ]
          : []
      "
      @change="handleCorporateCode"
      :visible.sync="showCorporateCode"
      searchable
    />
    <selection-dict
      allow-clear
      title="选择印章类型"
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
      :visible.sync="showSealTyCode"
      searchable
    />
    <selection-dict
      allow-clear
      title="选择事务类别"
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
      :visible.sync="showBusinessTypeCode"
      searchable
    />
    <selection-dict
      allow-clear
      title="选择合同模板"
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
      :visible.sync="showContractTemplateCode"
      searchable
    />
    <selection-dict
      allow-clear
      title="选择合同类别"
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
      :visible.sync="showContractTypeCode"
      searchable
    />
    <van-popup v-model="showBeginTime" position="bottom">
      <van-datetime-picker
        type="date"
        title="选择合同开始时间"
        @cancel="showBeginTime = false"
        @confirm="handleBeginTimeConfirm"
        :min-date="minDate"
      />
    </van-popup>
    <van-popup v-model="showEndTime" position="bottom">
      <van-datetime-picker
        type="date"
        title="选择合同开始时间"
        @cancel="showEndTime = false"
        @confirm="handleEndTimeConfirm"
        :min-date="minDate"
      />
    </van-popup>

    <selection-dict
      allow-clear
      title="选择业务范畴"
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
      :visible.sync="showBusinessScopeCode"
      searchable
    />

    <selection-user
      :max="1"
      searchable
      :value="
        formData.fdLeaderList.map((d) => ({
          text: d.text,
          value: d.value,
        }))
      "
      :visible.sync="showLeaderList"
      title="直管/分部领导"
      @change="handleLeaderList"
    />

    <selection-user
      :max="1"
      searchable
      :value="
        formData.fdManagerList.map((d) => ({
          text: d.text,
          value: d.value,
        }))
      "
      :visible.sync="showManagerList"
      title="一级部门负责人/商导"
      @change="handleManagerList"
    />

    <selection-user
      searchable
      :max="1"
      multiple
      :value="
        formData.fdOtherList.map((d) => ({
          text: d.text,
          value: d.value,
        }))
      "
      :visible.sync="showOtherList"
      title="其他相关领导"
      @change="handlerOtherList"
    />
  </list-layout>
</template>

<script>
import dayjs from 'dayjs';
import SelectionProject from '@/views/components/selection/project';
import SelectionCustomer from '@/views/components/selection/customer';
import SelectionCrmCustomer from '@/views/components/selection/crm-customer';
import SelectionCorporate from '@/views/components/selection/corporate';
import { userMixin } from '@/mixins';
import ContractList from './contract-list';
import formMixin from './form';

export default {
  name: 'ContractEdit',
  mixins: [userMixin, formMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showProject: false,
      showCustName: false,
      showSapCustName: false,
      showFirstSealCode: false,
      showCorporateCode: false,
      showSealTyCode: false,
      showBusinessTypeCode: false,
      showContractTemplateCode: false,
      showContractTypeCode: false,
      showBeginTime: false,
      showEndTime: false,
      showBusinessScopeCode: false,
      showLeaderList: false,
      showManagerList: false,
      showOtherList: false,
      minDate: new Date(),
    };
  },
  components: {
    ContractList,
    SelectionProject,
    SelectionCustomer,
    SelectionCrmCustomer,
    SelectionCorporate,
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
    handleChangeProject(res) {
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
    handlenCustMainId(value) {
      this.formData.fdCustName = (value[0] || {}).text;
      this.formData.fdCustMainId = (value[0] || {}).value;

      this.getCrmCustInfo(this.formData.fdCustMainId);
    },
    handlenSapCustName(res) {
      this.formData.fdSapCustName = (res[0] || {}).text;
      this.formData.fdSapCustCode = (res[0] || {}).value;
    },
    handleFirstSealCode(res) {
      this.formData.fdFirstSealCode = (res[0] || {}).value;
    },
    handleCorporateCode(value) {
      this.formData.fdCorporateCode = (value[0] || {}).value;
      this.formData.fdCorporateName = (value[0] || {}).text;
    },
    handleSealTypeCode(res) {
      this.formData.fdSealTypeCode = (res[0] || {}).value;
    },
    handleBusinessTypeCode(res) {
      this.formData.fdBusinessTypeCode = (res[0] || {}).value;
    },
    handleContractTemplateCode(res) {
      this.formData.fdContractTemplateCode = (res[0] || {}).value;
    },
    handleContractTypeCode(res) {
      this.formData.fdContractTypeCode = (res[0] || {}).value;
    },
    handleBeginTimeConfirm(time) {
      // "YYYY-MM-DD HH:mm:ss"
      this.formData.fdBeginTime = dayjs(new Date(time)).format('YYYY-MM-DD');
      this.showBeginTime = false;
    },
    handleEndTimeConfirm(time) {
      // "YYYY-MM-DD HH:mm:ss"
      this.formData.fdEndTime = dayjs(new Date(time)).format('YYYY-MM-DD');
      this.showEndTime = false;
    },
    handleBusinessScopeCode(res) {
      this.formData.fdBusinessScopeCode = (res[0] || {}).value;
    },
    handleLeaderList(res) {
      this.formData.fdLeaderList = res.map((d, index) => ({
        ...d,
        fdPersonId: d.value,
        fdPersonName: d.text,
        fdOrderBy: index,
        fdFieldFlag: 'leader',
      }));
    },
    handleManagerList(res) {
      this.formData.fdManagerList = res.map((d, index) => ({
        ...d,
        fdPersonId: d.value,
        fdPersonName: d.text,
        fdOrderBy: index,
        fdFieldFlag: 'manager',
      }));
    },
    handlerOtherList(res) {
      this.formData.fdOtherList = res.map((d, index) => ({
        ...d,
        fdPersonId: d.value,
        fdPersonName: d.text,
        fdOrderBy: index,
        fdFieldFlag: 'other',
      }));
    },
  },
};
</script>

<style lang="scss" scoped></style>
