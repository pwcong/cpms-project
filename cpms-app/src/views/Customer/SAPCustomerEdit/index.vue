<template>
  <list-layout class="page-customer-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        :title="`${isEdit ? '编辑' : '新建'}客户`"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(true)"
        :right-text="!isEdit || formData.fdSapStatus === 'draft' ? '暂存' : undefined"
        @click-right="onSubmit('draft')"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 90px)">
        <div class="warm-prompt">
          <span style="color: #ff0000">温馨提示</span>: 客户归类越详细，越方便后期查找和统计
        </div>
        <van-form ref="form" @submit="onSubmit(isEdit ? 'edit' : 'add')">
          <block theme="primary" style="color: #333333" title="基本信息">
            <template v-slot:title>
              <div>
                <span style="color: #333333">基本信息</span>
              </div>
            </template>
            <van-field
              v-model="formData.fdReqUser"
              name="fdReqUser"
              label="申请人"
              placeholder="请输入"
              readonly
              required
              :rules="[{ required: true, message: '请输入申请人' }]"
            />
            <van-field v-model="formData.fdReqDept" name="fdReqDept" label="部门" placeholder="请输入" readonly />
            <van-field
              readonly
              required
              clickable
              is-link
              :value="formData.fdMaintainType"
              name="fdMaintainType"
              label="维护类型"
              placeholder="请选择"
              @click="showMaintainType = true"
              :rules="[{ required: true, message: '请选择维护类型' }]"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdMaintainType || '').split(',')"
                  dictCode="cpms_sap_maintain_type"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field
              v-model="formData.fdCreateTime"
              name="fdCreateTime"
              label="创建日期"
              placeholder="请输入"
              readonly
            />
          </block>
          <block theme="primary" title="客户详情">
            <template v-slot:title>
              <div>
                <span style="color: #333333">客户详情</span>
              </div>
            </template>
            <template v-slot:action>
              <div v-if="!!formData.fdSapCustName && !!formData.fdEnterpriseId">
                <span @click="checkSkyeyeDetails" class="checkSkyeye"> 查看天眼查客户详情 </span>
              </div>
            </template>

            <van-field
              readonly
              is-link
              clickable
              name="fdSapCustName"
              v-model="formData.fdSapCustName"
              label="客户名称"
              placeholder="请选择"
              required
              :rules="[{ required: true, message: '请输入客户名称' }]"
              @click="handleSelectCustomer"
            />
            <van-field
              v-model="formData.fdSapUnifiedCode"
              name="fdSapUnifiedCode"
              label="统一信用编码"
              placeholder="请输入"
              readonly
            />
            <van-field v-model="formData.fdSapCustName2" name="fdSapCustName2" label="客户名称2" placeholder="请输入" />
            <van-field v-model="formData.fdSapShortName" name="fdSapShortName" label="客户简称" placeholder="请输入" />
            <van-field
              readonly
              required
              clickable
              is-link
              :value="formData.fdSapAccountGroup"
              name="fdSapAccountGroup"
              label="客户账户组"
              placeholder="请选择"
              @click="showCustomerAccountGroup = true"
              :rules="[{ required: true, message: '请选择客户账户组' }]"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdSapAccountGroup || '').split(',')"
                  dictCode="cpms_sap_account_group"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field
              readonly
              required
              clickable
              :is-link="!id && formData.fdSapStatus !== 'reject'"
              :value="formData.fdSapCountry"
              name="fdSapCountry"
              label="国家"
              placeholder="请选择"
              @click="handleSelectCountry"
              :rules="[{ required: true, message: '请选择国家' }]"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdSapCountry || '').split(',')"
                  dictCode="cpms_country"
                  systemCode="cpms"
                />
              </template>
            </van-field>

            <van-field
              :rules="[{ required: true, message: '请选择省信息' }]"
              :value="formData.fdSapProvince"
              clickable
              is-link
              label="省"
              placeholder="请选择省"
              readonly
              required
              @click="handleSelectProvince"
            >
              <template #input>
                {{ formData.fdSapProvince }}
              </template>
            </van-field>

            <van-field
              :rules="[{ required: true, message: '请选择市' }]"
              :value="formData.fdSapCity"
              clickable
              is-link
              label="市"
              placeholder="请选择市"
              readonly
              required
              @click="handleSelectCity"
            >
              <template #input>
                {{ formData.fdSapCity }}
              </template>
            </van-field>

            <van-field
              :rules="[{ required: true, message: '请选择县' }]"
              :value="formData.fdSapCounty"
              clickable
              is-link
              label="县"
              placeholder="请选择县"
              readonly
              required
              @click="handleSelectCounty"
            >
              <template #input>
                {{ formData.fdSapCounty }}
              </template>
            </van-field>

            <van-field
              :value="formData.fdSapTowns"
              clickable
              is-link
              label="乡镇"
              placeholder="请选择县"
              readonly
              @click="handleSelectTowns"
            >
              <template #input>
                {{ formData.fdSapTowns }}
              </template>
            </van-field>

            <van-field
              v-model="formData.fdSapAddress"
              :readonly="!!id && formData.fdSapStatus === 'reject'"
              name="fdSapAddress"
              label="详细地址"
              placeholder="请输入"
            />
            <van-field
              v-model="formData.fdSapContact"
              :readonly="!!id && formData.fdSapStatus === 'reject'"
              name="fdSapContact"
              label="联系人"
              placeholder="请输入"
            />
            <van-field
              v-model="formData.fdSapMobile"
              :readonly="!!id && formData.fdSapStatus === 'reject'"
              name="fdSapMobile"
              label="手机号码"
              placeholder="请输入"
            />
            <van-field
              v-model="formData.fdSapPhone"
              :readonly="!!id && formData.fdSapStatus === 'reject'"
              name="fdSapPhone"
              label="固话"
              placeholder="请输入"
            />
            <van-field v-model="formData.fdSapMail" name="fdSapMail" label="客户邮箱" placeholder="请输入" />

            <van-field
              readonly
              clickable
              is-link
              :value="formData.fdShopLevel"
              name="fdShopLevel"
              label="CRM门店市场级别"
              placeholder="请选择"
              @click="showShopLevel = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdShopLevelCode || '').split(',')"
                  dictCode="cpms_shop_level"
                  systemCode="cpms"
                />
              </template>
            </van-field>

            <van-field
              readonly
              clickable
              is-link
              :value="formData.fdShopType"
              name="fdShopType"
              label="CRM门店分级"
              placeholder="请选择"
              @click="showShopType = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdShopType || '').split(',')"
                  dictCode="cpms_shop_type"
                  systemCode="cpms"
                />
              </template>
            </van-field>

            <van-field
              readonly
              clickable
              is-link
              :value="formData.fdAgent"
              name="fdAgent"
              label="是否代理商"
              placeholder="请选择"
              @click="showIsAgent = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdAgent || '').split(',')"
                  dictCode="cpms_agent"
                  systemCode="cpms"
                />
              </template>
            </van-field>

            <van-field
              :value="(formData.sysAttContractAspectParams || []).map((d) => d.value).join(',')"
              name="sysAttContractAspectParams"
              label="附件"
              readonly
            >
              <uploader
                mode="file"
                slot="input"
                multiple
                :value="formData.sysAttContractAspectParams"
                @input="formData.sysAttContractAspectParams = $event"
              />
            </van-field>
          </block>
          <skyeye-detail
            :fdEnterpriseId="formData.fdEnterpriseId"
            :customerId="id"
            :version="formData.version"
            :visible.sync="skyeyeVisible"
          />

          <company-list :moduleId="id" :status="formData.fdSapStatus" v-model="formData" @change="handCompanyCode" />

          <sales-list :moduleId="id" :status="formData.fdSapStatus" v-model="formData" @change="handSalesView" />

          <bank-list :moduleId="id" :status="formData.fdSapStatus" v-model="formData" @change="handBankAccount" />
        </van-form>
      </div>
    </template>

    <template v-slot:footer="{ className }">
      <div :class="className">
        <van-button :loading="loading" block type="danger" @click="handleSubmit"> 提交 </van-button>
      </div>
    </template>

    <selection-sap-customer
      :visible.sync="showCustName"
      moduleFlag="cpms_cust_main"
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
      placeholder="请选择"
      allow-clear
      searchable
      @change="handleCust"
    />

    <selection-dict
      searchable
      :value="!!formData.fdMaintainType ? [{ value: formData.fdMaintainType }] : []"
      :visible.sync="showMaintainType"
      dictCode="cpms_sap_maintain_type"
      systemCode="cpms"
      title="选择维护类型"
      placeholder="请选择"
      @change="formData.fdMaintainType = ($event[0] || {}).value"
    />

    <selection-dict
      searchable
      :value="!!formData.fdSapAccountGroupCode ? [{ value: formData.fdSapAccountGroupCode }] : []"
      :visible.sync="showCustomerAccountGroup"
      dictCode="cpms_sap_account_group"
      systemCode="cpms"
      title="选择客户账户组"
      placeholder="请选择"
      @change="
        (formData.fdSapAccountGroupCode = ($event[0] || {}).value) &&
          (formData.fdSapAccountGroup = ($event[0] || {}).text)
      "
    />

    <selection-dict
      searchable
      :value="!!formData.fdSapCountry ? [{ text: formData.fdSapCountry, value: formData.fdSapCountryCode }] : []"
      :visible.sync="showCountry"
      dictCode="cpms_country"
      systemCode="cpms"
      title="选择国家"
      placeholder="请选择"
      @change="
        (formData.fdSapCountryCode = ($event[0] || {}).value) && (formData.fdSapCountry = ($event[0] || {}).text)
      "
    />

    <selection-province
      searchable
      :visible.sync="showProvince"
      :value="!!formData.fdSapProvinceCode ? [{ text: formData.fdSapProvince, value: formData.fdSapProvinceCode }] : []"
      title="选择省份"
      placeholder="请选择"
      @change="handleChangeProvince"
    />

    <selection-city
      searchable
      :provinceCode="formData.fdSapProvinceCode"
      :value="!!formData.fdSapCityCode ? [{ text: formData.fdSapCity, value: formData.fdSapCityCode }] : []"
      :visible.sync="showCity"
      title="选择城市"
      placeholder="请选择"
      @change="handleChangeCity"
    />

    <selection-county
      searchable
      :cityCode="formData.fdSapCityCode"
      :value="!!formData.fdSapCountyCode ? [{ text: formData.fdSapCounty, value: formData.fdSapCountyCode }] : []"
      :visible.sync="showCounty"
      title="选择县"
      placeholder="请选择"
      @change="handleChangeCounty"
    />

    <selection-township
      searchable
      :countyCode="formData.fdSapCountyCode"
      :value="!!formData.fdSapTownsCode ? [{ text: formData.fdSapTowns, value: formData.fdSapTownsCode }] : []"
      :visible.sync="showTowns"
      title="选择乡镇"
      placeholder="请选择"
      @change="handleChangeStreet"
    />

    <selection-dict
      searchable
      :value="!!formData.fdShopLevelCode ? [{ text: formData.fdShopLevel, value: formData.fdShopLevelCode }] : []"
      :visible.sync="showShopLevel"
      dictCode="cpms_shop_level"
      systemCode="cpms"
      title="选择CRM门店市场级别"
      placeholder="请选择"
      @change="
        ((formData.fdShopLevelCode = ($event[0] || {}).value) || true) &&
          (formData.fdShopLevel = ($event[0] || {}).text)
      "
    />

    <selection-dict
      searchable
      :value="!!formData.fdShopType ? [{ text: formData.fdShopType, value: formData.fdShopTypeCode }] : []"
      :visible.sync="showShopType"
      dictCode="cpms_shop_type"
      systemCode="cpms"
      title="CRM门店分级"
      placeholder="请选择"
      @change="
        ((formData.fdShopTypeCode = ($event[0] || {}).value) || true) && (formData.fdShopType = ($event[0] || {}).text)
      "
    />

    <selection-dict
      searchable
      :value="!!formData.fdAgent ? [{ value: formData.fdAgent }] : []"
      :visible.sync="showIsAgent"
      dictCode="cpms_agent"
      systemCode="cpms"
      title="CRM门店分级"
      placeholder="请选择"
      @change="formData.fdAgent = ($event[0] || {}).value"
    />
  </list-layout>
