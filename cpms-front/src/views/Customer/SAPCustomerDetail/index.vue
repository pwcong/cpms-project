<template>
  <p-spin :spinning="loading">
    <list-layout style="padding-bottom: 16px">
      <p-form-model
        ref="form"
        :model="formData"
        :label-col="{ span: 24 }"
        :wrapper-col="{ span: 24 }"
      >
        <block>
          <template v-slot:title>
            <p-breadcrumb>
              <p-breadcrumb-item>首页</p-breadcrumb-item>
              <p-breadcrumb-item>客户管理</p-breadcrumb-item>
              <p-breadcrumb-item> 正式客户详情 </p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              type="primary"
              style="margin-left: 8px"
              @click="handleEdit(id)"
              v-if="checkButton(formData, 'edit')"
            >
              编辑
            </p-button>
            <p-button
              type="primary"
              style="margin-left: 8px"
              @click="handleDelete"
              v-if="checkButton(formData, 'delete')"
            >
              删除
            </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel"> 返回 </p-button>
          </template>
        </block>
        <block title="基本信息" style="margin-top: 16px" theme="primary">
          <template #action>
            <status-seal :status="formData.fdSapStatus">
              {{ formData.fdSapStatus | foramtStatus }}
            </status-seal>
            <barcode title="客户编码" :value="formData.fdSapNumber" />
          </template>
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="申请人" prop="fdReqUser">
                <p-input :value="formData.fdReqUser" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="部门" prop="fdReqDept">
                <p-input :maxLength="200" v-model="formData.fdReqDept" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="维护类型" prop="fdMaintainType">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_sap_maintain_type"
                  :value="
                    !!formData.fdMaintainType
                      ? [
                          {
                            value: formData.fdMaintainType,
                          },
                        ]
                      : []
                  "
                  allow-clear
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="创建日期" prop="fdCreateTime">
                <p-input :value="formData.fdCreateTime" read-only />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <block theme="primary">
          <template v-slot:title>
            <div>
              <span>客户详情</span>
              <p-button-link
                type="primary"
                @click="handleToTianyancha"
                v-if="!!formData.fdSapCustName || !!formData.fdEnterpriseId"
                style="margin-left: 8px; font-size: 12px"
              >
                查看天眼查客户详情
              </p-button-link>
            </div>
          </template>
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="客户名称" prop="fdSapCustName">
                <div style="display: flex; flex-wrap: no-wrap">
                  <p-input v-model="formData.fdSapCustName" read-only style="flex: 1" />
                </div>
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="统一社会信用代码" prop="fdSapUnifiedCode">
                <p-input v-model="formData.fdSapUnifiedCode" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="客户名称2" prop="fdSapCustName2">
                <p-input v-model="formData.fdSapCustName2" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="客户简称" prop="fdSapShortName">
                <p-input v-model="formData.fdSapShortName" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="客户账户组" prop="fdSapAccountGroup">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_sap_account_group"
                  :value="
                    !!formData.fdSapAccountGroup
                      ? [
                          {
                            text: formData.fdSapAccountGroup,
                            value: formData.fdSapAccountGroupCode,
                          },
                        ]
                      : []
                  "
                  read-only
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="国家" prop="fdSapCountry">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_country"
                  :value="
                    !!formData.fdSapCountry
                      ? [
                          {
                            text: formData.fdSapCountry,
                            value: formData.fdSapCountryCode,
                          },
                        ]
                      : []
                  "
                  read-only
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="省" prop="fdSapProvinceCode">
                <select-province
                  style="flex: 1"
                  :value="
                    !!formData.fdSapProvince
                      ? [
                          {
                            text: formData.fdSapProvince,
                            value: formData.fdSapProvinceCode,
                          },
                        ]
                      : []
                  "
                  allow-clear
                  read-only
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="市" prop="fdSapCityCode">
                <select-city
                  style="flex: 1; margin-left: 4px"
                  :province-code="formData.fdSapProvinceCode"
                  :value="
                    !!formData.fdSapCity
                      ? [{ text: formData.fdSapCity, value: formData.fdSapCityCode }]
                      : []
                  "
                  read-only
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="县" prop="fdSapCountyCode">
                <select-county
                  style="flex: 1; margin-left: 4px"
                  :city-code="formData.fdSapCityCode"
                  :value="
                    !!formData.fdSapCounty
                      ? [{ text: formData.fdSapCounty, value: formData.fdSapCountyCode }]
                      : []
                  "
                  read-only
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="乡镇" prop="fdSapTowns">
                <select-street
                  style="flex: 1; margin-left: 4px"
                  :county-code="formData.fdSapCountyCode"
                  :value="
                    !!formData.fdSapTowns
                      ? [{ text: formData.fdSapTowns, value: formData.fdSapTownsCode }]
                      : []
                  "
                  read-only
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="详细地址" prop="fdSapAddress">
                <p-input v-model="formData.fdSapAddress" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="联系人" prop="fdSapContact">
                <p-input v-model="formData.fdSapContact" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="手机号码" prop="fdSapMobile">
                <p-input v-model="formData.fdSapMobile" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="固话" prop="fdSapPhone">
                <p-input v-model="formData.fdSapPhone" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="客户邮箱" prop="fdSapMail">
                <p-input v-model="formData.fdSapMail" read-only />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="CRM门店市场级别" prop="fdShopLevel">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_shop_level"
                  :value="
                    !!formData.fdShopLevelCode
                      ? [
                          {
                            text: formData.fdShopLevel,
                            value: formData.fdShopLevelCode,
                          },
                        ]
                      : []
                  "
                  read-only
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="CRM门店分级" prop="fdShopType">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_shop_type"
                  :value="
                    !!formData.fdShopType
                      ? [
                          {
                            text: formData.fdShopType,
                            value: formData.fdShopTypeCode,
                          },
                        ]
                      : []
                  "
                  read-only
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="是否代理商" prop="fdAgent">
                <select-dict
                  systemCode="cpms"
                  dictCode="cpms_agent"
                  :value="
                    !!formData.fdAgent
                      ? [
                          {
                            value: formData.fdAgent,
                          },
                        ]
                      : []
                  "
                  read-only
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item label="附件">
                <uploader readOnly :value="formData.sysAttContractAspectParams" />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <block title="更多信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px">
            <p-col :span="8">
              <p-form-model-item label="财务共享单据号">
                <p-input :value="formData.fdBillnumber" read-only />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
      </p-form-model>
      <div style="margin-top: 16px">
        <p-tabs
          style="padding: 12px 16px; box-shadow: 0 2px 12px rgba(100, 101, 102, 0.2)"
        >
          <p-tab-pane key="1" tab="公司代码视图">
            <company-list v-model="formData" :moduleId="id" read-only />
          </p-tab-pane>
          <p-tab-pane key="2" tab="销售视图">
            <sales-list v-model="formData" :moduleId="id" read-only />
          </p-tab-pane>
          <p-tab-pane key="3" tab="银行账户信息">
            <bank-list v-model="formData" :moduleId="id" read-only />
          </p-tab-pane>
          <p-tab-pane key="4" tab="关联客户信息">
            <cust-list v-model="formData" :moduleId="formData.fdCustMainId" />
          </p-tab-pane>
          <p-tab-pane key="5" tab="推送记录">
            <push-record :moduleId="id" />
          </p-tab-pane>
        </p-tabs>
      </div>
    </list-layout>
  </p-spin>
