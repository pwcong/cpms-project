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
          title="销售视图设置"
          left-text="取消"
          left-arrow
          right-text="保存"
          @click-left="onCancel"
          @click-right="handleSubmit"
        />
      </template>
      <template v-slot:main="{ className }">
        <div :class="className" style="top: 46px; height: calc(100% - 46px)">
          <van-form ref="form" @submit="onFormSubmit">
            <block>
              <van-field
                readonly
                is-link
                clickable
                name="fdSalesOrganization"
                v-model="tempValue.fdSalesOrganization"
                label="销售组织"
                placeholder="请选择"
                required
                :rules="[{ required: true, message: '请选择销售组织' }]"
                @click="showSalesOrganization = true"
              />

              <van-field
                readonly
                is-link
                clickable
                name="fdSalesOffice"
                v-model="tempValue.fdSalesOffice"
                label="经营部-销售办公室"
                placeholder="请选择"
                required
                :rules="[{ required: true, message: '请选择经营部-销售办公室' }]"
                @click="showBusinessDepartment = true"
              />

              <van-field
                readonly
                required
                clickable
                is-link
                :value="tempValue.fdMarketLevel"
                name="fdMarketLevel"
                label="客户组-市场级别"
                placeholder="请选择"
                @click="showMarketLevel = true"
                :rules="[{ required: true, message: '请选择客户组-市场级别' }]"
              >
                <template #input>
                  <dict-text
                    placeholder="请选择"
                    :value="(tempValue.fdMarketLevel || '').split(',')"
                    dictCode="cpms_shop_level"
                    systemCode="cpms"
                  />
                </template>
              </van-field>

              <van-field
                readonly
                is-link
                clickable
                name="fdChannelOneName"
                v-model="tempValue.fdChannelOneName"
                label="一级渠道"
                placeholder="请选择"
                required
                :rules="[{ required: true, message: '请选择一级渠道' }]"
                @click="showFirstChannel = true"
              />

              <van-field
                readonly
                is-link
                clickable
                name="fdChannelTwoName"
                v-model="tempValue.fdChannelTwoName"
                label="二级渠道"
                placeholder="请选择"
                required
                :rules="[{ required: true, message: '请选择二级渠道' }]"
                @click="showSecondaryChannel = true"
              />

              <van-field
                readonly
                is-link
                clickable
                name="fdChannelThreeName"
                v-model="tempValue.fdChannelThreeName"
                label="三级渠道"
                placeholder="请选择"
                required
                :rules="[{ required: true, message: '请选择三级渠道' }]"
                @click="showThirdChannel = true"
              />

              <van-field
                readonly
                is-link
                clickable
                name="fdSalesMan"
                v-model="tempValue.fdSalesMan"
                label="业务员ZB"
                placeholder="请选择"
                required
                :rules="[{ required: true, message: '请选择业务员ZB' }]"
                @click="showSalesMan = true"
              />
            </block>
          </van-form>
        </div>
      </template>

      <selection-sales-organization
        :fdCorporateCode="companyCode"
        :visible.sync="showSalesOrganization"
        :value="
          !!tempValue.fdSalesOrganizationCode
            ? [
                {
                  text: tempValue.fdSalesOrganization,
                  value: tempValue.fdSalesOrganizationCode,
                },
              ]
            : []
        "
        title="销售组织"
        placeholder="请选择销售组织"
        allow-clear
        searchable
        @change="handleSalesOrganization"
      />

      <selection-business-department
        :fdSaleOrgCode="tempValue.fdSalesOrganizationCode"
        :visible.sync="showBusinessDepartment"
        :value="
          !!tempValue.fdSalesOfficeCode
            ? [
                {
                  text: tempValue.fdSalesOffice,
                  value: tempValue.fdSalesOfficeCode,
                },
              ]
            : []
        "
        title="经营部-销售办公室"
        placeholder="请选择经营部-销售办公室"
        allow-clear
        searchable
        @change="
          (tempValue.fdSalesOffice = ($event[0] || {}).text), (tempValue.fdSalesOfficeCode = ($event[0] || {}).value)
        "
      />

      <selection-dict
        searchable
        :value="
          !!tempValue.fdMarketLevelCode
            ? [
                {
                  text: tempValue.fdMarketLevel,
                  value: tempValue.fdMarketLevelCode,
                },
              ]
            : []
        "
        :visible.sync="showMarketLevel"
        dictCode="cpms_shop_level"
        systemCode="cpms"
        title="客户组-市场级别"
        placeholder="请选择客户组-市场级别"
        @change="
          (tempValue.fdMarketLevel = ($event[0] || {}).text), (tempValue.fdMarketLevelCode = ($event[0] || {}).value)
        "
      />

      <selection-first-channel
        :saleCode="tempValue.fdSalesOrganizationCode"
        :visible.sync="showFirstChannel"
        :value="
          !!tempValue.fdChannelOneCode
            ? [
                {
                  text: tempValue.fdChannelOneName,
                  value: tempValue.fdChannelOneCode,
                },
              ]
            : []
        "
        title="一级渠道"
        placeholder="请选择一级渠道"
        allow-clear
        searchable
        @change="handleFirstChannel"
      />

      <selection-secondary-channel
        :saleCode="tempValue.fdChannelOneCode"
        :visible.sync="showSecondaryChannel"
        :value="
          !!tempValue.fdChannelTwoCode
            ? [
                {
                  text: tempValue.fdChannelTwoName,
                  value: tempValue.fdChannelTwoCode,
                },
              ]
            : []
        "
        title="二级渠道"
        placeholder="请选择二级渠道"
        allow-clear
        searchable
        @change="handleSecondaryChannel"
      />

      <selection-third-channel
        :saleCode="tempValue.fdChannelTwoCode"
        :visible.sync="showThirdChannel"
        :value="
          !!tempValue.fdChannelThreeCode
            ? [
                {
                  text: tempValue.fdChannelThreeName,
                  value: tempValue.fdChannelThreeCode,
                },
              ]
            : []
        "
        title="三级渠道"
        placeholder="请选择三级渠道"
        allow-clear
        searchable
        @change="
          ((tempValue.fdChannelThreeCode = ($event[0] || {}).value) || true) &&
            (tempValue.fdChannelThreeName = ($event[0] || {}).text)
        "
      />

      <selection-salesman
        :visible.sync="showSalesMan"
        :value="
          !!tempValue.fdSalesManCode
            ? [
                {
                  text: tempValue.fdSalesMan,
                  value: tempValue.fdSalesManCode,
                },
              ]
            : []
        "
        title="业务员ZB"
        placeholder="请选择业务员ZB"
        allow-clear
        searchable
        @change="(tempValue.fdSalesMan = ($event[0] || {}).text), (tempValue.fdSalesManCode = ($event[0] || {}).value)"
      />
    </list-layout>
  </van-popup>
