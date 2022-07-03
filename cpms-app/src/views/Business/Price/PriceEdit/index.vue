<template>
  <list-layout class="page-project-edit">
    <template v-slot:header="{ className }">
      <van-nav-bar
        :class="className"
        :title="`${isEdit ? '编辑' : '新建'}价格申请`"
        left-text="返回"
        left-arrow
        @click-left="handleCancel(true)"
        :right-text="!isEdit || formData.fdStatus === 'draft' ? '暂存' : undefined"
        @click-right="onSubmit('draft')"
      />
    </template>

    <template v-slot:main="{ className }">
      <div :class="className" style="top: 46px; height: calc(100% - 90px)">
        <van-form ref="form" @submit="onSubmit(isEdit ? 'edit' : 'add')">
          <block theme="primary" title="基本信息">
            <van-field
              is-link
              required
              placeholder="请选择"
              :rules="[{ required: true, message: '请输入项目名称' }]"
              :value="formData.fdProjectMainName"
              name="fdProjectMainId"
              label="项目名称"
              clickable
              readonly
              @click="showClient = true"
            />
            <van-field
              is-link
              required
              readonly
              placeholder="请选择"
              :rules="[{ required: true, message: '请选择合同交货时间' }]"
              v-model="formData.fdContractDeliveryTime"
              name="fdContractDeliveryTime"
              label="合同交货时间"
              @click="showPicker = true"
            />
            <van-field
              is-link
              required
              readonly
              placeholder="请选择"
              :rules="[{ required: true, message: '请选择开始时间' }]"
              v-model="formData.fdBeginTime"
              name="fdBeginTime"
              label="开始时间"
              @click="showBeginTime = true"
            />
            <van-field
              is-link
              required
              placeholder="请选择"
              readonly
              :rules="[{ required: true, message: '请选择开单截止时间' }]"
              v-model="formData.fdOrderEndTime"
              name="fdOrderEndTime"
              label="开单截止时间"
              @click="showOrderEndTime = true"
            />
            <van-field
              is-link
              required
              placeholder="请选择"
              readonly
              :rules="[{ required: true, message: '请选择分公司' }]"
              :value="formData.fdBranchCompanyName"
              name="fdBranchCompanyCode"
              label="分公司"
              clickable
              @click="showCompany = true"
            />
            <van-field
              is-link
              required
              readonly
              placeholder="请选择"
              :rules="[{ required: true, message: '请选择销售部' }]"
              v-model="formData.fdSaleDeptName"
              name="fdSaleDeptCode"
              label="销售部"
              @click="showSapSale = true"
            />
            <van-field
              is-link
              readonly
              placeholder="请选择"
              v-model="formData.fdCustName"
              name="fdCustName"
              label="客户名称"
              @click="showCustomer = true"
            />
            <van-field
              is-link
              required
              readonly
              :rules="[{ required: true, message: '请选择CRM客户名称' }]"
              placeholder="请选择"
              v-model="formData.fdSapCustName"
              name="fdSapCustName"
              label="CRM客户名称"
              @click="showSapCustName = true"
            />
            <van-field
              is-link
              placeholder="请选择"
              v-model="formData.fdChannelOneName"
              name="fdChannelOneName"
              label="一级渠道"
              readonly
            />
            <van-field
              is-link
              placeholder="请选择"
              v-model="formData.fdChannelTwoName"
              name="fdChannelTwoName"
              label="二级渠道"
              readonly
            />
            <van-field
              is-link
              placeholder="请选择"
              required
              readonly
              :rules="[{ required: true, message: '请选择联系人' }]"
              v-model="formData.fdUserName"
              name="fdUserName"
              label="联系人"
            />
            <van-field
              is-link
              placeholder="请选择"
              required
              readonly
              :rules="[{ required: true, message: '请选择联系电话' }]"
              v-model="formData.fdUserMobile"
              name="fdUserMobile"
              label="联系电话"
            />
            <van-field
              is-link
              placeholder="请选择"
              readonly
              v-model="formData.fdCity"
              name="fdCity"
              label="项目所在城市"
            />
            <van-field
              is-link
              readonly
              placeholder="请选择"
              :value="formData.fdIsRegion > 0 ? '是' : '否'"
              name="fdIsRegion"
              label="项目是否跨区"
            />
            <van-field
              is-link
              readonly
              placeholder="请输入"
              :value="formatAmount(fdEstimatedRevenue)"
              name="fdEstimatedRevenue"
              label="项目预计收入(元)"
            />
            <!-- <van-field
              is-link
              placeholder="请选择"
              required
              :rules="[{ required: true, message: '请选择分公司' }]"
              v-model="formData.billingPerson"
              name="billingPerson"
              label="分公司"
            /> -->
            <van-field
              required
              :rules="[{ required: true }]"
              show-word-limit
              v-model="formData.fdApplyReason"
              name="fdApplyReason"
              rows="4"
              type="textarea"
              maxlength="500"
              label="申请理由"
              placeholder="请输入申请理由"
            />
            <van-field
              readonly
              name="files"
              :value="(formData.sysAttContractAspectParams || []).map((d) => d.value).join(',')"
              label="价格附件"
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
          <price-list v-model="formData" :moduleId="id" />
        </van-form>
      </div>
    </template>
    <template v-slot:footer="{ className }">
      <div :class="className">
        <oasubmit-wrapper
          :beforeSubmit="handleBeforeSubmit"
          :moduleId="id"
          moduleFlag="cpms_project_price_main"
          :status="formData.fdStatus"
          @submit="handleSubmit($event)"
        >
          <van-button :loading="loading" block type="danger">
            {{ formData.fdStatus === 'draft' ? '提交' : isEdit ? '保存' : '提交' }}
          </van-button>
        </oasubmit-wrapper>
      </div>
    </template>
    <selection-project
      status="follow"
      :value="
        !!formData.fdProjectMainId
          ? [
              {
                value: formData.fdProjectMainId,
                text: formData.fdProjectMainName,
              },
            ]
          : []
      "
      :visible.sync="showClient"
      @change="handleChangeProject"
      searchable
    />
    <selection-sap-company
      :value="
        !!formData.fdBranchCompanyCode
          ? [
              {
                value: formData.fdBranchCompanyCode,
                text: formData.fdBranchCompanyName,
              },
            ]
          : []
      "
      :visible.sync="showCompany"
      @change="handleChangeFdBranchCompanyCode"
      searchable
    />
    <selection-sap-sale
      :sapCompanyCode="formData.fdBranchCompanyCode"
      :value="
        !!formData.fdSaleDeptCode
          ? [
              {
                value: formData.fdSaleDeptCode,
                text: formData.fdSaleDeptName,
              },
            ]
          : []
      "
      @change="handleChangeFdSaleDeptCode"
      :visible.sync="showSapSale"
      searchable
    />
    <selection-customer
      status="pass"
      :value="
        !!formData.fdCustName
          ? [
              {
                value: formData.fdCustMainId,
                text: formData.fdCustName,
              },
            ]
          : []
      "
      @change="handlenCustMainId"
      :visible.sync="showCustomer"
      searchable
    />
    <selection-crm-customer
      :value="
        !!formData.fdSapCustName
          ? [
              {
                text: formData.fdSapCustName,
                value: formData.fdSapCustCode,
              },
            ]
          : []
      "
      @change="handlenSapCustName"
      :customerId="formData.fdCustMainId"
      :branchCode="formData.fdBranchCompanyCode"
      :deptCode="formData.fdSaleDeptCode"
      :visible.sync="showSapCustName"
      searchable
    />
    <van-popup v-model="showPicker" position="bottom">
      <van-datetime-picker
        type="date"
        title="合同交货时间"
        @cancel="showPicker = false"
        @confirm="handlePickerConfirm"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
    <van-popup v-model="showBeginTime" position="bottom">
      <van-datetime-picker
        type="date"
        title="开始时间"
        @cancel="showBeginTime = false"
        @confirm="handleBeginTime"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
    <van-popup v-model="showOrderEndTime" position="bottom">
      <van-datetime-picker
        type="date"
        title="开单截止时间"
        @cancel="showOrderEndTime = false"
        @confirm="handleOrderEndTime"
        :min-date="minDate"
        :max-date="maxDate"
      />
    </van-popup>
  </list-layout>
