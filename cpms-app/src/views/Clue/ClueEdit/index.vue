<template>
  <list-layout class="page-project-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        :title="`${isEdit ? '编辑' : '新建'}线索`"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(true)"
        :right-text="!isEdit || formData.fdClueStatus === 'draft' ? '暂存' : undefined"
        @click-right="onSubmit('draft')"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 90px)">
        <van-form ref="form" @submit="onSubmit(isEdit ? 'edit' : 'add')">
          <block theme="primary" title="基本信息">
            <template v-slot:action>
              <div v-if="!!formData.fdTerminalClient && !!formData.fdEnterpriseId">
                <span @click="checkSkyeyeDetails" class="checkSkyeye"> 查看天眼查客户详情 </span>
              </div>
            </template>
            <van-field
              v-model="formData.fdClueName"
              :rules="[{ required: true, message: '请输入线索名称' }]"
              label="线索名称"
              :maxlength="200"
              placeholder="请输入"
              required
            />
            <van-field
              v-model="formData.fdClueDescription"
              required
              rows="2"
              label="线索描述"
              type="textarea"
              :maxlength="500"
              :rules="[{ required: true, message: '请输入线索描述' }]"
              show-word-limit
              placeholder="请输入"
            />

            <van-field
              is-link
              clickable
              readonly
              v-model="formData.fdTerminalClient"
              label="终端客户名称"
              placeholder="请输入"
              @click="(showTianyancha = true) && (tianyanchaFlag = 'terminal')"
            />

            <van-field
              :rules="[{ required: true, message: '请选择线索来源' }]"
              :value="formData.fdClueSource"
              clickable
              is-link
              label="线索来源"
              placeholder="请选择线索来源"
              readonly
              required
              @click="showSource = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdClueSource || '').split(',')"
                  dictCode="cpms_clue_source"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field v-model="formData.fdClueContactName" :maxlength="200" label="线索联系人" placeholder="请输入" />
            <van-field v-model="formData.fdClueContactMobile" :maxlength="200" label="联系方式" placeholder="请输入" />
            <van-field
              :rules="[{ required: true, message: '请选择省' }]"
              :value="formData.fdProvinceCode"
              clickable
              is-link
              label="省"
              placeholder="请选择省"
              readonly
              required
              @click="showProvince = true"
            >
              <template #input>
                <province-text :value="(formData.fdProvinceCode || '').split(',')" />
              </template>
            </van-field>
            <van-field
              :rules="[{ required: true, message: '请选择市' }]"
              :value="formData.fdCityCode"
              clickable
              is-link
              label="市"
              placeholder="请选择市"
              readonly
              required
              @click="onBeforeSelectCity"
            >
              <template #input>
                <city-text :provinceCode="formData.fdProvinceCode" :value="(formData.fdCityCode || '').split(',')" />
              </template>
            </van-field>
            <van-field
              :value="formData.productLineList.map((d) => d.fdProductLineName).join('.')"
              autosize
              clickable
              is-link
              label="产品线"
              placeholder="请选择产品线"
              readonly
              rows="1"
              type="textarea"
              @click="showProductLine = true"
            >
            </van-field>
            <van-field
              :rules="[{ required: true, message: '请选择线索类型' }]"
              :value="formData.fdClueType"
              clickable
              is-link
              label="线索类型"
              placeholder="请选择线索类型"
              readonly
              required
              @click="showType = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdClueType || '').split(',')"
                  dictCode="cpms_clue_type"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field
              :value="formData.fdAgencyName"
              clickable
              is-link
              label="所属机构"
              placeholder="请选择所属机构"
              readonly
              @click="showAgency = true"
            />
            <van-field
              is-link
              clickable
              v-model="formData.fdCustName"
              label="代理商名称"
              placeholder="请输入"
              @click="(showTianyancha = true) && (tianyanchaFlag = 'cust')"
            />
            <van-field
              :max="1"
              :value="formData.fdUserName"
              is-link
              label="跟进人"
              placeholder="请选择"
              @click="showFollow = true"
            />
            <van-field
              rows="1"
              is-link
              type="textarea"
              :maxlength="500"
              label="可见范围-部门"
              placeholder="请选择"
              :value="formData.sysDatascopeDeptAspectParams.map((d) => d.fdDeptName).join(';')"
              clickable
              readonly
              @click="showOrg = true"
            />
            <van-field v-model="formData.fdBiddingNumber" :maxlength="200" label="招标编号" placeholder="请输入" />
            <van-field
              rows="1"
              is-link
              type="textarea"
              label="可见范围-人员"
              placeholder="请选择"
              :value="formData.sysDatascopePersonAspectParams.map((d) => d.fdPersonName).join(';')"
              clickable
              readonly
              @click="showUser = true"
            />
            <van-field
              v-model="formData.fdOtherRemark"
              :maxlength="500"
              label="备注"
              placeholder="请输入"
              rows="2"
              type="textarea"
            />
          </block>
          <block theme="primary" title="客户详情">
            <van-field
              :value="formData.fdCustIndustry"
              clickable
              is-link
              label="所属行业"
              placeholder="请选择所属行业"
              readonly
              @click="showIndustry = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdCustIndustry || '').split(',')"
                  dictCode="cpms_business"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field v-model="formData.fdCompanyType" :maxlength="200" label="公司类型" placeholder="请输入" />
            <van-field v-model="formData.fdCustContactPhone" :maxlength="200" label="电话" placeholder="请输入" />
            <van-field v-model="formData.fdCustContactMobile" maxlength="11" label="手机" placeholder="请输入" />
            <van-field v-model="formData.fdCompanyWeb" :maxlength="200" label="网址" placeholder="请输入" />
            <van-field
              :value="formData.fdCompanyRegtime"
              clickable
              is-link
              label="成立时间"
              name="date"
              placeholder="点击选择时间"
              readonly
              @click="showPicker = true"
            />
            <van-field
              v-model="formData.fdTotalCount"
              :rules="[{ min: 1, message: '总人数不少于1人' }]"
              label="公司总人数"
              placeholder="请输入"
              type="digit"
            />
            <van-field
              :value="formData.fdSalesVolumeint"
              readonly
              clickable
              is-link
              label="年度销量(万)"
              name="fdSalesVolumeint"
              @click="showSalesVolumeint = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdSalesVolumeint || '').split(',')"
                  dictCode="cpms_cust_sales_volumeint"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field
              :value="formData.fdPurchaseAmount"
              readonly
              label="年度采购额(万)"
              name="fdPurchaseAmount"
              clickable
              is-link
              placeholder="请选择"
              @click="showPurchaseAmount = true"
            >
              <template #input>
                <dict-text
                  placeholder="请选择"
                  :value="(formData.fdPurchaseAmount || '').split(',')"
                  dictCode="cpms_cust_purchase_amount"
                  systemCode="cpms"
                />
              </template>
            </van-field>
            <van-field v-model="formData.fdBrand" :maxlength="200" label="旗下品牌" placeholder="请输入" />
            <van-field v-model="formData.fdKeyDept" :maxlength="200" label="关键部门" placeholder="请输入" />
            <van-field
              v-model="formData.fdRegCapital"
              :rules="[{ min: 0, message: '注册资本不小于0' }]"
              label="注册资本"
              placeholder="请输入"
              type="number"
            />
            <van-field v-model="formData.fdRegStatus" :maxlength="200" label="企业状态" placeholder="请输入" />
            <van-field
              v-model="formData.fdUserCommunity"
              label="用户群体"
              :maxlength="500"
              placeholder="请输入"
              rows="2"
              type="textarea"
            />
          </block>
          <!-- 天眼查详情 -->
          <skyeye-detail
            :fdEnterpriseId="formData.fdEnterpriseId"
            :customerId="id"
            :version="formData.version"
            :visible.sync="skyeyeVisible"
          />
          <contact-list v-model="formData" />
          <address-list v-model="formData" />
        </van-form>
      </div>
    </template>

    <template v-slot:footer="{ className }">
      <div :class="className">
        <van-button :loading="loading" block type="danger" @click="handleSubmit"> 提交 </van-button>
      </div>
    </template>
    <selection-province
      searchable
      :visible.sync="showProvince"
      :value="!!formData.fdProvinceCode ? [{ value: formData.fdProvinceCode }] : []"
      title="选择省"
      @change="handleSelectProvince"
    />
    <selection-city
      searchable
      :provinceCode="formData.fdProvinceCode"
      :value="!!formData.fdCityCode ? [{ value: formData.fdCityCode }] : []"
      :visible.sync="showCity"
      title="选择市"
      @change="handleSelectCity"
    />
    <selection-dict
      searchable
      :value="!!formData.fdClueSource ? [{ value: formData.fdClueSource }] : []"
      :visible.sync="showSource"
      dictCode="cpms_clue_source"
      systemCode="cpms"
      title="选择线索来源"
      @change="handleSelectSource"
    />
    <selection-product-line
      searchable
      :value="
        formData.productLineList.map((d) => ({
          text: d.fdProductLineName,
          value: d.fdProductLineCode,
        }))
      "
      :visible.sync="showProductLine"
      multiple
      title="选择产品线"
      @change="handleSelectProductLine"
    />
    <selection-dict
      searchable
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
      :visible.sync="showType"
      dictCode="cpms_clue_type"
      systemCode="cpms"
      title="选择线索来源"
      @change="handleSelectType"
    />
    <selection-agency
      searchable
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
      :visible.sync="showAgency"
      title="选择所属机构"
      @change="handleSelectAgency"
    />
    <selection-dict
      searchable
      :value="!!formData.fdCustIndustry ? [{ value: formData.fdCustIndustry }] : []"
      :visible.sync="showIndustry"
      dictCode="cpms_business"
      systemCode="cpms"
      title="选择所属行业"
      @change="formData.fdCustIndustry = $event[0].value"
    />
    <selection-user
      searchable
      multiple
      :visible.sync="showUser"
      :value="
        formData.sysDatascopePersonAspectParams.map((d) => ({
          text: d.fdPersonName,
          value: d.fdPersonId,
        }))
      "
      title="选择可见范围-人员"
      @change="handleSelectUser"
    />
    <selection-org
      searchable
      orgType="1"
      multiple
      :visible.sync="showOrg"
      title="选择可见范围-部门"
      :value="
        formData.sysDatascopeDeptAspectParams.map((d) => ({
          text: d.fdDeptName,
          value: d.fdDeptId,
        }))
      "
      @change="handleSelectOrg"
    />
    <selection-user
      searchable
      :visible.sync="showFollow"
      :value="!!formData.fdLoginName ? [{ value: formData.fdLoginName }] : []"
      title="选择跟进人"
      @change="handleSelectFollow"
    />
    <selection-dict
      searchable
      :value="!!formData.fdSalesVolumeint ? [{ value: formData.fdSalesVolumeint }] : []"
      :visible.sync="showSalesVolumeint"
      dictCode="cpms_cust_sales_volumeint"
      systemCode="cpms"
      title="选择年度销量"
      placeholder="请选择"
      @change="formData.fdSalesVolumeint = ($event[0] || {}).value"
    />
    <selection-dict
      searchable
      :value="!!formData.fdPurchaseAmount ? [{ value: formData.fdPurchaseAmount }] : []"
      :visible.sync="showPurchaseAmount"
      dictCode="cpms_cust_purchase_amount"
      systemCode="cpms"
      title="选择年度采购额"
      placeholder="请选择"
      @change="formData.fdPurchaseAmount = ($event[0] || {}).value"
    />
    <selection-tianyancha
      :visible.sync="showTianyancha"
      :keyword="tianyanchaFlag === 'terminal' ? formData.fdTerminalClient : formData.fdCustName"
      placeholder="请选择"
      allow-clear
      searchable
      @change="handleChangeTianyancha"
    />
    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker type="date" @cancel="showPicker = false" @confirm="handlePickerConfirm" />
    </van-popup>
  </list-layout>