</template>

<script>
import api from '@/api';
import formMixin from './form';
import { userMixin } from '@/mixins';

import SelectionSapCustomer from '../components/selection/sap-customer';
import SelectionProvince from '../components/selection/sap-province';
import SelectionCity from '../components/selection/sap-city';
import SelectionCounty from '../components/selection/sap-county';
import SelectionTownship from '../components/selection/sap-township';
import SkyeyeDetail from '../InterdCustomerEdit/skyeye-detail';
import CompanyList from './company-list';
import SalesList from './sales-list';
import BankList from './bank-list';

export default {
  mixins: [userMixin, formMixin],
  components: {
    SelectionSapCustomer,
    SelectionProvince,
    SelectionCity,
    SelectionCounty,
    SelectionTownship,
    SkyeyeDetail,
    CompanyList,
    SalesList,
    BankList,
  },
  data() {
    const { id } = this.$route.params;
    const { fdCustMainId, fdEnterpriseId } = this.$route.query;
    return {
      id,
      showCustName: false,
      showMaintainType: false,
      showCustomerAccountGroup: false,
      showCountry: false,
      showShopLevel: false,
      showShopType: false,
      showIsAgent: false,
      showProvince: false,
      showCity: false,
      showCounty: false,
      showTowns: false,
      fdCustMainId,
      fdEnterpriseId,
      customerIdentification: 'cust',
      skyeyeVisible: false,
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
    handleSelectCustomer() {
      if (!!this.checkSapStatus()) {
        !this.checkSapStatus();
        return;
      }
      this.showCustName = true;
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
    //省
    handleChangeProvince(res) {
      console.log(res);
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
      console.log(res);
      this.formData.fdSapCityCode = (res[0] || {}).value;
      this.formData.fdSapCity = (res[0] || {}).text;
      this.formData.fdSapCountyCode = '';
      this.formData.fdSapCounty = '';
      this.formData.fdSapTownsCode = '';
      this.formData.fdSapTowns = '';
    },
    //县
    handleChangeCounty(res) {
      console.log(res);
      this.formData.fdSapCountyCode = (res[0] || {}).value;
      this.formData.fdSapCounty = (res[0] || {}).text;
      this.formData.fdSapTownsCode = '';
      this.formData.fdSapTowns = '';
    },
    //乡镇
    handleChangeStreet(res) {
      console.log(res);
      this.formData.fdSapTownsCode = (res[0] || {}).value;
      this.formData.fdSapTowns = (res[0] || {}).text;
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
        let addressDtoList = (data.addressDtoList || []).filter((item) => item.fdIsValid == 1); //意向客户中 有效的办公地址列表
        let contactDtoList = (data.contactDtoList || []).filter((item) => item.fdIsValid == 1); //意向客户中 有效的客户联系人列表

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
    handleSelectCountry() {
      if (!!this.checkSapStatus()) {
        return;
      }
      this.showCountry = true;
    },
    handleSelectProvince() {
      if (!!this.checkSapStatus()) {
        return;
      }
      this.showProvince = true;
    },
    onBeforeSelectCity() {
      if (!this.formData.fdProvinceCode) {
        this.$toast.fail('请先选择省');
        return;
      }
      this.showCity = true;
    },
    handleSelectCity() {
      if (!!this.checkSapStatus()) {
        return;
      }
      this.showCity = true;
    },
    handleSelectCounty() {
      if (!!this.checkSapStatus()) {
        return;
      }
      this.showCounty = true;
    },
    handleSelectTowns() {
      if (!!this.checkSapStatus()) {
        return;
      }
      this.showTowns = true;
    },
    checkSapStatus() {
      if (!!this.id && this.formData.fdSapStatus === 'reject') {
        this.$toast.fail('驳回状态禁止修改');
        return true;
      }
    },
    handleSubmit() {
      this.$refs.form.submit();
    },
    checkSkyeyeDetails() {
      this.skyeyeVisible = true;
    },
    onSubmit(action) {
      if (action !== 'draft' && (!!this.loading || !!this.checkFormData(this.formData))) {
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
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
.page-customer-edit {
  .warm-prompt {
    font-size: 12px;
    text-align: center;
    background: #ffcc99;
    padding: 5px;
  }
  .checkSkyeye {
    font-size: 12px;
    color: $theme-color;
  }
}
</style>
