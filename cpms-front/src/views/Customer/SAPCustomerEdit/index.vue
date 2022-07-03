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
              <p-breadcrumb-item>客户管理</p-breadcrumb-item>
              <p-breadcrumb-item>
                正式客户{{ isEdit ? '编辑' : '新建' }}
              </p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              type="primary"
              @click="handleSubmit(true)"
              :loading="loading"
              v-if="!isEdit || formData.fdSapStatus === 'draft'"
            >
              暂存
            </p-button>
            <p-button
              type="primary"
              style="margin: 0px 8px"
              @click="handleSubmit()"
              :loading="loading"
            >
              {{
                formData.fdSapStatus === 'draft' || formData.fdSapStatus === 'reject'
                  ? '提交'
                  : isEdit
                  ? '保存'
                  : '提交'
              }}
            </p-button>
            <p-button @click="handleCancel"> 取消 </p-button>
          </template>
        </block>
        <block title="基本信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <!-- <p-col :span="24">
              <p-form-model-item label="标题" prop="fdTitle" :maxLength="50">
                <p-input v-model="formData.fdTitle" placeholder="请输入" />
              </p-form-model-item>
            </p-col> -->
            <p-col :span="8">
              <p-form-model-item label="申请人" prop="fdReqUser">
                <p-input v-model="formData.fdReqUser" read-only />
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
                  placeholder="请选择"
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
                  @change="formData.fdMaintainType = ($event[0] || {}).value"
                  allow-clear
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
        <block style="margin-top: 16px" theme="primary">
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
                <select-sap-customer
                  :readOnly="!!id && formData.fdSapStatus === 'reject'"
                  placeholder="请选择"
                  moduleFlag="cpms_cust_main"
                  allow-clear
                  :value="
                    !!formData.fdCustMainId
                      ? [
                          {
                            value: formData.fdCustMainId,
                            text: formData.fdSapCustName,
                          },
                        ]
                      : []
                  "
                  @change="handleCust"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="统一社会信用代码" prop="fdSapUnifiedCode">
                <p-input v-model="formData.fdSapUnifiedCode" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="客户名称2" prop="fdSapCustName2">
                <p-input v-model="formData.fdSapCustName2" placeholder="请输入" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="客户简称" prop="fdSapShortName">
                <p-input v-model="formData.fdSapShortName" placeholder="请输入" />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="客户账户组" prop="fdSapAccountGroup">
                <select-dict
                  readOnly
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_sap_account_group"
                  :value="
                    !!formData.fdSapAccountGroupCode
                      ? [
                          {
                            text: formData.fdSapAccountGroup,
                            value: formData.fdSapAccountGroupCode,
                          },
                        ]
                      : []
                  "
                  @change="handleChangeCustType"
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="国家" prop="fdSapCountry">
                <select-dict
                  :readOnly="!!id && formData.fdSapStatus === 'reject'"
                  placeholder="请选择"
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
                  @change="handleChangeCountry"
                  allow-clear
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8" v-if="this.formData.fdSapCountryCode === 'CN'">
              <p-form-model-item label="省" prop="fdSapProvinceCode">
                <select-province
                  :readOnly="!!id && formData.fdSapStatus === 'reject'"
                  style="flex: 1"
                  placeholder="请选择"
                  :value="
                    !!formData.fdSapProvinceCode
                      ? [
                          {
                            text: formData.fdSapProvince,
                            value: formData.fdSapProvinceCode,
                          },
                        ]
                      : []
                  "
                  allow-clear
                  @change="handleChangeProvince"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8" v-if="this.formData.fdSapCountryCode === 'CN'">
              <p-form-model-item label="市" prop="fdSapCityCode">
                <select-city
                  :readOnly="!!id && formData.fdSapStatus === 'reject'"
                  style="flex: 1; margin-left: 4px"
                  :province-code="formData.fdSapProvinceCode"
                  placeholder="请选择"
                  :value="
                    !!formData.fdSapCityCode
                      ? [{ text: formData.fdSapCity, value: formData.fdSapCityCode }]
                      : []
                  "
                  @change="handleChangeCity"
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item
                label="县"
                prop="fdSapCountyCode"
                v-if="this.formData.fdSapCountryCode === 'CN'"
              >
                <select-county
                  :readOnly="!!id && formData.fdSapStatus === 'reject'"
                  style="flex: 1; margin-left: 4px"
                  :city-code="formData.fdSapCityCode"
                  placeholder="请选择"
                  :value="
                    !!formData.fdSapCountyCode
                      ? [{ text: formData.fdSapCounty, value: formData.fdSapCountyCode }]
                      : []
                  "
                  @change="handleChangeCounty"
                  allow-clear
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item
                label="乡镇"
                v-if="this.formData.fdSapCountryCode === 'CN'"
                prop="fdSapTowns"
              >
                <select-street
                  style="flex: 1; margin-left: 4px"
                  :readOnly="!!id && formData.fdSapStatus === 'reject'"
                  :county-code="formData.fdSapCountyCode"
                  placeholder="请选择"
                  :value="
                    !!formData.fdSapTownsCode
                      ? [{ text: formData.fdSapTowns, value: formData.fdSapTownsCode }]
                      : []
                  "
                  @change="handleChangeStreet"
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="详细地址" prop="fdSapAddress">
                <p-input
                  v-model="formData.fdSapAddress"
                  :readOnly="!!id && formData.fdSapStatus === 'reject'"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="联系人" prop="fdSapContact">
                <p-input
                  v-model="formData.fdSapContact"
                  :readOnly="!!id && formData.fdSapStatus === 'reject'"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="手机号码" prop="fdSapMobile">
                <p-input
                  v-model="formData.fdSapMobile"
                  :readOnly="!!id && formData.fdSapStatus === 'reject'"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="固话" prop="fdSapPhone">
                <p-input
                  v-model="formData.fdSapPhone"
                  :readOnly="!!id && formData.fdSapStatus === 'reject'"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="客户邮箱" prop="fdSapMail">
                <p-input v-model="formData.fdSapMail" placeholder="请输入" />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="CRM门店市场级别" prop="fdShopLevel">
                <select-dict
                  placeholder="请选择"
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
                  @change="
                    ((formData.fdShopLevelCode = ($event[0] || {}).value) || true) &&
                      (formData.fdShopLevel = ($event[0] || {}).text)
                  "
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="CRM门店分级" prop="fdShopType">
                <select-dict
                  placeholder="请选择"
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
                  @change="
                    ((formData.fdShopTypeCode = ($event[0] || {}).value) || true) &&
                      (formData.fdShopType = ($event[0] || {}).text)
                  "
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="是否代理商" prop="fdAgent">
                <select-dict
                  placeholder="请选择"
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
                  @change="formData.fdAgent = ($event[0] || {}).value"
                  allow-clear
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="24">
              <!-- 附件需要必填 -->
              <p-form-model-item label="附件" prop="sysAttContractAspectParams">
                <uploader v-model="formData.sysAttContractAspectParams" multiple />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <company-list
          style="margin-top: 32px"
          v-model="formData"
          :moduleId="id"
          @change="handCompanyCode"
        />
        <sales-list
          style="margin-top: 32px"
          v-model="formData"
          :moduleId="id"
          @change="handSalesView"
        />
        <bank-list
          style="margin-top: 32px"
          v-model="formData"
          :moduleId="id"
          @change="handBankAccount"
        />
        <block style="text-align: center; margin-top: 32px">
          <p-button
            type="primary"
            style="width: 150px"
            @click="handleSubmit()"
            :loading="loading"
          >
            {{ formData.fdSapStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
          </p-button>
        </block>
      </p-form-model>
    </list-layout>
  </p-spin>
</template>

<script>
import api from '@/api';
import dayjs from 'dayjs';
import formMixin from './form';

import SelectProvince from '@/views/Customer/components/select/sap-province';
import SelectCity from '@/views/Customer/components/select/sap-city';
import SelectCounty from '@/views/Customer/components/select/sap-county';
import SelectStreet from '@/views/Customer/components/select/sap-street';
import SelectYesOrNo from '@/views/components/select/yes-or-no';
import SelectSapCustomer from '../components/select/sap-customer';
import CompanyList from './company-list';
import SalesList from './sales-list';
import BankList from './bank-list';
export default {
  name: '正式客户编辑',
  mixins: [formMixin],
  data() {
    const { id } = this.$route.params;
    const { fdCustMainId, fdEnterpriseId } = this.$route.query;
    return {
      selectTianyanchaVisible: false,
      visible: false,
      id,
      fdCustMainId,
      fdEnterpriseId,
      customerIdentification: 'cust',
    };
  },
  components: {
    SelectProvince,
    SelectCity,
    SelectCounty,
    SelectStreet,
    SelectSapCustomer,
    SelectYesOrNo,
    CompanyList,
    SalesList,
    BankList,
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },
  filters: {
    setTime(v) {
      if (!v) {
        return '';
      }
      return dayjs(new Date(v)).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  created() {
    this.initFormData(this.id);
    this.formData.fdEnterpriseId = this.fdEnterpriseId;
  },
  methods: {
    handleSubmit(isDraft) {
      if (this.loading) {
        return;
      }

      const submit = (action) => {
        this.submitFormData(this.formData, action);
      };

      if (isDraft) {
        this.$confirm({
          title: '是否确认暂存表单?',
          onOk: () => {
            submit('draft');
          },
          onCancel: () => {},
        });
      } else {
        this.$refs.form.validate(async (valid) => {
          if (!valid) {
            this.$message.error('表单字段校验未通过');
            return;
          }

          if (!!this.checkFormData(this.formData)) {
            return;
          }

          this.$confirm({
            title: '是否确认提交表单?',
            onOk: () => {
              submit(this.isEdit ? 'edit' : 'add');
            },
            onCancel: () => {},
          });
        });
      }
    },

    handleCust(query) {
      this.formData.fdCustMainId = (query[0] || {}).value;
      this.formData.fdSapCustName = (query[0] || {}).text;
      this.formData.fdSapShortName = (query[0] || {}).text;
      if (!!(query[0] || {}).value) {
        this.getCustInfo((query[0] || {}).value);
      } else {
        this.formData.fdSapCustName = '';
        this.formData.fdSapCustName2 = '';
        this.formData.fdSapShortName = '';
        this.formData.fdSapUnifiedCode = '';
        this.formData.fdEnterpriseId = '';
        this.formData.fdSapAddress = '';
        this.formData.fdSapContact = '';
        this.formData.fdSapMobile = '';
        this.formData.fdSapPhone = '';
        this.formData.fdSapProvince = '';
        this.formData.fdSapProvinceCode = '';
        this.formData.fdSapCity = '';
        this.formData.fdSapCityCode = '';
        this.formData.fdSapCounty = '';
        this.formData.fdSapCountyCode = '';
        this.formData.fdSapTowns = '';
        this.formData.fdSapTownsCode = '';
      }
    },

    async getCustInfo(fdCustMainId) {
      this.loading = true;
      try {
        const data = await api.customer.getCustomerDetail(fdCustMainId);
        const addressData = await api.customer.postSapAddressTransformation({
          provinceCode: data.fdProvinceCode,
          provinceName: data.fdProvince,
          cityCode: data.fdCityCode,
          cityName: data.fdCity,
        });
        let addressDtoList = (data.addressDtoList || []).filter(
          (item) => item.fdIsValid == 1
        ); //意向客户中 有效的办公地址列表
        let contactDtoList = (data.contactDtoList || []).filter(
          (item) => item.fdIsValid == 1
        ); //意向客户中 有效的客户联系人列表

        this.formData.fdSapCustName = data.fdCustName; //客户名称
        this.formData.fdSapCustName2 = data.fdCustName; //客户名称2
        this.formData.fdSapShortName = data.fdCustName; //客户简称
        this.formData.fdSapUnifiedCode = data.fdUnifiedCode; //统一社会信用代码
        this.formData.fdSapProvince = addressData.provinceName; //省
        this.formData.fdSapProvinceCode = addressData.provinceCode; //省
        this.formData.fdSapCity = addressData.cityName; //市
        this.formData.fdSapCityCode = addressData.cityCode; //市
        this.formData.fdSapCounty = addressData.countyName; //县
        this.formData.fdSapCountyCode = addressData.countyCode; //县
        this.formData.fdSapTowns = addressData.streetName; //乡镇
        this.formData.fdSapTownsCode = addressData.streetCode; //乡镇
        this.formData.fdEnterpriseId = data.fdEnterpriseId;

        this.formData.fdSapAddress = (addressDtoList[0] || {}).fdDetailaddress; //详细地址 = 意向客户中的有效的地址的第一个
        this.formData.fdSapContact = (contactDtoList[0] || {}).fdContactName; //联系人 = 联系人列表的第一个
        this.formData.fdSapMobile = (contactDtoList[0] || {}).fdContactMobile; //手机号码 = 联系人列表的第一个
        this.formData.fdSapPhone = (contactDtoList[0] || {}).fdContactPhone; //固话 = 联系人列表的第一个
      } finally {
        this.loading = false;
      }
    },

    handleChangeCustType(res) {
      this.formData.fdSapAccountGroup = (res[0] || {}).text;
      this.formData.fdSapAccountGroupCode = (res[0] || {}).value;
      if (this.formData.fdSapAccountGroup === 'agent') {
        this.formData.fdIsAgent = '1';
      } else {
        this.formData.fdIsAgent = '0';
      }
    },
    //国家
    handleChangeCountry(res) {
      this.formData.fdSapCountryCode = (res[0] || {}).value;
      this.formData.fdSapCountry = (res[0] || {}).text;
    },
    //省
    handleChangeProvince(res) {
      this.formData.fdSapProvinceCode = (res[0] || {}).value;
      this.formData.fdSapProvince = (res[0] || {}).text;
      this.formData.fdSapCityCode = '';
      this.formData.fdSapCity = '';
      this.formData.fdSapCountyCode = '';
      this.formData.fdSapCounty = '';
      this.formData.fdSapTownsCode = '';
      this.formData.fdSapTowns = '';
    },
    //市
    handleChangeCity(res) {
      this.formData.fdSapCityCode = (res[0] || {}).value;
      this.formData.fdSapCity = (res[0] || {}).text;
      this.formData.fdSapCountyCode = '';
      this.formData.fdSapCounty = '';
      this.formData.fdSapTownsCode = '';
      this.formData.fdSapTowns = '';
    },
    //县
    handleChangeCounty(res) {
      this.formData.fdSapCountyCode = (res[0] || {}).value;
      this.formData.fdSapCounty = (res[0] || {}).text;
      this.formData.fdSapTownsCode = '';
      this.formData.fdSapTowns = '';
    },
    //乡镇
    handleChangeStreet(res) {
      this.formData.fdSapTownsCode = (res[0] || {}).value;
      this.formData.fdSapTowns = (res[0] || {}).text;
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