</template>

<script>
import { userMixin } from '@/mixins';

import api from '@/api';

import dayjs from 'dayjs';
import SelectionProvince from '@/views/components/selection/province';
import { ProvinceText } from '@/views/components/selection/province';
import SelectionCity from '@/views/components/selection/city';
import { CityText } from '@/views/components/selection/city';
import SelectionProductLine from '@/views/components/selection/product-line';
import SelectionAgency from '@/views/components/selection/agency';
import SkyeyeDetail from '../../Customer/InterdCustomerEdit/skyeye-detail.vue';
import SelectionTianyancha from '@/views/components/selection/tianyancha';

import ContactList from './contact-list';
import AddressList from './address-list';

import formMixin from './form';

export default {
  name: 'ClueEdit',
  mixins: [userMixin, formMixin],
  components: {
    SelectionProvince,
    ProvinceText,
    SelectionCity,
    CityText,
    SelectionProductLine,
    SelectionAgency,
    ContactList,
    AddressList,
    SkyeyeDetail,
    SelectionTianyancha,
  },
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showProvince: false,
      showCity: false,
      showSource: false,
      showProductLine: false,
      showType: false,
      showAgency: false,
      showIndustry: false,
      showPicker: false,
      showUser: false,
      showOrg: false,
      showFollow: false,
      showPurchaseAmount: false,
      showSalesVolumeint: false,
      skyeyeVisible: false,
      showTianyancha: false,
      tianyanchaFlag: 'terminal',
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
    handleSubmit() {
      this.$refs.form.submit();
    },

    //天眼查
    async handleChangeTianyancha(res) {
      res = res[0];
      if (!res) {
        return;
      }
      const tianyanchaInfo = await api.customer.getCustomerTianyanchaInfo((res || []).id);
      if (this.tianyanchaFlag === 'terminal') {
        this.formData = {
          ...this.formData,
          fdTerminalClient: tianyanchaInfo.data.fdName,
          fdClientId: tianyanchaInfo.data.fdCustId,
          fdUnifiedCode: tianyanchaInfo.data.fdCreditCode,
          fdEnterpriseId: tianyanchaInfo.data.fdEnterpriseId,
          fdCompanyType: tianyanchaInfo.data.fdCompanyOrgType, //企业类型 公司类型
          fdCompanyRegassets: tianyanchaInfo.data.fdRegCapital, //注册资金
          fdRegStatus: tianyanchaInfo.data.fdRegStatus, //企业状态
          fdRegCapital: tianyanchaInfo.data.fdRegCapital, //注册资本
          fdTotalCount: tianyanchaInfo.data.fdStaffNumRange, //人员规模  公司总人数
          fdCompanyRegtime: tianyanchaInfo.data.fdEstiblishTime
            ? dayjs(new Date(tianyanchaInfo.data.fdEstiblishTime)).format('YYYY-MM-DD')
            : tianyanchaInfo.data.fdEstiblishTime,
          fdRegLocation: tianyanchaInfo.data.fdRegLocation,
        };
      } else {
        this.formData = {
          ...this.formData,
          fdCustName: tianyanchaInfo.data.fdName,
          fdCustMainId: tianyanchaInfo.data.fdCustId,
          fdCustUnifiedCode: tianyanchaInfo.data.fdCreditCode,
        };
      }
    },
    onSubmit(action) {
      if (action !== 'draft' && (!!this.loading || !this.checkFormData(this.formData))) {
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
    handleSelectProvince(res) {
      this.formData.fdProvinceCode = (res[0] || {}).value;
      this.formData.fdProvinceName = (res[0] || {}).text;
      this.formData.fdCityCode = '';
      this.formData.fdCityName = '';
    },
    onBeforeSelectCity() {
      if (!this.formData.fdProvinceCode) {
        this.$toast.fail('请先选择省');
        return;
      }
      this.showCity = true;
    },
    handleSelectCity(res) {
      this.formData.fdCityCode = (res[0] || {}).value;
      this.formData.fdCityName = (res[0] || {}).text;
    },
    handleSelectSource(res) {
      this.formData.fdClueSource = (res[0] || {}).value;
      // this.formData.fdClueSourceName = (res[0] || {}).text
    },
    handleSelectProductLine(res) {
      this.formData.productLineList = res.map((d) => ({
        fdProductLineName: d.text,
        fdProductLineCode: d.value,
      }));
    },
    handleSelectType(res) {
      this.formData.fdClueType = (res[0] || {}).value;
      this.formData.fdClueTypeName = (res[0] || {}).text;
    },
    handleSelectAgency(res) {
      this.formData.fdAgencyCode = (res[0] || {}).value;
      this.formData.fdAgencyName = (res[0] || {}).text;
    },
    handlePickerConfirm(time) {
      // "YYYY-MM-DD HH:mm:ss"
      this.formData.fdCompanyRegtime = dayjs(time).format('YYYY-MM-DD');
      this.showPicker = false;
    },
    handleSelectUser(res) {
      this.formData.sysDatascopePersonAspectParams = res.map((d) => ({
        ...d,
        fdPersonId: d.value,
        fdPersonName: d.text,
      }));
    },
    handleSelectOrg(res) {
      this.formData.sysDatascopeDeptAspectParams = res.map((d) => ({
        ...d,
        // 页面详情查询返回kv与组织查询返回字段不同，在此特殊处理
        fdDeptId: d.value,
        fdDeptName: d.text,
      }));
    },
    handleSelectFollow(res) {
      this.formData.fdLoginName = (res[0] || {}).uid;
      this.formData.fdUserName = (res[0] || {}).name;
    },
    checkSkyeyeDetails() {
      this.skyeyeVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/scss/table.scss';
.page-project-edit {
  .checkSkyeye {
    font-size: 12px;
    color: $theme-color;
  }
}
</style>