</template>

<script>
import dayjs from 'dayjs';
import { userMixin } from '@/mixins';
import PriceList from './price-list';
import formMixin from './form';
import SelectionProject from '@/views/components/selection/project';
import SelectionSapCompany from '@/views/components/selection/sap-company';
import SelectionSapSale from '@/views/components/selection/sap-sale';
import SelectionCustomer from '@/views/components/selection/customer';
import SelectionCrmCustomer from '@/views/components/selection/crm-customer';
export default {
  mixins: [userMixin, formMixin],
  data() {
    const { id } = this.$route.params;
    return {
      id,
      showClient: false,
      showCompany: false,
      showSapSale: false,
      showCustomer: false,
      showSapCustName: false,
      showPicker: false,
      showBeginTime: false,
      showOrderEndTime: false,
      minDate: new Date(),
      maxDate: new Date(2025, 10, 1),
    };
  },
  components: {
    PriceList,
    SelectionProject,
    SelectionSapCompany,
    SelectionSapSale,
    SelectionCustomer,
    SelectionCrmCustomer,
  },
  created() {
    this.initFormData(this.id);
  },
  computed: {
    isEdit() {
      return !!this.id;
    },
  },
  methods: {
    handleBeforeSubmit() {
      if (this.loading) {
        return false;
      }

      return new Promise((resolve) => {
        this.$refs.form
          .validate()
          .then(() => {
            if (!this.checkFormData(this.formData)) {
              resolve(false);
              return;
            }
            resolve(true);
          })
          .catch(() => resolve(false));
      });
    },
    handleSubmit(form) {
      this.formData = {
        ...this.formData,
        ...(form || {}),
      };
      this.$refs.form.submit();
    },
    onSubmit(action) {
      if (this.loading) {
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
    handleChangeProject(res) {
      this.formData.fdProjectMainId = (res[0] || {}).value;
      this.formData.fdProjectMainName = (res[0] || {}).text;
      res = res[0];

      if (!res) {
        this.formData.fdProjectMainId = '';
        this.formData.fdProjectMainName = '';
        this.formData.fdCustMainId = '';
        this.formData.fdCustName = '';
        this.formData.fdChannelOneName = '';
        this.formData.fdChannelOneCode = '';
        this.formData.fdChannelTwoName = '';
        this.formData.fdChannelTwoCode = '';
        this.formData.fdSapCustName = '';
        this.formData.fdSapCustCode = '';
        this.formData.fdIsRegion = '';
        this.formData.priceMessageListAddParams = [];
      } else {
        this.loadProject(res.value);
      }
    },
    handleChangeFdBranchCompanyCode(res) {
      this.formData.fdBranchCompanyCode = (res[0] || {}).value;
      this.formData.fdBranchCompanyName = (res[0] || {}).text;
      this.formData.fdSaleDeptCode = '';
      this.formData.fdSaleDeptName = '';

      this.getCrmCustInfo(this.formData.fdBranchCompanyCode, this.formData.fdCustMainId, this.formData.fdSaleDeptCode);
    },
    handleChangeFdSaleDeptCode(res) {
      this.formData.fdSaleDeptCode = (res[0] || {}).value;
      this.formData.fdSaleDeptName = (res[0] || {}).text;
      this.getCrmCustInfo(this.formData.fdBranchCompanyCode, this.formData.fdCustMainId, this.formData.fdSaleDeptCode);
    },
    handlenCustMainId(value) {
      this.formData.fdCustName = (value[0] || {}).text;
      this.formData.fdCustMainId = (value[0] || {}).value;

      this.getCrmCustInfo(this.formData.fdBranchCompanyCode, this.formData.fdCustMainId, this.formData.fdSaleDeptCode);
    },
    handlenSapCustName(res) {
      this.formData.fdSapCustName = (res[0] || {}).text;
      this.formData.fdSapCustCode = (res[0] || {}).value;
      this.formData.fdChannelOneName = (res[0] || {}).fdChannelOneName;
      this.formData.fdChannelOneCode = (res[0] || {}).fdChannelOneCode;
      this.formData.fdChannelTwoName = (res[0] || {}).fdChannelTwoName;
      this.formData.fdChannelTwoCode = (res[0] || {}).fdChannelTwoCode;
    },
    handlePickerConfirm(time) {
      // "YYYY-MM-DD HH:mm:ss"
      this.formData.fdContractDeliveryTime = dayjs(new Date(time)).format('YYYY-MM-DD');
      this.showPicker = false;
    },
    // handleBeginTime
    handleBeginTime(time) {
      // "YYYY-MM-DD HH:mm:ss"
      this.formData.fdBeginTime = dayjs(new Date(time)).format('YYYY-MM-DD');
      this.showBeginTime = false;
    },
    handleOrderEndTime(time) {
      // "YYYY-MM-DD HH:mm:ss"
      this.formData.fdOrderEndTime = dayjs(new Date(time)).format('YYYY-MM-DD');
      this.showOrderEndTime = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