</template>

<script>
import api from '@/api';
import dayjs from 'dayjs';
import formMixin from '../SAPCustomerEdit/form';
import { commonMixin } from '@/views/mixins';

import SelectProvince from '@/views/Customer/components/select/sap-province'; //省
import SelectCity from '@/views/Customer/components/select/sap-city'; //市
import SelectCounty from '@/views/Customer/components/select/sap-county'; //县
import SelectStreet from '@/views/Customer/components/select/sap-street'; //街道
import SelectYesOrNo from '@/views/components/select/yes-or-no';
import SelectAffiliatedAgents from '../components/select/affiliated-agents';
import CompanyList from '../SAPCustomerEdit/company-list'; //公司代码视图
import SalesList from '../SAPCustomerEdit/sales-list'; //销售视图信息
import BankList from '../SAPCustomerEdit/bank-list'; //银行账户信息
import CustList from './cust-list'; //关联客户信息
import PushRecord from '@/views/Customer/components/push-record'; //推送记录
export default {
  name: '客户详情',
  mixins: [formMixin, commonMixin],
  data() {
    const { id } = this.$route.params;

    return {
      selectTianyanchaVisible: false,
      visible: false,
      id,
      skeEyeId: '',
      inited: false,
    };
  },
  components: {
    SelectProvince,
    SelectCity,
    SelectCounty,
    SelectStreet,
    SelectAffiliatedAgents,
    SelectYesOrNo,
    CompanyList,
    SalesList,
    BankList,
    CustList,
    PushRecord,
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },
  filters: {
    foramtStatus(v) {
      switch (v) {
        case 'todo':
          return '待审批';
        case 'audit':
          return '审批中';
        case 'pass':
          return '审批通过';
        case 'reject':
          return '审批驳回';
        case 'draft':
          return '草稿';
        case 'fail':
          return '推送异常';
        default:
          return v;
      }
    },
    setTime(v) {
      if (!v) {
        return '';
      }
      return dayjs(new Date(v)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  created() {
    this.initFormData(this.id);
  },
  activated() {
    if (this.inited) {
      this.initFormData(this.id);
    } else {
      this.inited = true;
    }
  },
  methods: {
    checkType(types = []) {
      return types.indexOf(this.type) > -1;
    },
    async handleDelete() {
      try {
        await api.customer.deleteDeleteSapCustomer(this.id);
        this.$message.success('客户删除成功');
        this.handleCancel();
      } catch (e) {}
    },
    handleToTianyancha() {
      this.$router.push({
        path: `/Customer/TianyanchaDetail`,
        query: {
          id: this.formData.fdEnterpriseId,
          version: this.formData.version,
          customerId: this.id,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
