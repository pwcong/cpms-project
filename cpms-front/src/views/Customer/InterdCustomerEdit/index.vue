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
              <p-breadcrumb-item> 客户{{ isEdit ? '编辑' : '新建' }} </p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              type="primary"
              @click="handleSubmit(true)"
              :loading="loading"
              v-if="!isEdit || formData.fdStatus === 'draft'"
            >
              暂存
            </p-button>
            <oasubmit-wrapper
              moduleFlag="cpms_cust_main"
              :moduleId="id"
              style="margin: 0px 8px"
              :beforeSubmit="handleBeforeSubmit"
              :status="formData.fdStatus"
              @submit="handleSubmit(false, $event)"
            >
              <p-button type="primary" :loading="loading">
                {{
                  formData.fdStatus === 'draft' || formData.fdStatus === 'reject'
                    ? '提交'
                    : isEdit
                    ? '保存'
                    : '提交'
                }}
              </p-button>
            </oasubmit-wrapper>
            <p-button @click="handleCancel"> 取消 </p-button>
          </template>
        </block>
        <block style="margin-top: 16px" theme="primary">
          <template v-slot:title>
            <div>
              <span>客户详情</span>
              <p-button-link
                type="primary"
                @click="handleToTianyancha"
                v-if="!!formData.fdCustName && !!formData.fdEnterpriseId"
                style="margin-left: 8px; font-size: 12px"
              >
                查看天眼查客户详情
              </p-button-link>
            </div>
          </template>
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="客户名称" prop="fdCustName">
                <p-input
                  :placeholder="
                    !id || formData.fdStatus === 'draft' ? '请选择' : undefined
                  "
                  v-model="formData.fdCustName"
                  readOnly
                  style="flex: 1"
                  @click="
                    (!id || formData.fdStatus === 'draft') &&
                      (selectTianyanchaVisible = true)
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="统一社会信用代码" prop="fdUnifiedCode">
                <p-input v-model="formData.fdUnifiedCode" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="客户类型" prop="fdCustType">
                <select-dict
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_cust_type"
                  :value="!!formData.fdCustType ? [{ value: formData.fdCustType }] : []"
                  @change="handleChangeCustType"
                  allow-clear
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="所属行业" prop="fdCustIndustry">
                <select-dict
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_business"
                  :value="
                    !!formData.fdCustIndustry ? [{ value: formData.fdCustIndustry }] : []
                  "
                  @change="formData.fdCustIndustry = ($event[0] || {}).value"
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="公司类型" prop="fdCompanyType">
                <p-input v-model="formData.fdCompanyType" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="注册资金" prop="fdCompanyRegassets">
                <p-input v-model="formData.fdCompanyRegassets" readOnly />
              </p-form-model-item>
            </p-col>
          </p-row>
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="经营状态" prop="fdCustManageforms">
                <p-input v-model="formData.fdCustManageforms" readOnly />
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
                  @change="formData.fdPurchaseAmount = ($event[0] || {}).value"
                  allow-clear
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="年度销量" prop="fdSalesVolumeint">
                <select-dict
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
                  @change="formData.fdSalesVolumeint = ($event[0] || {}).value"
                  allow-clear
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="公司总人数" prop="fdTotalCount">
                <p-input v-model="formData.fdTotalCount" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="成立时间" prop="fdCompanyRegtime">
                <p-input v-model="formData.fdCompanyRegtime" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="注册地址" prop="fdRegLocation">
                <p-input v-model="formData.fdRegLocation" readOnly />
              </p-form-model-item>
            </p-col>

            <!-- <p-col :span="8">
            <p-form-model-item label="国家" prop="fdCountry">
              <p-select
                allowClear
                placeholder="请选择"
                v-model="formData.fdCountry"
                @change="handleChange"
              >
                <p-select-option value="中国">
                  中国
                </p-select-option>
                <p-select-option value="国外">
                  国外
                </p-select-option>
              </p-select>
            </p-form-model-item>
          </p-col> -->
            <p-col :span="8">
              <p-form-model-item label="注册省份" prop="fdProvince">
                <select-province
                  v-if="formData.fdIsDiscern === '0'"
                  style="flex: 1"
                  placeholder="请选择"
                  :value="
                    !!formData.fdProvince
                      ? [
                          {
                            text: formData.fdProvince,
                            value: formData.fdProvinceCode,
                          },
                        ]
                      : []
                  "
                  allow-clear
                  @change="handleChangeProvince"
                />
                <p-input v-else v-model="formData.fdProvince" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="注册城市" prop="fdCity">
                <select-city
                  v-if="formData.fdIsDiscern === '0'"
                  style="flex: 1; margin-left: 4px"
                  :province-code="formData.fdProvinceCode"
                  placeholder="请选择"
                  :value="
                    !!formData.fdCity
                      ? [{ text: formData.fdCity, value: formData.fdCityCode }]
                      : []
                  "
                  @change="handleChangeCity"
                  allow-clear
                />
                <p-input v-else v-model="formData.fdCity" readOnly />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="客户来源" prop="fdCustSource">
                <select-dict
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_clue_source"
                  :value="
                    !!formData.fdCustSource
                      ? [
                          {
                            value: formData.fdCustSource,
                          },
                        ]
                      : []
                  "
                  @change="formData.fdCustSource = ($event[0] || {}).value"
                  allow-clear
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="渠道信息" prop="fdChannel">
                <select-dict
                  placeholder="请选择"
                  systemCode="cpms"
                  dictCode="cpms_comtomer_channel"
                  multiple
                  allow-clear
                  :value="
                    (formData.fdChannel || '')
                      .split(';')
                      .filter((v) => !!v)
                      .map((v) => ({
                        value: v,
                      }))
                  "
                  @change="formData.fdChannel = $event.map((d) => d.value).join(';')"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item label="营业执照" prop="sysAttContractAspectParams">
                <uploader v-model="formData.sysAttContractAspectParams" multiple />
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item label="客户情况简介" prop="fdCustProfile">
                <p-textarea
                  placeholder="请输入"
                  v-model="formData.fdCustProfile"
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                />
              </p-form-model-item>
            </p-col>

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
                  placeholder="请选择"
                  @confirm="handleSalesmanConfirm"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="关联代理商" prop="fdAgentName">
                <select-affiliated-agents
                  placeholder="请选择"
                  :id="id ? id : ''"
                  moduleFlag="cpms_cust_main"
                  :filterFlag="1"
                  allow-clear
                  :value="
                    !!formData.fdAgentId
                      ? [
                          {
                            value: formData.fdAgentId,
                            text: formData.fdAgentName,
                          },
                        ]
                      : []
                  "
                  @change="
                    ((formData.fdAgentId = ($event[0] || {}).value) || true) &&
                      (formData.fdAgentName = ($event[0] || {}).text)
                  "
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="共享人员" prop="sysDatascopePersonAspectParams">
                <p-select-user
                  placeholder="请选择"
                  :selectData="formData.sysDatascopePersonAspectParams"
                  @confirm="formData.sysDatascopePersonAspectParams = $event"
                />
              </p-form-model-item>
            </p-col>

            <p-col :span="8">
              <p-form-model-item label="共享部门（部门内所有人员可见）">
                <p-select-org
                  placeholder="请选择"
                  orgType="1"
                  :selectData="formData.sysDatascopeDeptAspectParams"
                  @confirm="formData.sysDatascopeDeptAspectParams = $event"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="是否代理商" prop="fdIsAgent">
                <p-input :value="formData.fdIsAgent === '1' ? '是' : '否'" readOnly />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <!-- 客户联系人 -->
        <contact-list
          style="margin-top: 16px"
          :moduleId="id"
          :status="formData.fdStatus"
          :contactList="formData.contactAddParamList"
          v-model="formData"
          @change="handContact"
        />
        <!-- 客户办公地址 -->
        <address-list
          style="margin-top: 16px"
          :moduleId="id"
          :status="formData.fdStatus"
          v-model="formData"
          @change="handAddressList"
        />
        <block style="text-align: center; margin-top: 32px">
          <oasubmit-wrapper
            moduleFlag="cpms_cust_main"
            :moduleId="id"
            :beforeSubmit="handleBeforeSubmit"
            :status="formData.fdStatus"
            @submit="handleSubmit(false, $event)"
          >
            <p-button type="primary" style="width: 150px" :loading="loading">
              {{ formData.fdStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
            </p-button>
          </oasubmit-wrapper>
        </block>
      </p-form-model>
      <selection-tianyancha
        :keyword="formData.fdCustName"
        :validate="tianyanchaValidator"
        :visible.sync="selectTianyanchaVisible"
        @change="handleSelectTianyancha"
      />
    </list-layout>
  </p-spin>
</template>

<script>
import api from '@/api';
import dayjs from 'dayjs';
import formMixin from './form';
import ContactList from './contact-list';
import AddressList from './address-list';
import SelectionTianyancha from '@/views/components/selection-tianyancha';
import SelectProvince from '@/views/components/select/province';
import SelectCity from '@/views/components/select/city';
import SelectYesOrNo from '@/views/components/select/yes-or-no';
import SelectAffiliatedAgents from '../components/select/affiliated-agents';

export default {
  name: '意向客户编辑',
  mixins: [formMixin],
  data() {
    const { id } = this.$route.params;
    const { source, targetId } = this.$route.query;
    return {
      selectTianyanchaVisible: false,
      visible: false,
      id,
      source,
      targetId,
      skeEyeId: '',
      customerIdentification: 'cust',
      selectAgentArr: [
        {
          value: 0,
          text: '否',
        },
        {
          value: 1,
          text: '是',
        },
      ],
      tianyanchaValidator: (value) =>
        new Promise(async (resolve) => {
          try {
            await api.customer.getCheckingRepeat(value[0].creditCode);
            resolve(true);
          } catch (e) {
            resolve(false);
          }
        }),
    };
  },
  components: {
    ContactList,
    AddressList,
    SelectionTianyancha,
    SelectProvince,
    SelectCity,
    SelectAffiliatedAgents,
    SelectYesOrNo,
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

    async handleSelectTianyancha(value) {
      try {
        const res = await api.customer.getCustomerTianyanchaInfo((value || [])[0].id);
        this.formData = {
          ...this.formData,
          fdCustName: res.data.fdName,
          fdUnifiedCode: res.data.fdCreditCode,
          fdEnterpriseId: res.data.fdEnterpriseId,
          fdCompanyType: res.data.fdCompanyOrgType,
          fdCompanyRegassets: res.data.fdRegCapital,
          fdCustManageforms: res.data.fdRegStatus,
          fdTotalCount: res.data.fdStaffNumRange,
          fdCompanyRegtime: res.data.fdEstiblishTime
            ? dayjs(new Date(res.data.fdEstiblishTime)).format('YYYY-MM-DD')
            : res.data.fdEstiblishTime,
          fdRegLocation: res.data.fdRegLocation,
        };
        const result = await api.customer.postAddressTranslation({
          cityName: res.data.fdCity,
        });

        if (result.cityName === null) {
          this.formData = {
            ...this.formData,
            fdIsDiscern: '0', //是否识别注册地址
            fdProvince: '',
            fdCity: '',
          };
        } else {
          this.formData = {
            ...this.formData,
            fdIsDiscern: '1',
            fdProvinceCode: result.provinceCode,
            fdProvince: result.provinceName,
            fdCityCode: result.cityCode,
            fdCity: result.cityName,
          };
        }
      } catch (e) {
      } finally {
      }
    },

    handleSalesmanConfirm(list) {
      this.formData.fdLoginName = (list[0] || []).uid;
      this.formData.fdUserName = (list[0] || []).name;
    },

    handleChangeCustType(res) {
      this.formData.fdCustType = (res[0] || {}).value;

      if (this.formData.fdCustType === 'agent') {
        this.formData.fdIsAgent = '1';
      } else {
        this.formData.fdIsAgent = '0';
      }
    },
    handleChangeProvince(res) {
      this.formData.fdProvinceCode = (res[0] || {}).value;
      this.formData.fdProvince = (res[0] || {}).text;
      this.formData.fdCityCode = '';
      this.formData.fdCity = '';
    },
    handleChangeCity(res) {
      this.formData.fdCityCode = (res[0] || {}).value;
      this.formData.fdCity = (res[0] || {}).text;
    },
  },
};
</script>
<style lang="scss" scoped></style>
