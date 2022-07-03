<template>
  <list-layout class="page-project-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        title="合同详情"
        left-text="返回"
        @click-left="handleCancel(false)"
        left-arrow
        :right-text="checkButton(formData, 'contractEdit') ? '编辑' : undefined"
        @click-right="handleEdit(id)"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 46px)">
        <van-form ref="form">
          <block theme="primary" title="基本信息">
            <van-field name="fdProjectMainName" readonly v-model="formData.fdProjectMainName" label="项目名称" />
            <van-field v-model="formData.fdNumber" name="fdNumber" readonly label="单据编号">
              <template #input>
                <barcode :value="formData.fdNumber" />
              </template>
            </van-field>
            <van-field name="fdCustName" readonly v-model="formData.fdCustName" label="客户名称" />
            <van-field name="fdSapCustName" readonly v-model="formData.fdSapCustName" label="CRM客户名称" />
            <van-field name="fdFirstSealCode" readonly v-model="formData.fdFirstSealCode" label="先行盖章方">
              <template #input>
                <dict-text
                  :value="(formData.fdFirstSealCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_first_seal"
                />
              </template>
            </van-field>
            <van-field name="fdQuantityWe" readonly v-model="formData.fdQuantityWe" label="合同正本数量-我方" />
            <van-field name="fdQuantityParty" readonly v-model="formData.fdQuantityParty" label="合同正本数量-对方" />
            <van-field name="fdCorporateCode" readonly v-model="formData.fdCorporateName" label="分公司"> </van-field>
            <van-field name="fdSealTypeCode" readonly v-model="formData.fdSealTypeCode" label="印章类型">
              <template #input>
                <dict-text
                  :value="(formData.fdSealTypeCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_seal_type"
                />
              </template>
            </van-field>
            <van-field name="fdBusinessTypeCode" readonly v-model="formData.fdBusinessTypeCode" label="事务类别">
              <template #input>
                <dict-text
                  :value="(formData.fdBusinessTypeCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_business_type"
                />
              </template>
            </van-field>
            <van-field
              name="fdContractTemplateCode"
              readonly
              v-model="formData.fdContractTemplateCode"
              label="合同模板"
            >
              <template #input>
                <dict-text
                  :value="(formData.fdContractTemplateCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_contract_template"
                />
              </template>
            </van-field>
            <van-field name="fdContractTypeCode" readonly v-model="formData.fdContractTypeCode" label="合同类别">
              <template #input>
                <dict-text
                  :value="(formData.fdContractTypeCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_contract_type"
                />
              </template>
            </van-field>
            <van-field name="fdBeginTime" readonly :value="formatDate(formData.fdBeginTime)" label="合同开始时间" />
            <van-field name="fdEndTime" readonly :value="formatDate(formData.fdEndTime)" label="合同结束时间" />
            <van-field
              name="fdTermContractPrice"
              readonly
              v-model="formData.fdTermContractPrice"
              label="期限内合同金额(元)"
            />
            <van-field name="fdPriceZeroReason" readonly v-model="formData.fdPriceZeroReason" label="金额为0理由" />
            <van-field name="fdPartyFullName" readonly v-model="formData.fdPartyFullName" label="合同相对方全称" />
            <van-field name="fdContractTitle" readonly v-model="formData.fdContractTitle" label="合同附件主题" />
            <van-field name="fdBusinessScopeCode" readonly v-model="formData.fdBusinessScopeCode" label="业务范畴">
              <template #input>
                <dict-text
                  :value="(formData.fdBusinessScopeCode || '').split(',')"
                  systemCode="cpms"
                  dictCode="cpms_business_scope"
                />
              </template>
            </van-field>
            <van-field
              readonly
              show-word-limit
              rows="4"
              type="textarea"
              maxlength="500"
              label="合同内容概述"
              v-model="formData.fdContentDescribe"
              name="fdContentDescribe"
            />
            <van-field
              readonly
              name="files"
              :value="formData.sysAttContractAspectParams.map((d) => d.text).join(',')"
              label="合同附件"
            >
            </van-field>
            <van-field
              readonly
              :value="(formData.fdLeaderList || []).map((d) => d.fdPersonName).join(',')"
              label="直接领导"
            />
            <van-field
              readonly
              :value="(formData.fdManagerList || []).map((d) => d.fdPersonName).join(',')"
              label="一级部门负责人"
            />
            <van-field
              readonly
              :value="(formData.fdOtherList || []).map((d) => d.fdPersonName).join(',')"
              label="其他相关领导"
            />
          </block>

          <van-tabs>
            <van-tab title="产品信息">
              <contract-list v-model="formData" readonly></contract-list>
            </van-tab>
            <van-tab title="更多信息">
              <more-info readonly :value="formData" />
            </van-tab>
            <van-tab title="审批记录">
              <audit-record moduleFlag="cpms_project_contract_main" :moduleId="id" readonly></audit-record>
            </van-tab>
            <van-tab title="审批信息">
              <audit-info readonly :moduleId="id" moduleFlag="cpms_project_contract_main"></audit-info>
            </van-tab>
          </van-tabs>
        </van-form>
      </div>
    </template>
  </list-layout>
</template>

<script>
import AuditRecord from '@/views/components/audit-record';
import AuditInfo from '@/views/components/audit-info';
import MoreInfo from '@/views/components/more-info';
import formMixin from '../ContractEdit/form';
import { userMixin, formatMixin } from '@/mixins';
import ContractList from '../ContractEdit/contract-list';
import { commonMixin } from '@/views/mixins';

export default {
  name: 'ContractDetail',
  mixins: [userMixin, formMixin, formatMixin, commonMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
    };
  },
  components: {
    ContractList,
    AuditRecord,
    AuditInfo,
    MoreInfo,
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },
  created() {
    this.initFormData(this.id);
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
