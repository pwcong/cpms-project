<template>
  <van-popup
    :value="visible"
    position="right"
    :style="{ width: '100%', height: '100vh' }"
    :get-container="selectionContainer"
  >
    <list-layout>
      <template v-slot:header="{ className }">
        <van-nav-bar
          :class="className"
          title="天眼查详情"
          left-text="返回"
          left-arrow
          right-text="更新"
          @click-left="onCancel"
          @click-right="handleUpdate"
        />
      </template>
      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 46px)">
          <van-form ref="form">
            <block theme="primary" title="基本信息">
              <template v-slot:title>
                <div>
                  <span style="color: #333333; font-size: 14px">基本信息</span>
                </div>
              </template>
              <template v-slot:action>
                <div>
                  <span class="updateTime"> 更新时间: {{ formatDateTime(skeEyeInfo.updateTime) }} </span>
                </div>
              </template>
              <van-field v-model="skeEyeInfo.fdName" readonly label="客户名称" />
              <van-field v-model="skeEyeInfo.fdCreditCode" readonly label="统一信用编码" />
              <van-field v-model="skeEyeInfo.fdEnterpriseId" readonly label="企业ID" />
              <van-field v-model="skeEyeInfo.fdOrgNumber" readonly label="组织机构代码" />
              <van-field v-model="skeEyeInfo.fdHistoryNames" readonly label="曾用名" />
              <van-field v-model="skeEyeInfo.fdProperty3" readonly label="英文名" />
              <van-field v-model="skeEyeInfo.fdAlias" readonly label="简称" />
            </block>
            <block theme="primary" title="主要信息">
              <template v-slot:title>
                <span style="color: #333333; font-size: 14px">主要信息</span>
              </template>
              <van-field
                :value="skeEyeInfo.fdType === 1 ? '人' : skeEyeInfo.fdType === 2 ? '公司' : ''"
                readonly
                label="法人类型"
              />
              <van-field v-model="skeEyeInfo.fdLegalPersonName" readonly label="法人" />
              <van-field v-model="skeEyeInfo.fdTaxNumber" readonly label="纳税人识别号" />
              <van-field
                :value="skeEyeInfo.fdIsMicroEnt === 0 ? '不是' : skeEyeInfo.fdIsMicroEnt === 1 ? '是' : ''"
                readonly
                label="是否小微企业"
              />
              <van-field v-model="skeEyeInfo.fdCompanyOrgType" readonly label="企业类型" />
              <van-field v-model="skeEyeInfo.fdTags" readonly label="企业标签" />
              <van-field v-model="skeEyeInfo.fdPercentileScore" readonly label="企业评分" />
              <van-field v-model="skeEyeInfo.fdIndustry" readonly label="行业" />
              <van-field v-model="skeEyeInfo.fdStaffNumRange" readonly label="人员规模" />
              <van-field v-model="skeEyeInfo.fdSocialStaffNum" readonly label="参保人数" />
            </block>
            <block theme="primary" title="注册资本信息">
              <template v-slot:title>
                <span style="color: #333333; font-size: 14px">注册资本信息</span>
              </template>
              <van-field v-model="skeEyeInfo.fdRegCapital" readonly label="注册资本" />
              <van-field v-model="skeEyeInfo.fdRegCapitalCurrency" readonly label="注册资本币种" />
              <van-field v-model="skeEyeInfo.fdActualCapital" readonly label="实收注册资金" />
              <van-field v-model="skeEyeInfo.fdActualCapitalCurrency" readonly label="实收注册资本币种" />
              <van-field v-model="skeEyeInfo.fdRegNumber" readonly label="注册号" />
            </block>
            <block theme="primary" title="股票信息">
              <template v-slot:title>
                <span style="color: #333333; font-size: 14px">股票信息</span>
              </template>
              <van-field v-model="skeEyeInfo.fdBondName" readonly label="股票名" />
              <van-field v-model="skeEyeInfo.fdUsedBondName" readonly label="股票曾用名" />
              <van-field v-model="skeEyeInfo.fdBondType" readonly label="股票类型" />
              <van-field v-model="skeEyeInfo.fdBondNum" readonly label="股票号" />
            </block>
            <block theme="primary" title="注册地址信息">
              <template v-slot:title>
                <span style="color: #333333; font-size: 14px">注册地址信息</span>
              </template>
              <van-field v-model="skeEyeInfo.fdRegLocation" readonly label="注册地址" />
              <van-field v-model="skeEyeInfo.fdBase" readonly label="省份简称" />
              <van-field v-model="skeEyeInfo.fdCity" readonly label="市" />
              <van-field v-model="skeEyeInfo.fdDistrict" readonly label="区" />
            </block>
            <block theme="primary" title="时间信息">
              <template v-slot:title>
                <span style="color: #333333; font-size: 14px">时间信息</span>
              </template>
              <van-field v-model="skeEyeInfo.fdRegInstitute" readonly label="登记机关" />
              <van-field v-model="skeEyeInfo.fdBusinessScope" readonly label="经营范围" />
              <van-field v-model="skeEyeInfo.fdRegStatus" readonly label="企业状态" />
              <van-field :value="formatDate(skeEyeInfo.fdEstiblishTime)" readonly label="成立日期" />
              <van-field :value="formatDate(skeEyeInfo.fdUpdateTimes)" readonly label="更新时间" />
              <van-field :value="formatDate(skeEyeInfo.fdApprovedTime)" readonly label="核准时间" />
              <van-field :value="formatDate(skeEyeInfo.fdFromTime)" readonly label="经营开始时间" />
              <van-field :value="formatDate(skeEyeInfo.fdToTime)" readonly label="经营结束时间" />
              <van-field :value="formatDate(skeEyeInfo.fdRevokeDate)" readonly label="吊销日期" />
              <van-field v-model="skeEyeInfo.fdRevokeReason" readonly label="吊销原因" />
              <van-field :value="formatDate(skeEyeInfo.fdCancelDate)" readonly label="注销日期" />
              <van-field v-model="skeEyeInfo.fdCancelReason" readonly label="注销原因" />
            </block>
          </van-form>
        </div>
      </template>
    </list-layout>
  </van-popup>
