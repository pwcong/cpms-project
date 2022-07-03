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
              <p-breadcrumb-item>业务员管理</p-breadcrumb-item>
              <p-breadcrumb-item>拜访管理</p-breadcrumb-item>
              <p-breadcrumb-item>
                拜访计划{{ isEdit ? '编辑' : '新建' }}
              </p-breadcrumb-item>
            </p-breadcrumb>
          </template>
          <template v-slot:action>
            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleSubmit(true)"
              :loading="loading"
              v-if="!isEdit || formData.fdStatus === 'draft'"
            >
              暂存
            </p-button>
            <p-button
              style="margin-left: 8px"
              type="primary"
              @click="handleSubmit()"
              :loading="loading"
            >
              {{ formData.fdStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
            </p-button>
            <p-button style="margin-left: 8px" @click="handleCancel"> 取消 </p-button>
          </template>
        </block>
        <block title="基本信息" style="margin-top: 16px" theme="primary">
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="计划拜访日期" prop="fdVisitPlanWeek">
                <div style="display: flex">
                  <select-year
                    style="flex: 1"
                    :value="
                      !!formData.fdVisitPlanYear
                        ? [{ value: formData.fdVisitPlanYear }]
                        : []
                    "
                    placeholder="请选择年"
                    @change="handleChangeYear"
                  />
                  <select-week
                    style="flex: 1; margin-left: 8px"
                    :year="formData.fdVisitPlanYear"
                    :value="
                      !!formData.fdVisitPlanWeek
                        ? [{ value: formData.fdVisitPlanWeek }]
                        : []
                    "
                    placeholder="请选择周"
                    @change="handleChangeWeek"
                  />
                </div>
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="拜访类型" prop="fdVisitType">
                <select-dict
                  :value="
                    !!formData.fdVisitType
                      ? [
                          {
                            value: formData.fdVisitType,
                          },
                        ]
                      : []
                  "
                  dictCode="cpms_visit_type"
                  systemCode="cpms"
                  placeholder="请选择"
                  allow-clear
                  @change="handleChangeVisitType"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
          <p-row v-if="!!formData.fdVisitType" :gutter="24">
            <p-col :span="8" v-if="!!formData.fdVisitType">
              <p-form-model-item :label="`${moduleName}名称`" prop="fdModuleType">
                <select-project
                  status="todo,audit,follow,done"
                  placeholder="请选择"
                  v-if="formData.fdVisitType === 'project'"
                  :value="
                    !!formData.fdModuleTypeId
                      ? [
                          {
                            text: formData.fdModuleType,
                            value: formData.fdModuleTypeId,
                          },
                        ]
                      : []
                  "
                  @change="handleChangeModule"
                />
                <select-clue
                  queryType="followBy"
                  placeholder="请选择"
                  v-if="formData.fdVisitType === 'clue'"
                  :value="
                    !!formData.fdModuleTypeId
                      ? [
                          {
                            text: formData.fdModuleType,
                            value: formData.fdModuleTypeId,
                          },
                        ]
                      : []
                  "
                  @change="handleChangeModule"
                />
                <select-customer
                  placeholder="请选择"
                  status="todo,audit,pass"
                  v-if="formData.fdVisitType === 'cust'"
                  :value="
                    !!formData.fdModuleTypeId
                      ? [
                          {
                            text: formData.fdModuleType,
                            value: formData.fdModuleTypeId,
                          },
                        ]
                      : []
                  "
                  @change="handleChangeModule"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="拜访方式" prop="fdVisitWay">
                <select-dict
                  :value="
                    !!formData.fdVisitWay
                      ? [
                          {
                            value: formData.fdVisitWay,
                          },
                        ]
                      : []
                  "
                  dictCode="cpms_visit_way"
                  systemCode="cpms"
                  placeholder="请选择"
                  allow-clear
                  @change="handleChangeVisitWay"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8" v-if="!!formData.fdVisitWay && !!formData.fdModuleTypeId">
              <p-form-model-item label="拜访地址" prop="fdVisitAddress">
                <template v-if="formData.fdVisitWay === 'address'">
                  <div
                    :style="{
                      'padding-right': formData.fdVisitType === 'cust' ? '60px' : '0px',
                      position: 'relative',
                    }"
                  >
                    <p-select
                      :value="
                        !!formData.fdVisitAddressId
                          ? [
                              {
                                key: formData.fdVisitAddressId,
                                label: formData.fdVisitAddress,
                              },
                            ]
                          : []
                      "
                      @change="handleChangeAddress"
                      placeholder="请选择"
                      labelInValue
                    >
                      <p-select-option
                        v-for="item in address"
                        :key="item.value"
                        :value="item.value"
                      >
                        {{ item.text }}
                      </p-select-option>
                    </p-select>
                    <div
                      v-if="formData.fdVisitType === 'cust'"
                      style="position: absolute; right: 0; top: 0"
                    >
                      <p-button-link @click="showMap = true"> 新增地址 </p-button-link>
                    </div>
                  </div>
                </template>

                <template v-if="formData.fdVisitWay === 'customerVisit'">
                  <select-clock-in-address
                    :value="
                      !!formData.fdVisitAddressId
                        ? [
                            {
                              value: formData.fdVisitAddressId,
                              text: formData.fdVisitAddress,
                            },
                          ]
                        : []
                    "
                    placeholder="请选择"
                    @change="handleChangeAddress($event[0])"
                  />
                </template>
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <block
          v-if="!!formData.fdVisitType"
          title="拜访信息"
          style="margin-top: 16px"
          theme="primary"
        >
          <template v-slot:action>
            <p-button
              v-if="!!formData.fdModuleType"
              @click="visitorVisible = true"
              type="primary"
              style="margin-left: 8px"
              >选择拜访人
            </p-button>
          </template>
          <p-row style="margin-top: 16px" :gutter="24">
            <p-col :span="8">
              <p-form-model-item label="拜访人姓名" prop="fdVisitName">
                <p-input
                  v-model="formData.fdVisitName"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="拜访人电话" prop="fdVisitMobile">
                <p-input
                  v-model="formData.fdVisitMobile"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="8">
              <p-form-model-item label="拜访人职务">
                <p-input
                  v-model="formData.fdVisitJob"
                  placeholder="请输入"
                  :maxLength="200"
                />
              </p-form-model-item>
            </p-col>
            <p-col :span="24">
              <p-form-model-item label="拜访目的" prop="fdVisitPurpose">
                <p-textarea
                  :maxLength="500"
                  :autoSize="{
                    minRows: 4,
                  }"
                  v-model="formData.fdVisitPurpose"
                  placeholder="请输入"
                />
              </p-form-model-item>
            </p-col>
          </p-row>
        </block>
        <block style="text-align: center; margin-top: 32px">
          <p-button
            type="primary"
            style="width: 150px"
            @click="handleSubmit()"
            :loading="loading"
          >
            {{ formData.fdStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
          </p-button>
        </block>
      </p-form-model>
      <selection-visitor
        :fdVisitType="formData.fdVisitType"
        :fdModuleTypeId="formData.fdModuleTypeId"
        :visible.sync="visitorVisible"
        @change="handleChangeVisitor"
      />
      <selection-amap :visible.sync="showMap" @change="handleSelectAddress" />
    </list-layout>
  </p-spin>
</template>

<script>
import api from '@/api';
import formMixin from './form';
import { userMixin } from '@/mixins';
import SelectYear from '../../components/select/year';
import SelectWeek from '../../components/select/week';

import SelectProject from '@/views/components/select/project';
import SelectClue from '@/views/components/select/clue';
import SelectCustomer from '@/views/components/select/customer';
import SelectClockInAddress from '@/views/Salesman/components/select/clockin-address';
import SelectionVisitor from '@/views/Salesman/components/selection-visitor';

export default {
  name: '拜访计划编辑',
  mixins: [formMixin, userMixin],
  components: {
    SelectYear,
    SelectWeek,
    SelectProject,
    SelectClue,
    SelectCustomer,
    SelectClockInAddress,
    SelectionVisitor,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      address: [],
      clockAddress: [],
      visitorVisible: false,
      showMap: false,
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
    handleChangeYear(value) {
      this.formData.fdVisitPlanYear = value[0].value;
      this.formData.fdVisitPlanWeek = '';
    },
    handleChangeWeek(value) {
      this.formData.fdVisitPlanWeek = value[0].value;
    },
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

    handleChangeModule(res) {
      const value = res[0];
      this.formData.fdVisitName = '';
      this.formData.fdVisitMobile = '';
      this.formData.fdVisitJob = '';
      this.formData.fdVisitWay = '';
      this.formData.fdModuleType = value.text;
      this.formData.fdModuleTypeId = value.value;
      //访客来访方式不清空
      if (this.formData.fdVisitWay !== 'customerVisit') {
        this.formData.fdVisitAddress = '';
        this.formData.fdVisitAddressId = '';
      }
      this.loadAddress(value.value);
    },
    handleChangeAddress(value) {
      this.formData.fdVisitAddressId = value.key || value.value;
      this.formData.fdVisitAddress = value.label || value.text;
    },
    handleChangeVisitType(res) {
      this.formData.fdVisitType = (res[0] || {}).value;
      this.formData.fdModuleTypeId = '';
      this.formData.fdModuleType = '';
      this.formData.fdVisitAddress = '';
      this.formData.fdVisitAddressId = '';
      this.formData.fdVisitName = '';
      this.formData.fdVisitMobile = '';
      this.formData.fdVisitJob = '';
      this.formData.fdVisitWay = '';
    },
    handleChangeVisitWay(res) {
      this.formData.fdVisitWay = (res[0] || {}).value;
      this.formData.fdVisitAddress = '';
      this.formData.fdVisitAddressId = '';
    },
    handleChangeVisitor(value) {
      this.formData = {
        ...this.formData,
        fdVisitName: value[0].name,
        fdVisitMobile: value[0].phone,
        fdVisitJob: value[0].position,
      };
    },
    async handleSelectAddress(res) {
      res = res[0];
      if (!res) {
        return;
      }

      const { data = {}, text, value } = res;

      const {
        province = '',
        city = '',
        district = '',
        township = '',
        adcode,
      } = data.addressComponent || {};

      const officeAddresAddParam = {
        fdMainId: this.formData.fdModuleTypeId,
        fdProvince: typeof province === 'string' ? province : '',
        fdCity: typeof city === 'string' ? city : '',
        fdCounty: typeof district === 'string' ? district : '',
        fdStreet: typeof township === 'string' ? township : '',
        fdDetailaddress: text,
        fdLongitude: Number(value.split(',')[0]),
        fdLatitude: Number(value.split(',')[1]),
        fdAdcode: adcode,
        createByName: this.user.name,
      };

      const addressData = await api.customer.postAddCustomerOfficeAddres([
        officeAddresAddParam,
      ]);
      this.formData.fdVisitAddress = (addressData[0] || {}).fdDetailaddress;
      this.formData.fdVisitAddressId = (addressData[0] || {}).id;
      this.loadAddress(this.formData.fdModuleTypeId);
      this.showMap = false;
    },
  },
};
</script>
