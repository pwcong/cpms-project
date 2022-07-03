<template>
  <list-layout class="skyeye-detail" style="padding-bottom: 16px">
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
            <p-breadcrumb-item>客户管理</p-breadcrumb-item>
            <p-breadcrumb-item> 天眼查详情 </p-breadcrumb-item>
          </p-breadcrumb>
        </template>
        <template v-slot:action>
          <p-button
            v-if="!!customerId && (skeEyeInfo || {}).fdEnterpriseId"
            type="primary"
            :loading="loading"
            @click="update"
          >
            更新
          </p-button>
          <p-button style="margin-left: 8px" @click="handleCancel">返回</p-button>
        </template>
      </block>
      <block class="mt" theme="primary">
        <template v-slot:title>
          <div>
            <span>基本信息</span>
            <span style="font-size: 12px; color: #e50113">
              （更新时间：{{ formatDateTime(skeEyeInfo.updateTime) }}）
            </span>
          </div>
        </template>
        <p-row class="mt" :gutter="24">
          <p-col :span="8">
            <p-form-model-item label="客户名称(企业名)：">
              <p-input readOnly v-model="skeEyeInfo.fdName" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="统一社会信用代码：">
              <p-input readOnly v-model="skeEyeInfo.fdCreditCode" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="企业ID：">
              <p-input readOnly v-model="skeEyeInfo.fdEnterpriseId" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="组织机构代码：">
              <p-input readOnly v-model="skeEyeInfo.fdOrgNumber" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="曾用名：">
              <p-input readOnly v-model="skeEyeInfo.fdHistoryNames" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="英文名：">
              <p-input readOnly v-model="skeEyeInfo.fdProperty3" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="简称：">
              <p-input readOnly v-model="skeEyeInfo.fdAlias" />
            </p-form-model-item>
          </p-col>
        </p-row>
      </block>
      <block class="mt" title="主要信息" theme="primary">
        <p-row class="mt" :gutter="24">
          <p-col :span="8">
            <p-form-model-item label="法人类型：">
              <p-input
                readOnly
                :value="
                  skeEyeInfo.fdType === 1 ? '人' : skeEyeInfo.fdType === 2 ? '公司' : ''
                "
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="法人：">
              <p-input readOnly v-model="skeEyeInfo.fdLegalPersonName" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="纳税人识别号：">
              <p-input readOnly v-model="skeEyeInfo.fdTaxNumber" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="是否是小微企业：">
              <p-input
                readOnly
                :value="
                  skeEyeInfo.fdIsMicroEnt === 0
                    ? '不是'
                    : skeEyeInfo.fdIsMicroEnt === 1
                    ? '是'
                    : ''
                "
              />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="企业类型：">
              <p-input readOnly v-model="skeEyeInfo.fdCompanyOrgType" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="企业标签：">
              <p-input readOnly v-model="skeEyeInfo.fdTags" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="企业评分：">
              <p-input readOnly v-model="skeEyeInfo.fdPercentileScore" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="行业：">
              <p-input readOnly v-model="skeEyeInfo.fdIndustry" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="人员规模：">
              <p-input readOnly v-model="skeEyeInfo.fdStaffNumRange" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="参保人数：">
              <p-input readOnly v-model="skeEyeInfo.fdSocialStaffNum" />
            </p-form-model-item>
          </p-col>
        </p-row>
      </block>
      <block class="mt" title="注册资本信息" theme="primary">
        <p-row class="mt" :gutter="24">
          <p-col :span="8">
            <p-form-model-item label="注册资本：">
              <p-input readOnly v-model="skeEyeInfo.fdRegCapital" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="注册资本币种：">
              <p-input readOnly v-model="skeEyeInfo.fdRegCapitalCurrency" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="实收注册资金：">
              <p-input readOnly v-model="skeEyeInfo.fdActualCapital" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="实收注册资本币种：">
              <p-input readOnly v-model="skeEyeInfo.fdActualCapitalCurrency" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="注册号：">
              <p-input readOnly v-model="skeEyeInfo.fdRegNumber" />
            </p-form-model-item>
          </p-col>
        </p-row>
      </block>
      <block class="mt" title="股票信息" theme="primary">
        <p-row class="mt" :gutter="24">
          <p-col :span="8">
            <p-form-model-item label="股票名：">
              <p-input readOnly v-model="skeEyeInfo.fdBondName" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="股票曾用名：">
              <p-input readOnly v-model="skeEyeInfo.fdUsedBondName" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="股票类型：">
              <p-input readOnly v-model="skeEyeInfo.fdBondType" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="股票号：">
              <p-input readOnly v-model="skeEyeInfo.fdBondNum" />
            </p-form-model-item>
          </p-col>
        </p-row>
      </block>
      <block class="mt" title="注册地址信息" theme="primary">
        <p-row class="mt" :gutter="24">
          <p-col :span="8">
            <p-form-model-item label="注册地址：">
              <p-input readOnly v-model="skeEyeInfo.fdRegLocation" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="省份简称：">
              <p-input readOnly v-model="skeEyeInfo.fdBase" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="市：">
              <p-input readOnly v-model="skeEyeInfo.fdCity" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="区：">
              <p-input readOnly v-model="skeEyeInfo.fdDistrict" />
            </p-form-model-item>
          </p-col>
        </p-row>
      </block>
      <block class="mt" title="时间信息" theme="primary">
        <p-row class="mt" :gutter="24">
          <p-col :span="8">
            <p-form-model-item label="登记机关：">
              <p-input readOnly v-model="skeEyeInfo.fdRegInstitute" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="经营范围：">
              <p-input readOnly v-model="skeEyeInfo.fdBusinessScope" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="企业状态：">
              <p-input readOnly v-model="skeEyeInfo.fdRegStatus" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="成立日期：">
              <p-input readOnly :value="formatDateTime(skeEyeInfo.fdEstiblishTime)" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="更新时间：">
              <p-input readOnly :value="formatDateTime(skeEyeInfo.fdUpdateTimes)" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="核准时间：">
              <p-input readOnly :value="formatDateTime(skeEyeInfo.fdApprovedTime)" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="经营开始时间：">
              <p-input readOnly :value="formatDateTime(skeEyeInfo.fdFromTime)" />
              <template>
                {{ formatDateTime(fdFromTime) }}
              </template>
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="经营结束时间：">
              <p-input readOnly :value="formatDateTime(skeEyeInfo.fdToTime)" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="吊销日期：">
              <p-input readOnly :value="formatDateTime(skeEyeInfo.fdRevokeDate)" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="吊销原因：">
              <p-input readOnly v-model="skeEyeInfo.fdRevokeReason" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="注销日期：">
              <p-input readOnly :value="formatDateTime(skeEyeInfo.fdCancelDate)" />
            </p-form-model-item>
          </p-col>
          <p-col :span="8">
            <p-form-model-item label="注销原因：">
              <p-input readOnly v-model="skeEyeInfo.fdCancelReason" />
            </p-form-model-item>
          </p-col>
        </p-row>
      </block>
    </p-form-model>
  </list-layout>
