<template>
  <p-spin :spinning="loading">
    <list-layout class="page-clue-edit" style="padding-bottom: 16px">
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
              <p-breadcrumb-item>线索管理</p-breadcrumb-item>
              <p-breadcrumb-item> 线索{{ isEdit ? '编辑' : '新建' }} </p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleSubmit(true)"
              :loading="loading"
              v-if="!isEdit || formData.fdClueStatus === 'draft'"
            >
              暂存
            </p-button>
            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleSubmit()"
              :loading="loading"
            >
              {{ formData.fdClueStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
            </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel()"> 取消 </p-button>
          </template>
        </block>
        <block title="线索信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="24">
              <p-form-model-item label="线索名称" prop="fdClueName">
                <p-input
                  v-model="formData.fdClueName"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item label="线索描述" prop="fdClueDescription">
                <p-textarea
                  v-model="formData.fdClueDescription"
                  placeholder="请输入"
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="终端客户名称" prop="fdTerminalClient">
                <div
                  :style="{
                    'padding-right': formData.fdClientUnifiedCode ? '228px' : '108px',
                    position: 'relative',
                  }"
                >
                  <p-input
                    placeholder="请输入"
                    :maxLength="200"
                    v-model="formData.fdTerminalClient"
                  />
                  <div style="position: absolute; right: 0; top: 0">
                    <p-button-link
                      @click="
                        (selectTianyanchaVisible = true) && (tianyanchaFlag = 'terminal')
                      "
                    >
                      天眼查
                    </p-button-link>
                    <p-button-link
                      @click="
                        (cardRecogniteVisible = true) && (cardRecogniteFlag = 'terminal')
                      "
                    >
                      添加名片
                    </p-button-link>

                    <p-button-link
                      v-if="formData.fdClientUnifiedCode"
                      type="primary"
                      @click="checkSkyeyeDetail"
                      style="margin-left: 8px; font-size: 12px"
                    >
                      查看天眼查客户详情
                    </p-button-link>
                  </div>
                </div>
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="线索来源" prop="fdClueSource">
                <select-dict
                  allow-clear
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_clue_source"
                  :value="
                    !!formData.fdClueSource ? [{ value: formData.fdClueSource }] : []
                  "
                  @change="handleClueSource"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="线索联系人" prop="fdClueContactName">
                <p-input
                  placeholder="请输入"
                  :maxLength="200"
                  v-model="formData.fdClueContactName"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="联系方式" prop="fdClueContactMobile">
                <p-input
                  placeholder="请输入"
                  :maxLength="200"
                  v-model="formData.fdClueContactMobile"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="所属区域" prop="fdCityCode">
                <div style="display: flex">
                  <select-province
                    style="flex: 1"
                    placeholder="请选择省"
                    allow-clear
                    :value="
                      !!formData.fdProvinceCode
                        ? [
                            {
                              value: formData.fdProvinceCode,
                              text: formData.fdProvinceName,
                            },
                          ]
                        : []
                    "
                    @change="handleProvince"
                  />
                  <select-city
                    style="flex: 1; margin-left: 4px"
                    :province-code="formData.fdProvinceCode"
                    placeholder="请选择市"
                    allow-clear
                    :value="
                      !!formData.fdCityCode
                        ? [
                            {
                              value: formData.fdCityCode,
                              text: formData.fdCityName,
                            },
                          ]
                        : []
                    "
                    @change="handleCity"
                  />
                </div>
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="产品线" prop="productLineList">
                <select-product-line
                  :value="
                    formData.productLineList.map((d) => ({
                      text: d.fdProductLineName,
                      value: d.fdProductLineCode,
                    }))
                  "
                  @change="
                    formData.productLineList = $event.map((d) => ({
                      fdProductLineName: d.text,
                      fdProductLineCode: d.value,
                    }))
                  "
                  placeholder="请选择"
                  multiple
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="线索类型" prop="fdClueType">
                <select-dict
                  placeholder="请选择"
                  allow-clear
                  systemCode="cpms"
                  dictCode="cpms_clue_type"
                  :value="
                    !!formData.fdClueType
                      ? [
                          {
                            text: formData.fdClueTypeName,
                            value: formData.fdClueType,
                          },
                        ]
                      : []
                  "
                  @change="hanldledClueType"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="所属机构" prop="fdAgencyCode">
                <select-agency
                  placeholder="请选择"
                  allow-clear
                  :value="
                    !!formData.fdAgencyCode
                      ? [
                          {
                            text: formData.fdAgencyName,
                            value: formData.fdAgencyCode,
                          },
                        ]
                      : []
                  "
                  @change="handleAgencyCode"
                />
              </p-form-model-item>
            </p-col>

            <!-- <p-col :span="12">
            <p-form-model-item label="线索标签">
              <p-input placeholder="请输入" />
            </p-form-model-item>
          </p-col> -->

            <p-col :span="8">
              <p-form-model-item label="代理商名称" prop="fdCustName">
                <div style="padding-right: 108px; position: relative">
                  <p-input
                    placeholder="请选择"
                    :maxLength="200"
                    v-model="formData.fdCustName"
                  />
                  <div style="position: absolute; right: 0; top: 0">
                    <p-button-link
                      @click="
                        (selectTianyanchaVisible = true) && (tianyanchaFlag = 'cust')
                      "
                    >
                      天眼查
                    </p-button-link>
                    <p-button-link
                      @click="
                        (cardRecogniteVisible = true) && (cardRecogniteFlag = 'cust')
                      "
                    >
                      添加名片
                    </p-button-link>
                  </div>
                </div>
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="跟进人" prop="fdLoginName">
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
                  placeholder="请选择"
                  @confirm="handleSelectUser"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="招标编号 " prop="fdBiddingNumber">
                <p-input
                  v-model="formData.fdBiddingNumber"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
          <p-row :gutter="24">
            <p-col :span="12">
              <p-form-model-item
                label="可见范围-人员"
                prop="sysDatascopePersonAspectParams"
              >
                <p-select-user
                  @confirm="
                    formData.sysDatascopePersonAspectParams = $event.map((d) => ({
                      fdPersonId: d.uid,
                      fdPersonName: d.name,
                    }))
                  "
                  :selectData="
                    formData.sysDatascopePersonAspectParams.map((d) => ({
                      uid: d.fdPersonId,
                      name: d.fdPersonName,
                    }))
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="12">
              <p-form-model-item
                label="可见范围-部门"
                prop="sysDatascopeDeptAspectParams"
              >
                <p-select-org
                  orgType="1"
                  @confirm="
                    formData.sysDatascopeDeptAspectParams = $event.map((d) => ({
                      fdDeptId: d.code,
                      fdDeptName: d.name,
                    }))
                  "
                  :selectData="
                    formData.sysDatascopeDeptAspectParams.map((d) => ({
                      code: d.fdDeptId,
                      name: d.fdDeptName,
                    }))
                  "
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="24">
              <p-form-model-item label="备注" prop="fdOtherRemark">
                <p-textarea
                  v-model="formData.fdOtherRemark"
                  :maxLength="500"
                  placeholder="请输入"
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <block title="客户详情" style="margin-top: 16px" theme="primary">
          <template v-slot:title>
            <div>
              <span>客户详情</span>
            </div>
          </template>
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="所属行业" prop="fdCustIndustry">
                <select-dict
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_business"
                  allow-clear
                  :value="
                    !!formData.fdCustIndustry ? [{ value: formData.fdCustIndustry }] : []
                  "
                  @change="handleCustIndustry"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="公司类型" prop="fdCompanyType">
                <p-input
                  v-model="formData.fdCompanyType"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="电话" prop="fdCustContactPhone">
                <p-input
                  v-model="formData.fdCustContactPhone"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="手机" prop="fdCustContactMobile">
                <p-input
                  v-model="formData.fdCustContactMobile"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="16">
              <p-form-model-item label="网址" prop="fdCompanyWeb">
                <p-input
                  v-model="formData.fdCompanyWeb"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="成立时间" prop="fdCompanyRegtime">
                <p-date-picker
                  v-model="formData.fdCompanyRegtime"
                  show-time
                  valueFormat="YYYY-MM-DD HH:mm:ss"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="公司总人数" prop="fdTotalCount">
                <p-input-number
                  style="width: 100%"
                  v-model="formData.fdTotalCount"
                  placeholder="请输入"
                  :min="0"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="年度销量" prop="fdSalesVolumeint">
                <select-dict
                  allow-clear
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_cust_sales_volumeint"
                  :value="
                    !!formData.fdSalesVolumeint
                      ? [
                          {
                            value: formData.fdSalesVolumeint,
                          },
                        ]
                      : []
                  "
                  @change="handleSalesVolumeint"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="年度采购额" prop="fdPurchaseAmount">
                <select-dict
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_cust_purchase_amount"
                  :value="
                    !!formData.fdPurchaseAmount
                      ? [
                          {
                            value: formData.fdPurchaseAmount,
                          },
                        ]
                      : []
                  "
                  @change="handlefdPurchaseAmount"
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="旗下品牌" prop="fdBrand">
                <p-input
                  v-model="formData.fdBrand"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="关键部门" prop="fdKeyDept">
                <p-input
                  v-model="formData.fdKeyDept"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="注册资本" prop="fdRegCapital ">
                <p-input
                  v-model="formData.fdRegCapital"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="企业状态 " prop="fdRegStatus">
                <p-input
                  v-model="formData.fdRegStatus"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="24">
              <p-form-model-item label="用户群体" prop="fdUserCommunity">
                <p-textarea
                  v-model="formData.fdUserCommunity"
                  placeholder="请输入"
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>

        <!--其他联系人-->
        <contact-list style="margin-top: 16px" :moduleId="id" v-model="formData" />

        <!-- 客户办公地址 -->
        <address-list
          style="margin-top: 16px"
          :moduleId="id"
          v-model="formData"
          @change="handAddressList"
        />

        <block style="text-align: center; margin-top: 32px">
          <p-button
            type="primary"
            style="width: 150px"
            @click="handleSubmit()"
            :loading="loading"
          >
            {{ formData.fdProjectStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
          </p-button>
        </block>
      </p-form-model>

      <!-- 天眼查 -->
      <selection-tianyancha
        :visible.sync="selectTianyanchaVisible"
        :keyword="
          tianyanchaFlag === 'terminal' ? formData.fdTerminalClient : formData.fdCustName
        "
        @change="handleSelectTianyancha"
      />

      <!-- 已有客户 -->
      <!-- <selection-customer
      status="pass"
      :visible.sync="selectCustomerVisible"
      @change="handleSelectCustomers"
    /> -->

      <!-- 名片识别 -->
      <card-recognite :visible.sync="cardRecogniteVisible" @change="handleSelectCard" />
    </list-layout>
  </p-spin>
</template>

<script>
import dayjs from 'dayjs';
import api from '@/api';

import AddressList from '../ClueEdit/address-list';
import formMixin from './form';
import ContactList from './contact-list.vue';

import SelectProvince from '@/views/components/select/province';
import SelectCity from '@/views/components/select/city';
import SelectProductLine from '@/views/components/select/product-line';
import SelectionTianyancha from '@/views/components/selection-tianyancha';
import SelectionCustomer from '@/views/components/selection-customer';
import CardRecognite from '../components/card-recognite';
import SelectAgency from '@/views/components/select/agency';
export default {
  name: '线索编辑',
  mixins: [formMixin],
  components: {
    AddressList,
    ContactList,
    SelectProvince,
    SelectCity,
    SelectProductLine,
    SelectionTianyancha,
    SelectionCustomer,
    CardRecognite,
    SelectAgency,
  },
  data() {
    const { id } = this.$route.params;

    return {
      id,
      selectTianyanchaVisible: false,
      tianyanchaFlag: 'terminal',
      selectCustomerVisible: false,
      cardRecogniteVisible: false,
      cardRecogniteFlag: 'terminal',
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
    //天眼查
    async handleSelectTianyancha(value) {
      value = value[0];
      if (!value) {
        return;
      }

      const data = await api.customer.getCustomerTianyanchaInfo((value || []).id);
      if (this.tianyanchaFlag === 'terminal') {
        this.formData = {
          ...this.formData,
          fdTerminalClient: data.data.fdName,
          fdClientId: data.data.fdCustId,
          fdClientUnifiedCode: data.data.fdCreditCode, //企业征信代码
          fdCustIndustry: '',
          fdEnterpriseId: data.data.fdEnterpriseId,
          fdCompanyType: data.data.fdCompanyOrgType, //企业类型 公司类型
          fdCompanyRegassets: data.data.fdRegCapital, //注册资金
          fdCustStatus: data.data.fdRegStatus, //经营状态
          fdTotalCount: data.data.fdStaffNumRange, //人员规模  公司总人数
          fdRegStatus: data.data.fdRegStatus, //企业状态
          fdRegCapital: data.data.fdRegCapital, //注册资本
          fdCompanyRegtime: data.data.fdEstiblishTime
            ? dayjs(new Date(data.data.fdEstiblishTime)).format('YYYY-MM-DD')
            : data.data.fdEstiblishTime, //成立时间
        };
      } else {
        this.formData = {
          ...this.formData,
          fdCustName: data.data.fdName,
          fdCustMainId: data.data.fdCustId,
          fdCustUnifiedCode: data.data.fdCreditCode,
        };
      }
    },

    handleSelectCard(res) {
      this.handleSelectTianyancha(res.value);
    },

    // 线索来源
    handleClueSource(value) {
      this.formData.fdClueSource = (value[0] || {}).value;
    },

    // 线索类型
    hanldledClueType(value) {
      this.formData.fdClueType = (value[0] || {}).value;
      this.formData.fdClueTypeName = (value[0] || {}).text;
    },
    // 所属机构
    handleAgencyCode(value) {
      this.formData.fdAgencyCode = (value[0] || {}).value;
      this.formData.fdAgencyName = (value[0] || {}).text;
    },
    // 省
    handleProvince(value) {
      this.formData.fdProvinceCode = (value[0] || {}).value;
      this.formData.fdProvinceName = (value[0] || {}).text;
      this.formData.fdCityCode = '';
      this.formData.fdCityName = '';
    },
    // 市
    handleCity(value) {
      this.formData.fdCityCode = (value[0] || {}).value;
      this.formData.fdCityName = (value[0] || {}).text;
    },
    // 所属行业
    handleCustIndustry(value) {
      this.formData.fdCustIndustry = (value[0] || {}).value;
    },
    // 跟进人
    handleSelectUser(value) {
      this.formData.fdLoginName = (value[0] || {}).uid;
      this.formData.fdUserName = (value[0] || {}).name;
    },
    //年度销量
    handleSalesVolumeint(value) {
      this.formData.fdSalesVolumeint = (value[0] || {}).value;
    },
    //年度采购
    handlefdPurchaseAmount(value) {
      this.formData.fdPurchaseAmount = (value[0] || {}).value;
    },
    // 暂存和保存
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
        this.$refs.form.validate((valid) => {
          if (!valid) {
            this.$message.error('表单字段校验未通过');
            return;
          }

          if (!this.checkFormData(this.formData)) {
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
    checkSkyeyeDetail() {
      this.$router.push({
        path: `/Customer/TianyanchaDetail`,
        query: {
          id: this.formData.fdEnterpriseId,
          // creditcode
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