</template>

<script>
import api from '@/api';
import dayjs from 'dayjs';
import { buildSelectionMixin, formatMixin } from '@/mixins';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {},
});

export default {
  name: 'skyeye-detail',
  mixins: [selectionMixin, formatMixin],
  props: {
    fdEnterpriseId: {
      type: String,
    },
    customerId: {
      type: String,
    },
    version: {
      type: Number,
    },
  },
  data() {
    return {
      skeEyeInfo: {},
    };
  },
  watch: {
    async fdEnterpriseId() {
      if (!!this.fdEnterpriseId) {
        try {
          const res = await api.customer.getCustomerSkeyeDetail(this.fdEnterpriseId);
          this.skeEyeInfo = res.data;
        } catch (e) {}
      }
    },
  },
  methods: {
    async handleUpdate() {
      this.loading = true;
      try {
        const res = await api.customer.getSkeyeDetail((this.skeEyeInfo || {}).fdCreditCode);
        this.skeEyeInfo = res.data;
        await api.customer.putCustomerNameholderupdate({
          fdCustName: (res.data || {}).fdName,
          fdCompanyRegassets: (res.data || {}).fdRegCapital, //注册资金
          fdCompanyRegtime: dayjs(new Date(res.data.fdEstiblishTime)).format('YYYY-MM-DD'), //注册时间
          fdCustManageforms: (res.data || {}).fdRegStatus, //经营状态
          fdCompanyType: (res.data || {}).fdCompanyOrgType, //公司类型
          fdRegLocation: (res.data || {}).fdRegLocation, //注册地址
          fdTotalCount: (res.data || {}).fdStaffNumRange, //公司总人数
          fdProvince: (res.data || {}).fdBase, //注册省
          fdCity: (res.data || {}).fdCity, //注册市
          fdUnifiedCode: (res.data || {}).fdCreditCode,
          id: this.customerId,
          version: this.version,
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/assets/scss/common.scss';

.updateTime {
  font-size: 12px;
  color: $theme-color;
}
</style>