</template>
<script>
import { formatMixin } from '@/mixins';
import api from '@/api';
import dayjs from 'dayjs';

export default {
  mixins: [formatMixin],
  data() {
    const { id, customerId, version } = this.$route.query;
    return {
      loading: false,
      id,
      customerId,
      version,
      skeEyeInfo: {},
    };
  },
  async created() {
    if (!!this.customerId || !!this.id) {
      const res = await api.customer.getCustomerSkeyeDetail(this.id);
      this.skeEyeInfo = res.data;
    }
  },
  methods: {
    async update() {
      this.loading = true;
      try {
        const res = await api.customer.getSkeyeDetail(
          (this.skeEyeInfo || {}).fdEnterpriseId
        );
        this.skeEyeInfo = res.data;
        await api.customer.putCustomerNameholderupdate({
          fdCustName: (res.data || {}).fdName,
          fdCompanyRegassets: (res.data || {}).fdRegCapital, //注册资金
          fdCompanyRegtime: dayjs(new Date(res.data.fdEstiblishTime)).format(
            'YYYY-MM-DD'
          ), //注册时间
          fdCustManageforms: (res.data || {}).fdRegStatus, //经营状态
          fdCompanyType: (res.data || {}).fdCompanyOrgType, //公司类型
          fdRegLocation: (res.data || {}).fdRegLocation, //注册地址
          fdTotalCount: (res.data || {}).fdStaffNumRange, //公司总人数
          fdProvince: (res.data || {}).fdBase, //注册省
          fdCity: (res.data || {}).fdCity, //注册市
          fdUnifiedCode: (res.data || {}).fdCreditCode,
          fdEnterpriseId: (res.data || {}).fdEnterpriseId,
          id: this.customerId,
          version: this.version,
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    handleCancel() {
      this.$router.back(true);
    },
  },
};
</script>
<style lang="scss" scoped>
.skyeye-detail {
  .mt {
    margin-top: 16px;
  }
}
</style>