</template>

<script>
import { buildSelectionMixin } from '@/mixins';
import SelectionSalesOrganization from '../components/selection/sales-organization';
import SelectionBusinessDepartment from '../components/selection/business-department';
import SelectionFirstChannel from '../components/selection/first-channel';
import SelectionSecondaryChannel from '../components/selection/secondary-channel';
import SelectionThirdChannel from '../components/selection/third-channel';
import SelectionSalesman from '../components/selection/salesman';

const selectionMixin = buildSelectionMixin({
  valueType: 'OBJECT',
  defaultValue: {
    fdSalesOrganization: '', //销售组织
    fdSalesOrganizationCode: '', //销售组织code
    fdSalesOffice: '', //经营部
    fdSalesOfficeCode: '', //经营部code
    fdMarketLevel: '', //客户组-市场级别
    fdMarketLevelCode: '', //客户组-市场级别code
    fdChannelOneName: '', //一级渠道
    fdChannelOneCode: '', //一级渠道编号
    fdChannelTwoName: '', //二级渠道
    fdChannelTwoCode: '', //二级渠道编号
    fdChannelThreeName: '', //三级渠道
    fdChannelThreeCode: '', //三级渠道编号
    fdSalesMan: '', //业务员
    fdSalesManCode: '', //业务员id
  },
});

export default {
  name: 'setting-company',
  mixins: [selectionMixin],
  props: {
    custSapCompanyListAddParamList: {
      type: Array,
    },
  },
  computed: {
    isEdit() {
      return this.mode === 'edit';
    },
    title() {
      return `${!this.isEdit ? '新增' : '编辑'}销售视图`;
    },
  },
  components: {
    SelectionSalesOrganization,
    SelectionBusinessDepartment,
    SelectionFirstChannel,
    SelectionSecondaryChannel,
    SelectionThirdChannel,
    SelectionSalesman,
  },
  watch: {
    custSapCompanyListAddParamList() {
      this.companyCode = this.custSapCompanyListAddParamList
        .map((d) => {
          return d.fdCompanyCode;
        })
        .join(',');
    },
  },
  data() {
    return {
      showSalesOrganization: false,
      showBusinessDepartment: false,
      showMarketLevel: false,
      showFirstChannel: false,
      showSecondaryChannel: false,
      showThirdChannel: false,
      showSalesMan: false,
      companyCode: '',
    };
  },
  methods: {
    handleSalesOrganization(res) {
      this.tempValue.fdSalesOrganizationCode = (res[0] || {}).fdSaleOrgCode;
      this.tempValue.fdSalesOrganization = (res[0] || {}).fdSaleOrgName;
      this.tempValue.fdSalesOffice = '';
      this.tempValue.fdSalesOfficeCode = '';
      this.tempValue.fdMarketLevel = '';
      this.tempValue.fdMarketLevelCode = '';
      this.tempValue.fdChannelOneCode = '';
      this.tempValue.fdChannelOneName = '';
      this.tempValue.fdChannelTwoName = '';
      this.tempValue.fdChannelTwoCode = '';
      this.tempValue.fdChannelThreeName = '';
      this.tempValue.fdChannelThreeCode = '';
    },
    handleFirstChannel(res) {
      this.tempValue.fdChannelOneCode = (res[0] || {}).value;
      this.tempValue.fdChannelOneName = (res[0] || {}).text;
      this.tempValue.fdChannelTwoName = '';
      this.tempValue.fdChannelTwoCode = '';
      this.tempValue.fdChannelThreeName = '';
      this.tempValue.fdChannelThreeCode = '';
    },
    handleSecondaryChannel(res) {
      this.tempValue.fdChannelTwoName = (res[0] || {}).text;
      this.tempValue.fdChannelTwoCode = (res[0] || {}).value;
      this.tempValue.fdChannelThreeName = '';
      this.tempValue.fdChannelThreeCode = '';
    },
    handleSubmit() {
      this.$refs.form.submit();
    },
    async onFormSubmit() {
      this.onOk();
    },
  },
};
</script>
<style lang="scss" scoped></style>
